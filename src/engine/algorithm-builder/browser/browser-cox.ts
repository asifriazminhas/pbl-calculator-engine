import { buildFromAlgorithmJson, BuildFromAlgorithmJson } from '../build-from-algorithm-json';

export interface BrowserCoxBuilder {
    cox: () => BuildFromAlgorithmJson;
}

export function cox(): BuildFromAlgorithmJson {
    return {
        buildFromAlgorithmJson
    };
}