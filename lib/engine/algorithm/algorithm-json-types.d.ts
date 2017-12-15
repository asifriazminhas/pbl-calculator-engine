import { RegressionAlgorithmJsonTypes } from '../regression-algorithm/regression-algorithm-json-types';
import { AlgorithmTypes } from './algorithm-types';
import { ISimpleAlgorithmJson } from '../simple-algorithm';
export declare type AlgorithmJsonTypes = RegressionAlgorithmJsonTypes | ISimpleAlgorithmJson;
export declare function parseAlgorithmJson(algorithmJson: AlgorithmJsonTypes): AlgorithmTypes;
