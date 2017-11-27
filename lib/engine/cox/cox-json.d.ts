import { IAlgorithmJson } from '../algorithm';
import { AlgorithmType } from '../algorithm/algorithm-type';
export interface ICoxJson extends IAlgorithmJson {
    algorithmType: AlgorithmType.Cox;
}
