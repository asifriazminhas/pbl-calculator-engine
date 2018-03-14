"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const test = require("tape");
const constants_1 = require("./constants");
const test_utils_1 = require("./test-utils");
// tslint:disable-next-line
const createCsvParseStream = require('csv-parse');
const fs = require("fs");
const model_type_1 = require("../engine/model/model-type");
const data_1 = require("../engine/data/data");
const chai_1 = require("chai");
const cox_1 = require("../engine/cox/cox");
const multiple_algorithm_model_1 = require("../engine/multiple-algorithm-model/multiple-algorithm-model");
const field_type_1 = require("../engine/field/field-type");
const common_tags_1 = require("common-tags");
const bins_1 = require("../engine/cox/bins/bins");
const regression_algorithm_1 = require("../engine/regression-algorithm/regression-algorithm");
const ScoreTestingDataFolderPath = `${constants_1.TestAssetsFolderPath}/score-data`;
function checkDataForAlgorithm(data, cox) {
    cox.covariates
        .filter(covariate => covariate.fieldType !== field_type_1.FieldType.InteractionCovariate)
        .forEach(covariate => {
        data_1.findDatumWithName(covariate.name, data);
    });
}
function getDataAndExpectedOutput(scoreTestingDataCsvRow) {
    return {
        data: Object.keys(scoreTestingDataCsvRow)
            .filter(scoreTestingDataCsvColummnName => scoreTestingDataCsvColummnName !== 'score' &&
            scoreTestingDataCsvColummnName !== 'survival')
            .map(covariateName => {
            return {
                name: covariateName,
                coefficent: Number(scoreTestingDataCsvRow[covariateName]),
            };
        }),
        expectedScore: Number(scoreTestingDataCsvRow['risk']),
        expectedBin: Number(scoreTestingDataCsvRow['Bin']),
    };
}
function testCalculatedScoreForDataAndExpectedScore(data, expectedScore, expectedBin, coxAlgorithm) {
    if (data_1.findDatumWithName('ran_id', data).coefficent === 17840) {
        return;
    }
    if (coxAlgorithm.binsData && coxAlgorithm.binsLookup) {
        const binData = bins_1.getBinDataForScore(coxAlgorithm, Math.round(regression_algorithm_1.calculateScore(coxAlgorithm, data) * 10000000) /
            10000000);
        const binNumber = Object.keys(coxAlgorithm.binsData)
            .map(Number)
            .find(currentBinNumber => {
            return (coxAlgorithm.binsData[currentBinNumber] === binData);
        });
        chai_1.expect(binNumber, `
            ran_id: ${data_1.findDatumWithName('ran_id', data).coefficent}
        `).to.equal(expectedBin);
    }
    else {
        const actualScore = cox_1.getSurvivalToTime(coxAlgorithm, data);
        const percentDiff = Math.abs(actualScore - expectedScore) / expectedScore * 100;
        const MaximumPercentDiff = 10;
        chai_1.expect(percentDiff).to.be.lessThan(10, `
            Percent difference greater than ${MaximumPercentDiff}
            Expected Score: ${expectedScore}
            Actual Score: ${actualScore}
            Data: ${JSON.stringify(data)}
        `);
    }
}
function testScoreForModel(t, model, modelName) {
    if (model.modelType === model_type_1.ModelType.MultipleAlgorithm) {
        const Genders = ['male', 'female'];
        Genders.map(gender => {
            t.test(`Testing ${gender} ${modelName} model`, t => {
                const algorithmForCurrentGender = multiple_algorithm_model_1.getAlgorithmForData(model, [
                    {
                        name: 'sex',
                        coefficent: gender,
                    },
                ]);
                const readScoreTestingDataFileStream = fs.createReadStream(`${ScoreTestingDataFolderPath}/${modelName}/${gender}/score-data.csv`);
                const readScoreTestingDataCsvStream = createCsvParseStream({
                    columns: true,
                });
                const scoreTestingDataStream = readScoreTestingDataFileStream.pipe(readScoreTestingDataCsvStream);
                scoreTestingDataStream.on('error', (error) => {
                    t.end(error);
                });
                scoreTestingDataStream.on('end', () => {
                    t.pass(`Score correctly calculatedfor ${gender} ${modelName} model`);
                    t.end();
                });
                scoreTestingDataStream.on('data', (scoreTestingDataRow) => {
                    const { data, expectedScore, expectedBin, } = getDataAndExpectedOutput(scoreTestingDataRow);
                    checkDataForAlgorithm(data, algorithmForCurrentGender);
                    testCalculatedScoreForDataAndExpectedScore(data, expectedScore, expectedBin, algorithmForCurrentGender);
                });
            });
        });
    }
    else {
        const algorithmForCurrentGender = model.algorithm;
        const readScoreTestingDataFileStream = fs.createReadStream(common_tags_1.oneLineTrim `
            ${constants_1.TestAlgorithmsFolderPath}/
            ${modelName}/
            ${constants_1.ValidationDataFolderName}/
            ${constants_1.ScoreDataFolderName}/
            ${constants_1.ScoreDataCsvFileName}
        `);
        const readScoreTestingDataCsvStream = createCsvParseStream({
            columns: true,
        });
        const scoreTestingDataStream = readScoreTestingDataFileStream.pipe(readScoreTestingDataCsvStream);
        scoreTestingDataStream.on('error', (error) => {
            t.end(error);
        });
        scoreTestingDataStream.on('end', () => {
            t.pass(`Score correctly calculatedfor ${modelName} model`);
            t.end();
        });
        scoreTestingDataStream.on('data', (scoreTestingDataRow) => {
            const { data, expectedScore, expectedBin, } = getDataAndExpectedOutput(scoreTestingDataRow);
            checkDataForAlgorithm(data, algorithmForCurrentGender);
            testCalculatedScoreForDataAndExpectedScore(data, expectedScore, expectedBin, algorithmForCurrentGender);
        });
    }
}
test.only(`Testing Scoring`, (t) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    const modelsToTest = yield test_utils_1.getModelsToTest(['Sodium', 'SPoRT', 'MPoRT']);
    modelsToTest.forEach(({ model, name }) => {
        t.test(`Testing ${name} model`, t => {
            testScoreForModel(t, model, name);
        });
    });
}));
//# sourceMappingURL=score.spec.js.map