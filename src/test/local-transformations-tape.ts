import 'source-map-support/register';

import * as test from 'tape';
import * as fs from 'fs';
import * as path from 'path';
import { AlgorithmBuilder } from '../engine/algorithm-builder/algorithm-builder';
import { parseModelJsonToModel } from '../engine/json-parser/model';
import { Data } from '../engine/common/data';
import { Covariate } from '../engine/cox/covariate';
import { getLeafFieldsForDerivedField, calculateCoefficent } from '../engine/cox/derived-field';
import { ModelType } from '../engine/model/model-type';
import { ModelTypes } from '../engine/model/model-types';
import { getAlgorithmForData } from '../engine/model/multiple-algorithm-model/multiple-algorithm-model';
const csvParse = require('csv-parse/lib/sync');
import { Cox } from '../engine/cox/cox';
import { expect } from 'chai';
var tapSpec = require('tap-spec');
test.createStream().pipe(tapSpec()).pipe(process.stdout);

const TestAssetsFolderPath = path
    .join(__dirname, '../../assets/test');
const TestAlgorithmsFolderPath = `${TestAssetsFolderPath}/algorithms`;
const TransformationsTestingDataFolderPath = `${TestAssetsFolderPath}/local-transformations`;

function getAlgorithmNamesToTest(): string[] {
    return fs
        .readdirSync(TestAlgorithmsFolderPath)
        .filter((algorithmName) => algorithmName !== '.DS_Store');
}

async function getModelObjFromAlgorithmName(
    algorithmName: string
): Promise<ModelTypes> {
    const modelJson = (await AlgorithmBuilder
        .buildSurvivalAlgorithm()
        .buildFromAssetsFolder(`${TestAlgorithmsFolderPath}/${algorithmName}`))
        .toJson();

    return parseModelJsonToModel(modelJson);
}

function formatTestingDataCsvColumn(column: any): string | number | null {
    if (column === 'NA') {
        return null;
    } else if (isNaN(column)) {
        return column;
    } else {
        return Number(column);
    }
}

function getDataFromTestingDataCsvRow(
    testingDataCsvRow: {[index: string]: string}
): Data {
    return Object.keys(testingDataCsvRow)
        .map((testingDataCsvColumnName) => {
            
            return {
                name: testingDataCsvColumnName,
                coefficent: formatTestingDataCsvColumn(
                    testingDataCsvRow[testingDataCsvColumnName]
                )
            }
        });
}

function getTestingDataForCovariate(
    covariate: Covariate,
    testingDataCsv: {[index: string]: string}[]
): {
    inputData: Data[],
    expectedOutputs: (number | null)[]
} {
    if(covariate.derivedField) {
        const leafFields = getLeafFieldsForDerivedField(
            covariate.derivedField
        );
        const leadFieldNames = leafFields.map((leafField) => leafField.name);

        const inputData = testingDataCsv
            .map((testingDataCsvRow) => {
                const testingDataCsvRowColumns = Object
                    .keys(testingDataCsvRow);

                const obj: {[index: string]: string} = {};

                testingDataCsvRowColumns
                    .filter((testingDataCsvRowColumn) => {
                        return leadFieldNames.indexOf(testingDataCsvRowColumn) > -1
                    })
                    .forEach((testingDataCsvRowColumn) => {
                        obj[testingDataCsvRowColumn] = testingDataCsvRow[testingDataCsvRowColumn]
                    })

                return getDataFromTestingDataCsvRow(obj);
            });

        const expectedOutputs = testingDataCsv
            .map((testingDataCsvRow) => {
                return formatTestingDataCsvColumn(testingDataCsvRow[covariate.name]) as number | null
            });

        return {
            inputData,
            expectedOutputs
        };

    } else {
        return {
            inputData: [],
            expectedOutputs: []
        };
    }
}

function testCovariateTransformations(
    covariate: Covariate,
    inputData: Data[],
    expectedOutputs: (number | null)[],
    userFunctions: Cox['userFunctions']
) {
    if(!covariate.derivedField) {
        return;
    }

    const derivedField = covariate.derivedField;

    inputData.forEach((currentInputData, index) => {
        const actualOutput = calculateCoefficent(
            derivedField, 
            currentInputData,
            userFunctions
        );
        let expectedOutput = expectedOutputs[index];
        let diffError: number;
        if(expectedOutput === null && actualOutput === null) {
            diffError = 0;
        } else {
            diffError = (expectedOutput as number - (actualOutput as number))/(expectedOutput as number);
            if(expectedOutput == 0 && actualOutput == 0) {
                diffError = 0;
            }
        }

        expect(diffError < 0.00001 || diffError === 0, `DerivedField ${(derivedField as any).name}. Input Row: ${index}. Actual Output: ${actualOutput}. ExpectedOutput: ${expectedOutput}. DiffError: ${diffError}`).to.be.true
    });
}

function testLocalTransformationsForModel(
    model: ModelTypes,
    modelName: string,
    t: test.Test
) {
    if(model.modelType === ModelType.SingleAlgorithm) {
        const testingCsvData = csvParse(
            fs.readFileSync(
                `${TransformationsTestingDataFolderPath}/${modelName}/testing-data.csv`,
                'utf8'
            ),
            {
                columns: true
            }
        );
        model.algorithm.covariates
            .forEach((covariate) => {
                const { inputData, expectedOutputs } = getTestingDataForCovariate(
                    covariate,
                    testingCsvData
                );

                testCovariateTransformations(
                    covariate, 
                    inputData, 
                    expectedOutputs, 
                    model.algorithm.userFunctions
                );

                t.pass(
                    `Testing transformations for covariate ${covariate.name}`
                )
            });
    } else if(model.modelType === ModelType.MultipleAlgorithm) {
        const genders = ['male', 'female'];

        genders.forEach((gender) => {
            const testingCsvData = csvParse(
                fs.readFileSync(
                    `${TransformationsTestingDataFolderPath}/${modelName}/${gender}/testing-data.csv`,
                    'utf8'
                ),
                {
                    columns: true
                }
            );
            const algorithmForCurrentGender = getAlgorithmForData(
                model,
                [
                    {
                        name: 'sex',
                        coefficent: gender
                    }
                ]
            );

            algorithmForCurrentGender.covariates
                .forEach((covariate) => {
                    const { inputData, expectedOutputs } = getTestingDataForCovariate(
                        covariate,
                        testingCsvData
                    );

                    testCovariateTransformations(
                        covariate, 
                        inputData, 
                        expectedOutputs, 
                        algorithmForCurrentGender.userFunctions
                    );

                    t.pass(
                        `Testing transformations for covariate ${covariate.name}`
                    )
                });
        });
    }

    t.end();
}

test(`Testing local transformations`, async function(t) {
    const namesOfAlgorithmsToTest = getAlgorithmNamesToTest();
    const models = await Promise.all(
        namesOfAlgorithmsToTest
            .map((algorithmName) => {
                return getModelObjFromAlgorithmName(algorithmName);
            })
    );

    models
        .forEach((model, index) => {
            t.test(`Testing local transformations for algorithm ${namesOfAlgorithmsToTest[index]}`, function(t) {
                testLocalTransformationsForModel(
                    model, 
                    namesOfAlgorithmsToTest[index],
                    t
                );
            });
        });
});