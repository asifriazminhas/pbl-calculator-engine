import { Cox } from '../cox/cox';
import { ILogisticRegression } from '../logistic-regression/logistic-regression';
import { Algorithm } from '../algorithm/algorithm';
export declare type RegressionAlgorithmTypes = Cox | ILogisticRegression;
export declare function isRegressionAlgorithm(algorithm: Algorithm<any>): algorithm is RegressionAlgorithmTypes;
