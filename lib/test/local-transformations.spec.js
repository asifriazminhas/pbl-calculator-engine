"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("source-map-support/register");
const test = require("tape");
const fs = require("fs");
const path = require("path");
const survival_model_builder_1 = require("../engine/survival-model-builder/survival-model-builder");
const derived_field_1 = require("../engine/derived-field/derived-field");
const model_type_1 = require("../engine/model/model-type");
const multiple_algorithm_model_1 = require("../engine/multiple-algorithm-model");
const csvParse = require('csv-parse/lib/sync');
const chai_1 = require("chai");
const TestAssetsFolderPath = path.join(__dirname, '../../assets/test');
const TestAlgorithmsFolderPath = `${TestAssetsFolderPath}/algorithms`;
const TransformationsTestingDataFolderPath = `${TestAssetsFolderPath}/local-transformations`;
function getAlgorithmNamesToTest() {
    return fs
        .readdirSync(TestAlgorithmsFolderPath)
        .filter(algorithmName => algorithmName !== '.DS_Store');
}
function getModelObjFromAlgorithmName(algorithmName) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return (yield survival_model_builder_1.SurvivalModelBuilder.buildFromAssetsFolder(`${TestAlgorithmsFolderPath}/${algorithmName}`)).getModel();
    });
}
function formatTestingDataCsvColumn(column) {
    if (column === 'NA') {
        return null;
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
function getTestingDataForCovariate(covariate, testingDataCsv) {
    if (covariate.derivedField) {
        const leafFields = derived_field_1.getLeafFieldsForDerivedField(covariate.derivedField);
        const leadFieldNames = leafFields.map(leafField => leafField.name);
        const inputData = testingDataCsv.map(testingDataCsvRow => {
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
            return getDataFromTestingDataCsvRow(obj);
        });
        const expectedOutputs = testingDataCsv.map(testingDataCsvRow => {
            return formatTestingDataCsvColumn(testingDataCsvRow[covariate.name]);
        });
        return {
            inputData,
            expectedOutputs,
        };
    }
    else {
        return {
            inputData: [],
            expectedOutputs: [],
        };
    }
}
function testCovariateTransformations(covariate, inputData, expectedOutputs, userFunctions) {
    if (!covariate.derivedField) {
        return;
    }
    const derivedField = covariate.derivedField;
    inputData.forEach((currentInputData, index) => {
        const actualOutput = derived_field_1.calculateCoefficent(derivedField, currentInputData, userFunctions);
        let expectedOutput = expectedOutputs[index];
        let diffError;
        if (expectedOutput === null && actualOutput === null) {
            diffError = 0;
        }
        else {
            diffError =
                (expectedOutput - actualOutput) /
                    expectedOutput;
            if (expectedOutput == 0 && actualOutput == 0) {
                diffError = 0;
            }
        }
        chai_1.expect(diffError < 0.00001 || diffError === 0, `DerivedField ${derivedField
            .name}. Input Row: ${index}. Actual Output: ${actualOutput}. ExpectedOutput: ${expectedOutput}. DiffError: ${diffError}`).to.be.true;
    });
}
function testLocalTransformationsForModel(model, modelName, t) {
    if (model.modelType === model_type_1.ModelType.SingleAlgorithm) {
        const testingCsvData = csvParse(fs.readFileSync(`${TransformationsTestingDataFolderPath}/${modelName}/testing-data.csv`, 'utf8'), {
            columns: true,
        });
        model.algorithm.covariates.forEach(covariate => {
            const { inputData, expectedOutputs } = getTestingDataForCovariate(covariate, testingCsvData);
            testCovariateTransformations(covariate, inputData, expectedOutputs, model.algorithm.userFunctions);
            t.pass(`Testing transformations for covariate ${covariate.name}`);
        });
    }
    else if (model.modelType === model_type_1.ModelType.MultipleAlgorithm) {
        const genders = ['male', 'female'];
        genders.forEach(gender => {
            const testingCsvData = csvParse(fs.readFileSync(`${TransformationsTestingDataFolderPath}/${modelName}/${gender}/testing-data.csv`, 'utf8'), {
                columns: true,
            });
            const algorithmForCurrentGender = multiple_algorithm_model_1.getAlgorithmForData(model, [
                {
                    name: 'sex',
                    coefficent: gender,
                },
            ]);
            algorithmForCurrentGender.covariates.forEach(covariate => {
                const { inputData, expectedOutputs, } = getTestingDataForCovariate(covariate, testingCsvData);
                testCovariateTransformations(covariate, inputData, expectedOutputs, algorithmForCurrentGender.userFunctions);
                t.pass(`Testing transformations for covariate ${covariate.name}`);
            });
        });
    }
    t.end();
}
test(`Testing local transformations`, function (t) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const namesOfAlgorithmsToTest = getAlgorithmNamesToTest();
        const models = yield Promise.all(namesOfAlgorithmsToTest.map(algorithmName => {
            return getModelObjFromAlgorithmName(algorithmName);
        }));
        models.forEach((model, index) => {
            t.test(`Testing local transformations for algorithm ${namesOfAlgorithmsToTest[index]}`, function (t) {
                testLocalTransformationsForModel(model, namesOfAlgorithmsToTest[index], t);
            });
        });
    });
});
//# sourceMappingURL=local-transformations.spec.js.map