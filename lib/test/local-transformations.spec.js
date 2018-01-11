"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("source-map-support/register");
const test = require("tape");
const fs = require("fs");
const path = require("path");
const derived_field_1 = require("../engine/derived-field/derived-field");
const model_type_1 = require("../engine/model/model-type");
const multiple_algorithm_model_1 = require("../engine/multiple-algorithm-model");
// tslint:disable-next-line
const createCsvParseStream = require('csv-parse');
const chai_1 = require("chai");
const constants_1 = require("./constants");
const index_1 = require("../index");
const common_tags_1 = require("common-tags");
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
function getAlgorithmNamesToTest(excludeAlgorithms) {
    return (fs
        .readdirSync(constants_1.TestAlgorithmsFolderPath)
        .filter(algorithmFolderFileName => {
        return fs
            .lstatSync(path.join(TestAssetsFolderPath, algorithmFolderFileName))
            .isDirectory();
    })
        .filter(algorithmName => excludeAlgorithms.indexOf(algorithmName) === -1));
}
function getModelObjFromAlgorithmName(algorithmName) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return (yield index_1.SurvivalModelBuilder.buildFromAssetsFolder(`${constants_1.TestAlgorithmsFolderPath}/${algorithmName}`)).getModel();
    });
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
function isSameData(dataOne, dataTwo) {
    if (dataOne.length !== dataTwo.length) {
        return false;
    }
    return dataOne.find(dataOneDatum => {
        const equivalentDataTwoDatumForCurrentDateOneDatum = dataTwo.find(dataTwoDatum => dataTwoDatum.name === dataOneDatum.name);
        if (!equivalentDataTwoDatumForCurrentDateOneDatum) {
            return true;
        }
        return !(equivalentDataTwoDatumForCurrentDateOneDatum.coefficent ===
            dataOneDatum.coefficent);
    })
        ? false
        : true;
}
function testCovariateTransformations(covariate, inputData, expectedOutput, userFunctions, tables) {
    if (!covariate.derivedField) {
        return;
    }
    // tslint:disable-next-line
    isSameData;
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
        const genders = ['female', 'male'];
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
    const namesOfAlgorithmsToTest = getAlgorithmNamesToTest(['Sodium']);
    const models = yield Promise.all(namesOfAlgorithmsToTest.map(algorithmName => {
        return getModelObjFromAlgorithmName(algorithmName);
    }));
    models.forEach((model, index) => {
        t.test(`Testing local transformations for algorithm ${namesOfAlgorithmsToTest[index]}`, t => {
            testLocalTransformationsForModel(model, namesOfAlgorithmsToTest[index], t);
        });
    });
}));
//# sourceMappingURL=local-transformations.spec.js.map