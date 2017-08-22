import { BuildFromAlgorithmJson } from '../build-from-algorithm-json';
export interface BrowserSurvivalAlgorithmBuilder {
    buildSurvivalAlgorithm: () => BuildFromAlgorithmJson;
}
export declare function buildSurvivalAlgorithm(): BuildFromAlgorithmJson;
