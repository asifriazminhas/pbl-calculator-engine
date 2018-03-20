import * as test from 'tape';
import {
    ScoreDataFolderName,
    TestAssetsFolderPath,
    TestAlgorithmsFolderPath,
    ValidationDataFolderName,
    ScoreDataCsvFileName,
} from './constants';
import { getModelsToTest } from './test-utils';
import { ModelTypes } from '../engine/model/model-types';
// tslint:disable-next-line
const createCsvParseStream = require('csv-parse');
import * as fs from 'fs';
import { ModelType } from '../engine/model/model-type';
import { Data, findDatumWithName } from '../engine/data/data';
import { expect } from 'chai';
import { Cox, getSurvivalToTime, ICoxWithBins } from '../engine/cox/cox';
import { getAlgorithmForData } from '../engine/multiple-algorithm-model/multiple-algorithm-model';
import { FieldType } from '../engine/field/field-type';
import { oneLineTrim } from 'common-tags';
import { getBinDataForScore } from '../engine/cox/bins/bins';
import { calculateScore } from '../engine/regression-algorithm/regression-algorithm';

const ScoreTestingDataFolderPath = `${TestAssetsFolderPath}/score-data`;

function checkDataForAlgorithm(data: Data, cox: Cox) {
    cox.covariates
        .filter(
            covariate => covariate.fieldType !== FieldType.InteractionCovariate,
        )
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
    coxAlgorithm: Cox,
) {
    // Debugging code
    /*if (findDatumWithName('ran_id', data).coefficent === 17840) {
        return;
    }*/

    if (coxAlgorithm.binsData && coxAlgorithm.binsLookup) {
        const binData = getBinDataForScore(
            coxAlgorithm as ICoxWithBins,
            Math.round(calculateScore(coxAlgorithm, data) * 10000000) /
                10000000,
        );
        const binNumber = Object.keys((coxAlgorithm as ICoxWithBins).binsData)
            .map(Number)
            .find(currentBinNumber => {
                return (
                    (coxAlgorithm as ICoxWithBins).binsData[
                        currentBinNumber
                    ] === binData
                );
            });

        expect(
            binNumber,
            `
            ran_id: ${findDatumWithName('ran_id', data).coefficent}
        `,
        ).to.equal(expectedBin);
    } else {
        const actualScore = getSurvivalToTime(coxAlgorithm, data);

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

function testScoreForModel(t: test.Test, model: ModelTypes, modelName: string) {
    if (model.modelType === ModelType.MultipleAlgorithm) {
        const Genders = ['male', 'female'];

        Genders.map(gender => {
            t.test(`Testing ${gender} ${modelName} model`, t => {
                const algorithmForCurrentGender = getAlgorithmForData(model, [
                    {
                        name: 'sex',
                        coefficent: gender,
                    },
                ]) as Cox;

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
        const algorithmForCurrentGender = model.algorithm as Cox;

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

test(`Testing Scoring`, async t => {
    const modelsToTest = await getModelsToTest(['Sodium', 'SPoRT']);

    modelsToTest.forEach(({ model, name }) => {
        t.test(`Testing ${name} model`, t => {
            testScoreForModel(t, model, name);
        });
    });
});
