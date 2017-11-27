import { GenericMultipleAlgorithmModel } from './generic-multiple-algorithm-model';
import { IAlgorithmJson } from '../algorithm';
import { Data } from '../data';
export declare type MultipleAlgorithmModelJson = GenericMultipleAlgorithmModel<IAlgorithmJson>;
export declare function getAlgorithmJsonForData(multipleAlgorithmModel: MultipleAlgorithmModelJson, data: Data): IAlgorithmJson;
