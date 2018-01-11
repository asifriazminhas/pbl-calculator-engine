import { SingleAlgorithmModelJson } from '../single-algorithm-model';
import { MultipleAlgorithmModelJson } from '../multiple-algorithm-model';
import { Data } from '../data';
import { ModelTypes } from './model-types';
import { IAlgorithmJson } from '../algorithm';
import { AlgorithmJsonTypes } from '../algorithm/algorithm-json-types';
export declare type JsonModelTypes<U extends AlgorithmJsonTypes = AlgorithmJsonTypes> = SingleAlgorithmModelJson<U> | MultipleAlgorithmModelJson<U>;
export declare function getAlgorithmJsonForModelAndData(model: JsonModelTypes, data: Data): IAlgorithmJson<any>;
export declare function parseModelJsonToModel(modelTypeJson: JsonModelTypes): ModelTypes;
