import { curryBuildFromAssetsFolder, BuildFromAssetsFolder } from './build-from-assets-folder';
import { curryBuildFromAlgorithmJsonFunction, BuildFromAlgorithmJson } from './build-from-algorithm-json';

export interface SurvivalAlgorithmBuilder {
    buildSurvivalAlgorithm: () => BuildFromAssetsFolder & BuildFromAlgorithmJson;
}

export function buildSurvivalAlgorithm(): BuildFromAssetsFolder & BuildFromAlgorithmJson {
    return {
        buildFromAssetsFolder: curryBuildFromAssetsFolder(),
        buildFromAlgorithmJson: curryBuildFromAlgorithmJsonFunction()
    };
}
