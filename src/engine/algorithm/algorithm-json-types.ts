import {
    RegressionAlgorithmJsonTypes,
    isRegressionAlgorithmJson,
    parseRegressionAlgorithmJson,
} from '../regression-algorithm/regression-algorithm-json-types';
import { AlgorithmTypes } from './algorithm-types';
import {
    parseSimpleAlgorithmJsonToSimpleAlgorithm,
    ISimpleAlgorithmJson,
} from '../simple-algorithm';

export type AlgorithmJsonTypes =
    | RegressionAlgorithmJsonTypes
    | ISimpleAlgorithmJson;

export function parseAlgorithmJson(
    algorithmJson: AlgorithmJsonTypes,
): AlgorithmTypes {
    if (isRegressionAlgorithmJson(algorithmJson)) {
        return parseRegressionAlgorithmJson(algorithmJson);
    } else {
        return parseSimpleAlgorithmJsonToSimpleAlgorithm(algorithmJson);
    }
}
