import { BuildFromAssetsFolder } from './build-from-assets-folder';
import { BuildFromAlgorithmJson } from './build-from-algorithm-json';
export interface SurvivalAlgorithmBuilder {
    buildSurvivalAlgorithm: () => BuildFromAssetsFolder & BuildFromAlgorithmJson;
}
export declare function buildSurvivalAlgorithm(): BuildFromAssetsFolder & BuildFromAlgorithmJson;
