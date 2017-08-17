import { BuildFromAlgorithmJson } from '../build-from-algorithm-json';
export interface BrowserCoxBuilder {
    cox: () => BuildFromAlgorithmJson;
}
export declare function cox(): BuildFromAlgorithmJson;
