import { IBaseCox } from './base-cox';
import { IRegressionAlgorithmJson } from '../regression-algorithm/regression-algorithm-json';
import { AlgorithmType } from '../algorithm/algorithm-type';
export interface ICoxJson extends IBaseCox, IRegressionAlgorithmJson<AlgorithmType.Cox> {
}
