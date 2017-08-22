import { buildFromAssetsFolder, BuildFromAssetsFolder } from './build-from-assets-folder';
import { buildFromAlgorithmJson, BuildFromAlgorithmJson } from './build-from-algorithm-json';

export interface SurvivalAlgorithmBuilder {
    buildSurvivalAlgorithm: () => BuildFromAssetsFolder & BuildFromAlgorithmJson;
}

export function buildSurvivalAlgorithm(): BuildFromAssetsFolder & BuildFromAlgorithmJson {
    return {
        buildFromAssetsFolder,
        buildFromAlgorithmJson
    };
}
