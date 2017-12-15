import { ICoxJson } from '../cox';
import { ILogisticRegressionJson } from '../logistic-regression';
import { RegressionAlgorithmTypes } from './regression-algorithm-types';
import { IAlgorithmJson } from '../algorithm/algorithm-json';
import { IRegressionAlgorithmJson } from './regression-algorithm-json';
import { AlgorithmType } from '../algorithm/algorithm-type';
export declare type RegressionAlgorithmJsonTypes = ICoxJson | ILogisticRegressionJson;
export declare function parseRegressionAlgorithmJson(regressionAlgorithmJson: RegressionAlgorithmJsonTypes): RegressionAlgorithmTypes;
export declare function isRegressionAlgorithmJson(algorithm: IAlgorithmJson<any>): algorithm is IRegressionAlgorithmJson<AlgorithmType.Cox | AlgorithmType.LogisticRegression>;
