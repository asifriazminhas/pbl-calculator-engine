import { curryBuildFromAlgorithmJsonFunction, BuildFromAlgorithmJson } from '../build-from-algorithm-json';

export interface BrowserSurvivalAlgorithmBuilder {
    buildSurvivalAlgorithm: () => BuildFromAlgorithmJson;
}

export function buildSurvivalAlgorithm(): BuildFromAlgorithmJson {
    return {
        buildFromAlgorithmJson: curryBuildFromAlgorithmJsonFunction()
    };
}