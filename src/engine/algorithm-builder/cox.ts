import { buildFromAssetsFolder, BuildFromAssetsFolder } from './build-from-assets-folder';
import { buildFromAlgorithmJson, BuildFromAlgorithmJson } from './build-from-algorithm-json';

export interface CoxBuilder {
    cox: () => BuildFromAssetsFolder & BuildFromAlgorithmJson;
}

export function cox(): BuildFromAssetsFolder & BuildFromAlgorithmJson {
    return {
        buildFromAssetsFolder,
        buildFromAlgorithmJson
    };
}
