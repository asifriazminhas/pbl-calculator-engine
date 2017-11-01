import { Data } from '../engine/data';
import {
    SingleAlgorithmModel,
    MultipleAlgorithmModel,
    getAlgorithmForModelAndData,
    ModelType,
} from '../engine/model';
import {
    getLeafFieldsForDerivedField,
    calculateCoefficent,
} from '../engine/derived-field/derived-field';
import { DerivedField } from '../engine/derived-field';
import { Covariate } from '../engine/cox/covariate';
import { Cox } from '../engine/cox/cox';
import * as fs from 'fs';
var csvParse = require('csv-parse/lib/sync');
import * as path from 'path';
import { AlgorithmBuilder } from '../engine/algorithm-builder/algorithm-builder';
import { parseModelJsonToModel } from '../engine/json-parser';
import { expect } from 'chai';

const AssetsDir = path.join(__dirname, '../../assets/test');

type TestObjects = {
    derivedField: DerivedField;
    inputData: Data[];
    outputData: string[];
}[];

function convertInputDataRowToData(inputData: { [index: string]: any }): Data {
    return Object.keys(inputData).map(inputDataKey => {
        const inputDatum = inputData[inputDataKey];
        let formattedDatum = null;

        if (inputDatum === 'NA') {
            formattedDatum = null;
        } else if (isNaN(inputDatum)) {
            formattedDatum = inputDatum;
        } else {
            formattedDatum = Number(inputDatum);
        }

        return {
            name: inputDataKey,
            coefficent: formattedDatum,
        };
    });
}

function getTestObjectForCovariates(
    covariates: Covariate[],
    testingDataTable: {
        [index: string]: string;
    }[],
): TestObjects {
    return covariates
        .map(covariate => {
            if (covariate.derivedField) {
                const derivedField = covariate.derivedField;

                const leafNodesForDerivedField = getLeafFieldsForDerivedField(
                    covariate.derivedField,
                ).map(field => field.name);

                const inputDataWithLeadNodeColumns = testingDataTable.map(
                    testingDataRow => {
                        return Object.keys(
                            testingDataRow,
                        ).reduce(
                            (inputDataForCovariate, testingDataRowColumn) => {
                                if (
                                    leafNodesForDerivedField.indexOf(
                                        testingDataRowColumn,
                                    ) > -1
                                ) {
                                    return Object.assign(
                                        {},
                                        inputDataForCovariate,
                                        {
                                            [testingDataRowColumn]:
                                                testingDataRow[
                                                    testingDataRowColumn
                                                ],
                                        },
                                    );
                                } else {
                                    return inputDataForCovariate;
                                }
                            },
                            {},
                        );
                    },
                );
                const inputData = inputDataWithLeadNodeColumns.map(inputData =>
                    convertInputDataRowToData(inputData),
                );

                const outputData = testingDataTable.map(testingDataTableRow => {
                    return testingDataTableRow[covariate.name];
                });

                return { derivedField, inputData, outputData };
            } else {
                return undefined;
            }
        })
        .filter(setupObject => {
            return setupObject;
        }) as TestObjects;
}

function getTestObjectForSingleAlgorithmModel(
    model: SingleAlgorithmModel,
    testingData: {
        [index: string]: string;
    }[],
) {
    return getTestObjectForCovariates(model.algorithm.covariates, testingData);
}

const genderData = [
    {
        name: 'sex',
        coefficent: 'male',
    },
    {
        name: 'sex',
        coefficent: 'female',
    },
];
function getTestObjectForMultipleAlgorithmModel(
    model: MultipleAlgorithmModel,
    testingData: {
        male: {
            [index: string]: string;
        }[];
        female: {
            [index: string]: string;
        }[];
    },
): TestObjects[] {
    return genderData.map(genderDatum => {
        return getTestObjectForCovariates(
            getAlgorithmForModelAndData(model, [genderDatum]).covariates,
            (testingData as any)[genderDatum.coefficent],
        );
    });
}

function assertionsForTestingObjects(
    testingObjects: TestObjects,
    userFunctions: Cox['userFunctions'],
) {
    testingObjects.forEach(({ derivedField, inputData, outputData }) => {
        inputData.forEach((data, index) => {
            const actualOutput = calculateCoefficent(
                derivedField,
                data,
                userFunctions,
            );
            let expectedOutput: any = outputData[index];
            if (expectedOutput === 'NA') {
                expectedOutput = null;
            }

            let diffError =
                (expectedOutput - (actualOutput as number)) / expectedOutput;
            if (expectedOutput == 0 && actualOutput == 0) {
                diffError = 0;
            } else if (expectedOutput === null && actualOutput === null) {
                diffError = 0;
            }

            expect(
                diffError < 0.00001 || diffError === 0,
                `DerivedField ${derivedField.name}. Input Row: ${index}. Actual Output: ${actualOutput}. ExpectedOutput: ${expectedOutput}. DiffError: ${diffError}`,
            ).to.be.true;
        });
    });
}

describe.only(`Testing local transformations`, async function() {
    fs.readdirSync(`${AssetsDir}/algorithms`).forEach(algorithmName => {
        const algorithmAssetsDir = `${AssetsDir}/algorithms/${algorithmName}`;

        it(`Testing transformations for algorithm ${algorithmName}`, async function() {
            const modelJson = (await AlgorithmBuilder.buildSurvivalAlgorithm().buildFromAssetsFolder(
                algorithmAssetsDir,
            )).toJson();

            const model = parseModelJsonToModel(modelJson);

            if (model.modelType === ModelType.SingleAlgorithm) {
                const testingData = csvParse(
                    fs.readFileSync(
                        `${AssetsDir}/local-transformations/${algorithmName}/testing-data.csv`,
                        'utf8',
                    ),
                    {
                        columns: true,
                    },
                );

                const testingObjects = getTestObjectForSingleAlgorithmModel(
                    model,
                    testingData,
                );

                assertionsForTestingObjects(
                    testingObjects,
                    model.algorithm.userFunctions,
                );
            } else {
                const testingData = {
                    male: csvParse(
                        fs.readFileSync(
                            `${AssetsDir}/local-transformations/${algorithmName}/male/testing-data.csv`,
                            'utf8',
                        ),
                        {
                            columns: true,
                        },
                    ),
                    female: csvParse(
                        fs.readFileSync(
                            `${AssetsDir}/local-transformations/${algorithmName}/female/testing-data.csv`,
                            'utf8',
                        ),
                        {
                            columns: true,
                        },
                    ),
                };

                const testingObjectsForGenders = getTestObjectForMultipleAlgorithmModel(
                    model,
                    testingData,
                );

                genderData.forEach((genderDatum, index) => {
                    assertionsForTestingObjects(
                        testingObjectsForGenders[index],
                        getAlgorithmForModelAndData(model, [genderDatum])
                            .userFunctions,
                    );
                });
            }
        });
    });
});
