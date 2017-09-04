"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const build_from_assets_folder_1 = require("./build-from-assets-folder");
const build_from_algorithm_json_1 = require("./build-from-algorithm-json");
function buildSurvivalAlgorithm() {
    return {
        buildFromAssetsFolder: build_from_assets_folder_1.curryBuildFromAssetsFolder(),
        buildFromAlgorithmJson: build_from_algorithm_json_1.curryBuildFromAlgorithmJsonFunction()
    };
}
exports.buildSurvivalAlgorithm = buildSurvivalAlgorithm;
//# sourceMappingURL=build-survival-algorithm.js.map