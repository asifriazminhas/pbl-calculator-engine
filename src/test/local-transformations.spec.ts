import 'source-map-support/register';

import * as test from 'tape';
import * as fs from 'fs';
import * as path from 'path';
import { SurvivalModelBuilder } from '../engine/survival-model-builder/survival-model-builder';
import { Data } from '../engine/data';
import { Covariate } from '../engine/covariate';
import {
    getLeafFieldsForDerivedField,
    calculateCoefficent,
} from '../engine/derived-field/derived-field';
import { ModelType } from '../engine/model/model-type';
import { ModelTypes } from '../engine/model/model-types';
import { getAlgorithmForData } from '../engine/multiple-algorithm-model';
// tslint:disable-next-line
const createCsvParseStream = require('csv-parse');
import { Cox } from '../engine/cox/cox';
import { expect } from 'chai';
import { RegressionAlgorithmTypes } from '../engine/regression-algorithm/regression-algorithm-types';
import { Stream } from 'stream';

const TestAssetsFolderPath = path.join(__dirname, '../../assets/test');
const TestAlgorithmsFolderPath = `${TestAssetsFolderPath}/algorithms`;
const TransformationsTestingDataFolderPath = `${TestAssetsFolderPath}/local-transformations`;

function getAlgorithmNamesToTest(excludeAlgorithms: string[]): string[] {
    return fs
        .readdirSync(TestAlgorithmsFolderPath)
        .filter(
            algorithmName => excludeAlgorithms.indexOf(algorithmName) === -1,
        )
        .filter(algorithmName => algorithmName !== '.DS_Store');
}

async function getModelObjFromAlgorithmName(
    algorithmName: string,
): Promise<ModelTypes> {
    return (await SurvivalModelBuilder.buildFromAssetsFolder(
        `${TestAlgorithmsFolderPath}/${algorithmName}`,
    )).getModel();
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

function getDataFromTestingDataCsvRow(testingDataCsvRow: {
    [index: string]: string;
}): Data {
    return Object.keys(testingDataCsvRow).map(testingDataCsvColumnName => {
        return {
            name: testingDataCsvColumnName,
            coefficent: formatTestingDataCsvColumn(
                testingDataCsvRow[testingDataCsvColumnName],
            ),
        };
    });
}

function getTestingDataForCovariate(
    covariate: Covariate,
    testingDataCsvRow: { [index: string]: string },
): {
    inputData: Data;
    expectedOutput: number | null;
} {
    if (covariate.derivedField) {
        const leafFields = getLeafFieldsForDerivedField(covariate.derivedField);
        const leadFieldNames = leafFields.map(leafField => leafField.name);

        const testingDataCsvRowColumns = Object.keys(testingDataCsvRow);

        const obj: { [index: string]: string } = {};

        testingDataCsvRowColumns
            .filter(testingDataCsvRowColumn => {
                return leadFieldNames.indexOf(testingDataCsvRowColumn) > -1;
            })
            .forEach(testingDataCsvRowColumn => {
                obj[testingDataCsvRowColumn] =
                    testingDataCsvRow[testingDataCsvRowColumn];
            });

        const inputData = getDataFromTestingDataCsvRow(obj);

        const expectedOutput = formatTestingDataCsvColumn(
            testingDataCsvRow[covariate.name],
        ) as number | null;

        return {
            inputData,
            expectedOutput,
        };
    } else {
        return {
            inputData: [],
            expectedOutput: null,
        };
    }
}

function testCovariateTransformations(
    covariate: Covariate,
    inputData: Data,
    expectedOutput: number | null,
    userFunctions: Cox['userFunctions'],
    tables: Cox['tables'],
) {
    if (!covariate.derivedField) {
        return;
    }

    /*const DataToDebug = [
        { name: 'age', coefficent: 20 },
        { name: 'smk', coefficent: 'smk3' },
        { name: 'evd', coefficent: 'evd1' },
        { name: 's100', coefficent: 's1001' },
        { name: 'wcig', coefficent: null },
        { name: 'stpo', coefficent: 'stpo4' },
        { name: 'stpoy', coefficent: 4 },
        { name: 'agecigd', coefficent: null },
        { name: 'cigdayd', coefficent: null },
        { name: 'cigdayf', coefficent: 3 },
        { name: 'cigdayo', coefficent: null },
        { name: 'dayocc', coefficent: null },
        { name: 'agec1', coefficent: 11 },
    ];
    const CovariateToDebug = 'PackYearsC_rcs1';
    if (
        JSON.stringify(inputData) !== JSON.stringify(DataToDebug) &&
        covariate.name !== CovariateToDebug
    ) {
        return;
    }*/

    const derivedField = covariate.derivedField;

    const actualOutput = calculateCoefficent(
        derivedField,
        inputData,
        userFunctions,
        tables,
    );
    let diffError: number;
    if (expectedOutput === null && actualOutput === null) {
        diffError = 0;
    } else {
        diffError =
            ((expectedOutput as number) - (actualOutput as number)) /
            (expectedOutput as number);
        if (expectedOutput == 0 && actualOutput == 0) {
            diffError = 0;
        }
    }

    expect(
        diffError < 0.00001 || diffError === 0,
        `DerivedField ${(derivedField as any)
            .name}. Input Data: ${JSON.stringify(
            inputData,
        )}. Actual Output: ${actualOutput}. ExpectedOutput: ${expectedOutput}. DiffError: ${diffError}`,
    ).to.be.true;
}

function testLocalTransformationsForModel(
    model: ModelTypes,
    modelName: string,
    t: test.Test,
): Promise<void> {
    if (model.modelType === ModelType.SingleAlgorithm) {
        const testingCsvData = csvParse(
            fs.readFileSync(
                `${TransformationsTestingDataFolderPath}/${modelName}/testing-data.csv`,
                'utf8',
            ),
            {
                columns: true,
            },
        ).slice(65400);
        (model.algorithm as RegressionAlgorithmTypes).covariates.forEach(
            covariate => {
                const {
                    inputData,
                    expectedOutputs,
                } = getTestingDataForCovariate(covariate, testingCsvData);

                testCovariateTransformations(
                    covariate,
                    inputData,
                    expectedOutputs,
                    model.algorithm.userFunctions,
                    model.algorithm.tables,
                );

                t.pass(
                    `Testing transformations for covariate ${covariate.name}`,
                );
            },
        );
    } else if (model.modelType === ModelType.MultipleAlgorithm) {
        return new Promise((resolve, reject) => {
            const genders = ['male', 'female'];

            genders.forEach(gender => {
                t.test(`Testing ${gender} algorithm`, t => {
                    const testingDataFileStream = fs.createReadStream(
                        `${TransformationsTestingDataFolderPath}/${modelName}/${gender}/testing-data.csv`,
                    );
                    const testingDataCsvStream = createCsvParseStream({
                        columns: true,
                    });

                    const testingDataStream: Stream = testingDataFileStream.pipe(
                        testingDataCsvStream,
                    );

                    const algorithmForCurrentGender = getAlgorithmForData(
                        model,
                        [
                            {
                                name: 'sex',
                                coefficent: gender,
                            },
                        ],
                    );

                    testingDataStream.on(
                        'data',
                        (
                            testingDataRow: { [index: string]: string },
                            index: number,
                        ) => {
                            (algorithmForCurrentGender as RegressionAlgorithmTypes).covariates.forEach(
                                covariate => {
                                    const {
                                        inputData,
                                        expectedOutput,
                                    } = getTestingDataForCovariate(
                                        covariate,
                                        testingDataRow,
                                    );

                                    testCovariateTransformations(
                                        covariate,
                                        inputData,
                                        expectedOutput,
                                        algorithmForCurrentGender.userFunctions,
                                        algorithmForCurrentGender.tables,
                                    );
                                },
                            );
                        },
                    );

                    testingDataStream.on('error', (error: Error) => {
                        t.end(error);
                    });

                    testingDataStream.on('end', () => {
                        t.end();

                        return resolve();
                    });
                });
            });
        });
    }
}

test.only(`Testing local transformations`, async function(t) {
    const namesOfAlgorithmsToTest = getAlgorithmNamesToTest([
        'MPoRT',
        'Sodium',
    ]);
    const models = await Promise.all(
        namesOfAlgorithmsToTest.map(algorithmName => {
            return getModelObjFromAlgorithmName(algorithmName);
        }),
    );

    models.forEach((model, index) => {
        t.test(
            `Testing local transformations for algorithm ${namesOfAlgorithmsToTest[
                index
            ]}`,
            async t => {
                await testLocalTransformationsForModel(
                    model,
                    namesOfAlgorithmsToTest[index],
                    t,
                );
            },
        );
    });
});
