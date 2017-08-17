import { BuildFromAssetsFolder } from './build-from-assets-folder';
import { BuildFromAlgorithmJson } from './build-from-algorithm-json';
export interface CoxBuilder {
    cox: () => BuildFromAssetsFolder & BuildFromAlgorithmJson;
}
export declare function cox(): BuildFromAssetsFolder & BuildFromAlgorithmJson;
