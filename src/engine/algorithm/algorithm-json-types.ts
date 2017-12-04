import {
    RegressionAlgorithmJsonTypes,
    isRegressionAlgorithmJson,
    parseRegressionAlgorithmJson,
} from '../regression-algorithm/regression-algorithm-json-types';
import { AlgorithmTypes } from './algorithm-types';
import { UnknownAlgorithmTypeError } from '../errors';

export type AlgorithmJsonTypes = RegressionAlgorithmJsonTypes;

export function parseAlgorithmJson(
    algorithmJson: AlgorithmJsonTypes,
): AlgorithmTypes {
    if (isRegressionAlgorithmJson(algorithmJson)) {
        return parseRegressionAlgorithmJson(algorithmJson);
    } else {
        throw new UnknownAlgorithmTypeError(
            (algorithmJson as AlgorithmJsonTypes).algorithmType,
        );
    }
}
