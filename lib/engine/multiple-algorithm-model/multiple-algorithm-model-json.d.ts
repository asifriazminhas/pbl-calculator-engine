import { GenericMultipleAlgorithmModel } from './generic-multiple-algorithm-model';
import { IAlgorithmJson } from '../algorithm';
import { Data } from '../data';
import { AlgorithmJsonTypes } from '../algorithm/algorithm-json-types';
export declare type MultipleAlgorithmModelJson<U extends AlgorithmJsonTypes = AlgorithmJsonTypes> = GenericMultipleAlgorithmModel<U>;
export declare function getAlgorithmJsonForData(multipleAlgorithmModel: MultipleAlgorithmModelJson, data: Data): IAlgorithmJson<any>;
