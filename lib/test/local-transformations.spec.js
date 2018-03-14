"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("source-map-support/register");
const test = require("tape");
const fs = require("fs");
const path = require("path");
const data_1 = require("../engine/data/data");
const derived_field_1 = require("../engine/derived-field/derived-field");
const model_type_1 = require("../engine/model/model-type");
const multiple_algorithm_model_1 = require("../engine/multiple-algorithm-model");
// tslint:disable-next-line
const createCsvParseStream = require('csv-parse');
const chai_1 = require("chai");
const common_tags_1 = require("common-tags");
const test_utils_1 = require("./test-utils");
const TestAssetsFolderPath = path.join(__dirname, '../../node_modules/@ottawamhealth/pbl-calculator-engine-assets');
const TransformationsTestingDataFolderPath = `/validation-data/local-transformations`;
function getLocalTransformationsDataPathForModelAndGender(model, modelName, gender) {
    if (model.modelType === model_type_1.ModelType.SingleAlgorithm) {
        return `${TestAssetsFolderPath}/${modelName}${TransformationsTestingDataFolderPath}/local-transformations.csv`;
    }
    else {
        return common_tags_1.oneLine `
        ${TestAssetsFolderPath}/${modelName}${TransformationsTestingDataFolderPath}/${gender}/local-transformations.csv
        `;
    }
}
function formatTestingDataCsvColumn(column) {
    if (column === 'NA') {
        return undefined;
    }
    else if (isNaN(column)) {
        return column;
    }
    else {
        return Number(column);
    }
}
function getDataFromTestingDataCsvRow(testingDataCsvRow) {
    return Object.keys(testingDataCsvRow).map(testingDataCsvColumnName => {
        return {
            name: testingDataCsvColumnName,
            coefficent: formatTestingDataCsvColumn(testingDataCsvRow[testingDataCsvColumnName]),
        };
    });
}
function getTestingDataForCovariate(covariate, testingDataCsvRow) {
    if (covariate.derivedField) {
        const leafFields = derived_field_1.getLeafFieldsForDerivedField(covariate.derivedField);
        const leadFieldNames = leafFields.map(leafField => leafField.name);
        const testingDataCsvRowColumns = Object.keys(testingDataCsvRow);
        const obj = {};
        testingDataCsvRowColumns
            .filter(testingDataCsvRowColumn => {
            return leadFieldNames.indexOf(testingDataCsvRowColumn) > -1;
        })
            .forEach(testingDataCsvRowColumn => {
            obj[testingDataCsvRowColumn] =
                testingDataCsvRow[testingDataCsvRowColumn];
        });
        const inputData = getDataFromTestingDataCsvRow(obj);
        const expectedOutput = formatTestingDataCsvColumn(testingDataCsvRow[covariate.name]);
        return {
            inputData,
            expectedOutput,
        };
    }
    else {
        return {
            inputData: [],
            expectedOutput: null,
        };
    }
}
function testCovariateTransformations(covariate, inputData, expectedOutput, userFunctions, tables) {
    if (!covariate.derivedField) {
        return;
    }
    // tslint:disable-next-line
    data_1.isEqual;
    // tslint:disable-next-line
    /*(const DataToDebug = [
        { name: 'age', coefficent: 20 },
        { name: 'lpa_lpa0', coefficent: 'Yes' },
        { name: 'lpa_lpa1', coefficent: 'Yes' },
        { name: 'lpam_lpa1', coefficent: 'lpa60' },
        { name: 'lpat_lpa1', coefficent: 5 },
        { name: 'lpa_lpa2', coefficent: 'Yes' },
        { name: 'lpam_lpa2', coefficent: 'lpa61' },
        { name: 'lpat_lpa2', coefficent: 70 },
        { name: 'lpa_lpa3', coefficent: 'Yes' },
        { name: 'lpam_lpa3', coefficent: 'lpa60' },
        { name: 'lpat_lpa3', coefficent: 20 },
        { name: 'lpa_lpa4', coefficent: 'Yes' },
        { name: 'lpam_lpa4', coefficent: 'lpa30' },
        { name: 'lpat_lpa4', coefficent: 70 },
        { name: 'lpa_lpa5', coefficent: 'Yes' },
        { name: 'lpam_lpa5', coefficent: 'lpa61' },
        { name: 'lpat_lpa5', coefficent: 2 },
        { name: 'lpa_lpa6', coefficent: 'Yes' },
        { name: 'lpam_lpa6', coefficent: 'lpa30' },
        { name: 'lpat_lpa6', coefficent: 20 },
        { name: 'lpa_lpa7', coefficent: 'Yes' },
        { name: 'lpam_lpa7', coefficent: 'lpa61' },
        { name: 'lpat_lpa7', coefficent: 70 },
        { name: 'lpa_lpa8', coefficent: 'Yes' },
        { name: 'lpam_lpa8', coefficent: 'lpa60' },
        { name: 'lpat_lpa8', coefficent: 5 },
        { name: 'lpa_lpa9', coefficent: 'Yes' },
        { name: 'lpam_lpa9', coefficent: 'lpa30' },
        { name: 'lpat_lpa9', coefficent: 5 },
        { name: 'lpa_lpa10', coefficent: 'Yes' },
        { name: 'lpam_lpa10', coefficent: 'lpa30' },
        { name: 'lpat_lpa10', coefficent: 15 },
        { name: 'lpa_lpa11', coefficent: 'Yes' },
        { name: 'lpam_lpa11', coefficent: 'lpa61' },
        { name: 'lpat_lpa11', coefficent: 5 },
        { name: 'lpa_lpa12', coefficent: 'Yes' },
        { name: 'lpam_lpa12', coefficent: 'lpa61' },
        { name: 'lpat_lpa12', coefficent: 4 },
        { name: 'lpa_lpa13', coefficent: 'Yes' },
        { name: 'lpam_lpa13', coefficent: 'lpa61' },
        { name: 'lpat_lpa13', coefficent: 4 },
        { name: 'lpa_lpa14', coefficent: 'Yes' },
        { name: 'lpam_lpa14', coefficent: 'lpa61' },
        { name: 'lpat_lpa14', coefficent: 1 },
        { name: 'lpa_lpa15', coefficent: 'Yes' },
        { name: 'lpam_lpa15', coefficent: 'lpa61' },
        { name: 'lpat_lpa15', coefficent: 1 },
        { name: 'lpa_lpa16', coefficent: 'Yes' },
        { name: 'lpam_lpa16', coefficent: 'lpa60' },
        { name: 'lpat_lpa16', coefficent: 10 },
        { name: 'lpa_lpa17', coefficent: 'Yes' },
        { name: 'lpam_lpa17', coefficent: 'lpa60' },
        { name: 'lpat_lpa17', coefficent: 2 },
        { name: 'lpa_lpa18', coefficent: 'Yes' },
        { name: 'lpam_lpa18', coefficent: 'lpa30' },
        { name: 'lpat_lpa18', coefficent: 2 },
        { name: 'lpa_lpa19', coefficent: 'Yes' },
        { name: 'lpam_lpa19', coefficent: 'lpa60' },
        { name: 'lpat_lpa19', coefficent: 6 },
        { name: 'lpa_lpa20', coefficent: 'Yes' },
        { name: 'lpam_lpa20', coefficent: 'lpa30' },
        { name: 'lpat_lpa20', coefficent: 3 },
        { name: 'lpa_lpa21', coefficent: 'No' },
        { name: 'lpam_lpa21' },
        { name: 'lpat_lpa21' },
        { name: 'lpa_lpa22', coefficent: 'Yes' },
        { name: 'lpam_lpa22', coefficent: 'lpa30' },
        { name: 'lpat_lpa22', coefficent: 2 },
    ];
    const CovariateToDebug = 'AgeCXPhysicalActivityC_int';
    if (
        !isDataOneEqualToDataTwo(DataToDebug, inputData) ||
        covariate.name !== CovariateToDebug
    ) {
        return;
    }*/
    const derivedField = covariate.derivedField;
    const actualOutput = derived_field_1.calculateCoefficent(derivedField, inputData, userFunctions, tables);
    if (isNaN(actualOutput) && expectedOutput === undefined) {
        return;
    }
    if (actualOutput === 0 && expectedOutput === 0) {
        return;
    }
    const diffError = (expectedOutput - actualOutput) /
        expectedOutput;
    // tslint:disable-next-line
    chai_1.expect(diffError < 0.00001 || diffError === 0, `Derived Field: ${derivedField.name}
        Input Data: ${JSON.stringify(inputData)}
        Actual Output: ${actualOutput}
        ExpectedOutput: ${expectedOutput}
        DiffError: ${diffError}`).to.be.true;
}
function testLocalTransformationsForModel(model, modelName, t) {
    if (model.modelType === model_type_1.ModelType.SingleAlgorithm) {
        const testingDataFileStream = fs.createReadStream(getLocalTransformationsDataPathForModelAndGender(model, modelName, undefined));
        const csvParseStream = createCsvParseStream({
            columns: true,
        });
        const testingDataStream = testingDataFileStream.pipe(csvParseStream);
        testingDataStream.on('data', (testingDataRow) => {
            model.algorithm.covariates.forEach(covariate => {
                const { inputData, expectedOutput, } = getTestingDataForCovariate(covariate, testingDataRow);
                testCovariateTransformations(covariate, inputData, expectedOutput, model.algorithm.userFunctions, model.algorithm.tables);
                t.pass(`Testing transformations for covariate ${covariate.name}`);
            });
        });
        testingDataStream.on('error', (error) => {
            t.end(error);
        });
        testingDataStream.on('end', () => {
            t.pass(`Local transformations for ${modelName} model correctly calculated`);
            t.end();
        });
    }
    else if (model.modelType === model_type_1.ModelType.MultipleAlgorithm) {
        const genders = ['male', 'female'];
        genders.forEach(gender => {
            t.test(`Testing ${gender} algorithm`, t => {
                const localTransformationsDataFilePath = getLocalTransformationsDataPathForModelAndGender(model, modelName, gender);
                if (!fs.existsSync(localTransformationsDataFilePath)) {
                    t.comment(`No testing data found for ${gender} ${modelName} model. Skipping test`);
                    return t.end();
                }
                const testingDataFileStream = fs.createReadStream(localTransformationsDataFilePath);
                const testingDataCsvStream = createCsvParseStream({
                    columns: true,
                });
                const testingDataStream = testingDataFileStream.pipe(testingDataCsvStream);
                const algorithmForCurrentGender = multiple_algorithm_model_1.getAlgorithmForData(model, [
                    {
                        name: 'sex',
                        coefficent: gender,
                    },
                ]);
                testingDataStream.on('data', (testingDataRow) => {
                    algorithmForCurrentGender.covariates.forEach(covariate => {
                        const { inputData, expectedOutput, } = getTestingDataForCovariate(covariate, testingDataRow);
                        testCovariateTransformations(covariate, inputData, expectedOutput, algorithmForCurrentGender.userFunctions, algorithmForCurrentGender.tables);
                    });
                });
                testingDataStream.on('error', (error) => {
                    t.end(error);
                });
                testingDataStream.on('end', () => {
                    t.pass(`Local transformations for ${gender} ${modelName} model correctly calculated`);
                    t.end();
                });
            });
        });
    }
}
test(`Testing local transformations`, (t) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    const modelsAndNames = yield test_utils_1.getModelsToTest([
        'Sodium',
        'SPoRT',
        'RESPECT',
    ]);
    modelsAndNames.forEach(({ model, name }) => {
        t.test(`Testing local transformations for algorithm ${name}`, t => {
            testLocalTransformationsForModel(model, name, t);
        });
    });
}));
//# sourceMappingURL=local-transformations.spec.js.map