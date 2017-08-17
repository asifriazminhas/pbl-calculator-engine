"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const build_from_assets_folder_1 = require("./build-from-assets-folder");
const build_from_algorithm_json_1 = require("./build-from-algorithm-json");
function cox() {
    return {
        buildFromAssetsFolder: build_from_assets_folder_1.buildFromAssetsFolder,
        buildFromAlgorithmJson: build_from_algorithm_json_1.buildFromAlgorithmJson
    };
}
exports.cox = cox;
//# sourceMappingURL=cox.js.map