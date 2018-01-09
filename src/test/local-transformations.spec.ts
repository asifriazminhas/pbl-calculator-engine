import 'source-map-support/register';

import * as test from 'tape';
import * as fs from 'fs';
import * as path from 'path';
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
import { TestAlgorithmsFolderPath } from './constants';
import { SurvivalModelBuilder } from '../index';
const TestAssetsFolderPath = path.join(__dirname, '../../assets/test');
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

function formatTestingDataCsvColumn(column: any): string | number | undefined {
    if (column === 'NA') {
        return undefined;
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

function isSameData(dataOne: Data, dataTwo: Data): boolean {
    if (dataOne.length !== dataTwo.length) {
        return false;
    }

    return dataOne.find(dataOneDatum => {
        const equivalentDataTwoDatumForCurrentDateOneDatum = dataTwo.find(
            dataTwoDatum => dataTwoDatum.name === dataOneDatum.name,
        );

        if (!equivalentDataTwoDatumForCurrentDateOneDatum) {
            return true;
        }

        return !(
            equivalentDataTwoDatumForCurrentDateOneDatum.coefficent ===
            dataOneDatum.coefficent
        );
    })
        ? false
        : true;
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
        { name: 'age', coefficent: 39 },
        { name: 'smk', coefficent: 'smk1' },
        { name: 'evd', coefficent: undefined },
        { name: 's100', coefficent: 's1001' },
        { name: 'wcig', coefficent: undefined },
        { name: 'stpo', coefficent: undefined },
        { name: 'stpoy', coefficent: undefined },
        { name: 'agecigd', coefficent: 11 },
        { name: 'cigdayd', coefficent: 75 },
        { name: 'cigdayf', coefficent: undefined },
        { name: 'cigdayo', coefficent: undefined },
        { name: 'dayocc', coefficent: undefined },
        { name: 'agec1', coefficent: 9 },
    ];
    const CovariateToDebug = 'PackYearsC_rcs1';
    if (
        !isSameData(DataToDebug, inputData) ||
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

    if (isNaN(actualOutput as number) && expectedOutput === undefined) {
        return;
    }
    if ((actualOutput as number) === 0 && (expectedOutput as number) === 0) {
        return;
    }

    const diffError =
        ((expectedOutput as number) - (actualOutput as number)) /
        (expectedOutput as number);

    // tslint:disable-next-line
    expect(
        diffError < 0.00001 || diffError === 0,
        `Derived Field: ${(derivedField as any).name}
        Input Data: ${JSON.stringify(inputData)}
        Actual Output: ${actualOutput}
        ExpectedOutput: ${expectedOutput}
        DiffError: ${diffError}`,
    ).to.be.true;
}

function testLocalTransformationsForModel(
    model: ModelTypes,
    modelName: string,
    t: test.Test,
) {
    if (model.modelType === ModelType.SingleAlgorithm) {
        const testingDataFileStream = fs.createReadStream(
            `${TransformationsTestingDataFolderPath}/${modelName}/testing-data.csv`,
        );
        const csvParseStream = createCsvParseStream({
            columns: true,
        });

        const testingDataStream = testingDataFileStream.pipe(csvParseStream);

        testingDataStream.on(
            'data',
            (testingDataRow: { [index: string]: string }) => {
                (model.algorithm as RegressionAlgorithmTypes).covariates.forEach(
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
                            model.algorithm.userFunctions,
                            model.algorithm.tables,
                        );

                        t.pass(
                            `Testing transformations for covariate ${covariate.name}`,
                        );
                    },
                );
            },
        );

        testingDataStream.on('error', (error: Error) => {
            t.end(error);
        });

        testingDataStream.on('end', () => {
            t.pass(
                `Local transformations for ${modelName} model correctly calculated`,
            );
            t.end();
        });
    } else if (model.modelType === ModelType.MultipleAlgorithm) {
        const genders = ['female', 'male'];

        genders.forEach(gender => {
            t.test(`Testing ${gender} algorithm`, t => {
                if (
                    !fs.existsSync(
                        `${TransformationsTestingDataFolderPath}/${modelName}/${gender}/testing-data.csv`,
                    )
                ) {
                    t.comment(
                        `No testing data found for ${gender} ${modelName} model. Skipping test`,
                    );
                    return t.end();
                }

                const testingDataFileStream = fs.createReadStream(
                    `${TransformationsTestingDataFolderPath}/${modelName}/${gender}/testing-data.csv`,
                );
                const testingDataCsvStream = createCsvParseStream({
                    columns: true,
                });

                const testingDataStream: Stream = testingDataFileStream.pipe(
                    testingDataCsvStream,
                );

                const algorithmForCurrentGender = getAlgorithmForData(model, [
                    {
                        name: 'sex',
                        coefficent: gender,
                    },
                ]);

                testingDataStream.on(
                    'data',
                    (testingDataRow: { [index: string]: string }) => {
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
                    t.pass(
                        `Local transformations for ${gender} ${modelName} model correctly calculated`,
                    );
                    t.end();
                });
            });
        });
    }
}

test(`Testing local transformations`, async t => {
    const namesOfAlgorithmsToTest = getAlgorithmNamesToTest(['Sodium']);
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
            t => {
                testLocalTransformationsForModel(
                    model,
                    namesOfAlgorithmsToTest[index],
                    t,
                );
            },
        );
    });
});
