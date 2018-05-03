import * as test from 'tape';
import {
    ScoreDataFolderName,
    TestAssetsFolderPath,
    TestAlgorithmsFolderPath,
    ValidationDataFolderName,
    ScoreDataCsvFileName,
} from './constants';
import { getModelsToTest } from './test-utils';
// tslint:disable-next-line
const createCsvParseStream = require('csv-parse');
import * as fs from 'fs';
import { Data, findDatumWithName } from '../engine/data/data';
import { expect } from 'chai';
import { oneLineTrim } from 'common-tags';
import { InteractionCovariate } from '../engine/data-field/covariate/interaction-covariate/interaction-covariate';
// tslint:disable-next-line:max-line-length
import { CoxSurvivalAlgorithm } from '../engine/algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm';
import { Model } from '../engine/model/model';

const ScoreTestingDataFolderPath = `${TestAssetsFolderPath}/score-data`;

function checkDataForAlgorithm(data: Data, cox: CoxSurvivalAlgorithm) {
    cox.covariates
        .filter(covariate => !(covariate instanceof InteractionCovariate))
        .forEach(covariate => {
            findDatumWithName(covariate.name, data);
        });
}

function getDataAndExpectedOutput(scoreTestingDataCsvRow: {
    [index: string]: string;
}): { data: Data; expectedScore: number; expectedBin: number } {
    return {
        data: Object.keys(scoreTestingDataCsvRow)
            .filter(
                scoreTestingDataCsvColummnName =>
                    scoreTestingDataCsvColummnName !== 'score' &&
                    scoreTestingDataCsvColummnName !== 'survival',
            )
            .map(covariateName => {
                return {
                    name: covariateName,
                    coefficent: Number(scoreTestingDataCsvRow[covariateName]),
                };
            }),
        expectedScore: Number(scoreTestingDataCsvRow['s']),
        expectedBin: Number(scoreTestingDataCsvRow['Bin']),
    };
}

function testCalculatedScoreForDataAndExpectedScore(
    data: Data,
    expectedScore: number,
    expectedBin: number,
    coxAlgorithm: CoxSurvivalAlgorithm,
) {
    // Debugging code
    /*if (findDatumWithName('ran_id', data).coefficent === 17840) {
        return;
    }*/

    if (coxAlgorithm.bins) {
        const binData = coxAlgorithm.bins.getBinDataForScore(
            Math.round(coxAlgorithm.calculateScore(data) * 10000000) / 10000000,
        );
        const binNumber = Object.keys(coxAlgorithm.bins.binsData)
            .map(Number)
            .find(currentBinNumber => {
                return (
                    coxAlgorithm.bins!.binsData[currentBinNumber] === binData
                );
            });

        expect(
            binNumber,
            `
            ran_id: ${findDatumWithName('ran_id', data).coefficent}
        `,
        ).to.equal(expectedBin);
    } else {
        const actualScore = coxAlgorithm.getSurvivalToTime(data);

        const percentDiff =
            Math.abs(actualScore - expectedScore) / expectedScore * 100;
        const MaximumPercentDiff = 10;

        expect(percentDiff).to.be.lessThan(
            10,
            `
            Percent difference greater than ${MaximumPercentDiff}
            Expected Score: ${expectedScore}
            Actual Score: ${actualScore}
            Data: ${JSON.stringify(data)}
        `,
        );
    }
}

function testScoreForModel(t: test.Test, model: Model, modelName: string) {
    if (model.algorithms.length > 1) {
        const Genders = ['male', 'female'];

        Genders.map(gender => {
            t.test(`Testing ${gender} ${modelName} model`, t => {
                const algorithmForCurrentGender = model.getAlgorithmForData([
                    {
                        name: 'sex',
                        coefficent: gender,
                    },
                ]);

                const readScoreTestingDataFileStream = fs.createReadStream(
                    `${ScoreTestingDataFolderPath}/${modelName}/${gender}/score-data.csv`,
                );

                const readScoreTestingDataCsvStream = createCsvParseStream({
                    columns: true,
                });

                const scoreTestingDataStream = readScoreTestingDataFileStream.pipe(
                    readScoreTestingDataCsvStream,
                );

                scoreTestingDataStream.on('error', (error: Error) => {
                    t.end(error);
                });

                scoreTestingDataStream.on('end', () => {
                    t.pass(
                        `Score correctly calculatedfor ${gender} ${modelName} model`,
                    );
                    t.end();
                });

                scoreTestingDataStream.on(
                    'data',
                    (scoreTestingDataRow: { [index: string]: string }) => {
                        const {
                            data,
                            expectedScore,
                            expectedBin,
                        } = getDataAndExpectedOutput(scoreTestingDataRow);
                        checkDataForAlgorithm(data, algorithmForCurrentGender);

                        testCalculatedScoreForDataAndExpectedScore(
                            data,
                            expectedScore,
                            expectedBin,
                            algorithmForCurrentGender,
                        );
                    },
                );
            });
        });
    } else {
        const algorithmForCurrentGender = model.algorithms[0].algorithm;

        const readScoreTestingDataFileStream = fs.createReadStream(oneLineTrim`
            ${TestAlgorithmsFolderPath}/
            ${modelName}/
            ${ValidationDataFolderName}/
            ${ScoreDataFolderName}/
            ${ScoreDataCsvFileName}
        `);

        const readScoreTestingDataCsvStream = createCsvParseStream({
            columns: true,
        });

        const scoreTestingDataStream = readScoreTestingDataFileStream.pipe(
            readScoreTestingDataCsvStream,
        );

        scoreTestingDataStream.on('error', (error: Error) => {
            t.end(error);
        });

        scoreTestingDataStream.on('end', () => {
            t.pass(`Score correctly calculatedfor ${modelName} model`);
            t.end();
        });

        scoreTestingDataStream.on(
            'data',
            (scoreTestingDataRow: { [index: string]: string }) => {
                const {
                    data,
                    expectedScore,
                    expectedBin,
                } = getDataAndExpectedOutput(scoreTestingDataRow);
                checkDataForAlgorithm(data, algorithmForCurrentGender);

                testCalculatedScoreForDataAndExpectedScore(
                    data,
                    expectedScore,
                    expectedBin,
                    algorithmForCurrentGender,
                );
            },
        );
    }
}

test.skip(`Testing Scoring`, async t => {
    const modelsToTest = await getModelsToTest(['Sodium', 'SPoRT']);

    modelsToTest.forEach(({ model, name }) => {
        t.test(`Testing ${name} model`, t => {
            testScoreForModel(t, model, name);
        });
    });
});
