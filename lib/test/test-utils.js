"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = require("fs");
const constants_1 = require("./constants");
const index_1 = require("../index");
function getAlgorithmNamesToTest(excludeAlgorithms) {
    return fs
        .readdirSync(constants_1.TestAlgorithmsFolderPath)
        .filter(algorithmName => excludeAlgorithms.indexOf(algorithmName) === -1)
        .filter(algorithmName => algorithmName !== '.DS_Store');
}
function getModelObjFromAlgorithmName(algorithmName) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return (yield index_1.SurvivalModelBuilder.buildFromAssetsFolder(`${constants_1.TestAlgorithmsFolderPath}/${algorithmName}`)).getModel();
    });
}
function getModelsToTest(modelsToExclude) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const modelNames = getAlgorithmNamesToTest(modelsToExclude);
        const models = yield Promise.all(modelNames.map(algorithmName => {
            return getModelObjFromAlgorithmName(algorithmName);
        }));
        return models.map((model, index) => {
            return {
                model,
                name: modelNames[index],
            };
        });
    });
}
exports.getModelsToTest = getModelsToTest;
//# sourceMappingURL=test-utils.js.map