import * as test from 'tape';
import { getModelsToTest, getRelativeDifference } from './test-utils';
import { Model } from '../engine/model/model';
// tslint:disable-next-line:max-line-length
import { CoxSurvivalAlgorithm } from '../engine/algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm';
import { Data, findDatumWithName } from '../engine/data';
import { expect } from 'chai';
import * as fs from 'fs';
import { TestAlgorithmsFolderPath } from './constants';
// tslint:disable-next-line:no-var-requires
const createCsvParseStream = require('csv-parse');

function testRcsForAlgorithm(algorithm: CoxSurvivalAlgorithm, data: Data) {
    const notFirstVariableRcsCovariate = algorithm.covariates.filter(
        currentCovariate => {
            return currentCovariate.customFunction !== undefined;
        },
    );

    notFirstVariableRcsCovariate.forEach(currentNotFirstVaribleRcsCovariate => {
        const actualCoefficient = currentNotFirstVaribleRcsCovariate.calculateCoefficient(
            data,
            algorithm.userFunctions,
            algorithm.tables,
        ) as number;

        const expectedCoefficient = findDatumWithName(
            currentNotFirstVaribleRcsCovariate.name,
            data,
        ).coefficent as number;

        expect(
            getRelativeDifference(expectedCoefficient, actualCoefficient),
        ).to.be.lessThan(10);
    });
}

function streamValidationCsvFile(
    filePath: string,
    onData: (data: Data) => void,
    onEnd: () => void,
    onError: (err: Error) => void,
) {
    const readScoreTestingDataFileStream = fs.createReadStream(filePath);

    const readScoreTestingDataCsvStream = createCsvParseStream({
        columns: true,
    });

    const scoreTestingDataStream = readScoreTestingDataFileStream.pipe(
        readScoreTestingDataCsvStream,
    );

    scoreTestingDataStream.on('error', (error: Error) => {
        return onError(error);
    });

    scoreTestingDataStream.on('end', () => {
        return onEnd();
    });

    scoreTestingDataStream.on('data', (csvRow: { [index: string]: string }) => {
        return onData(
            Object.keys(csvRow).map(currentColumnName => {
                return {
                    name: currentColumnName,
                    coefficent: csvRow[currentColumnName],
                };
            }),
        );
    });
}

function testRcsForModel(t: test.Test, model: Model) {
    const validationCsvFilePaths: string[] = [];
    const modelPredicateDatas: Data[] = [];

    if (model.algorithms.length === 1) {
        validationCsvFilePaths.push(
            `${TestAlgorithmsFolderPath}/${model.name}/validation-data/score-data/score-data.csv`,
        );
        modelPredicateDatas.push([]);
    } else {
        validationCsvFilePaths.push(
            `${TestAlgorithmsFolderPath}/${model.name}/validation-data/score-data/male/score-data.csv`,
        );
        modelPredicateDatas.push([
            {
                name: 'sex',
                coefficent: 'male',
            },
        ]);

        validationCsvFilePaths.push(
            `${TestAlgorithmsFolderPath}/${model.name}/validation-data/score-data/female/score-data.csv`,
        );
        modelPredicateDatas.push([
            {
                name: 'sex',
                coefficent: 'female',
            },
        ]);
    }

    modelPredicateDatas.forEach((currentModelPredicateData, index) => {
        const algorithm = model.getAlgorithmForData(currentModelPredicateData);

        // tslint:disable-next-line:no-shadowed-variable
        t.test(`Testing RCS function for algorithm ${algorithm.name}`, t => {
            streamValidationCsvFile(
                validationCsvFilePaths[index],
                data => {
                    return testRcsForAlgorithm(algorithm, data);
                },
                () => {
                    t.pass(
                        `RCS function validated for algorithm ${algorithm.name}`,
                    );
                    t.end();
                },
                err => {
                    t.end(err);
                },
            );
        });
    });
}

test.only(`RCS Function`, async t => {
    const models = await getModelsToTest(['RESPECT', 'MPoRT']);

    models.forEach(model => {
        // tslint:disable-next-line:no-shadowed-variable
        t.test(`Testing RCS function for model ${model.name}`, t => {
            testRcsForModel(t, model.model);
        });
    });
});
