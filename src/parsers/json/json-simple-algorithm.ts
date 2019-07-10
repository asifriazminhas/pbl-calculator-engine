import { JsonSerializable } from '../../util/types';
import { SimpleAlgorithm } from '../../engine/algorithm/simple-algorithm/simple-algorithm';
import { Omit } from 'utility-types';
import { IAlgorithmJson } from './json-algorithm';
import { AlgorithmType } from './algorithm-type';

export interface IJsonSimpleAlgorithm
    extends Omit<JsonSerializable<SimpleAlgorithm>, 'output' | 'userFunctions'>,
        IAlgorithmJson {
    algorithmType: AlgorithmType.SimpleAlgorithm;
    output: string;
}
