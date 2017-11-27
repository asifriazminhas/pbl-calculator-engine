import { SingleAlgorithmModelJson } from '../single-algorithm-model';
import { MultipleAlgorithmModelJson } from '../multiple-algorithm-model';
import { Data } from '../data';
import { ModelTypes } from './model-types';
import { IAlgorithmJson } from '../algorithm';
export declare type JsonModelTypes = SingleAlgorithmModelJson | MultipleAlgorithmModelJson;
export declare function getAlgorithmJsonForModelAndData(model: JsonModelTypes, data: Data): IAlgorithmJson;
export declare function parseModelJsonToModel(modelTypeJson: JsonModelTypes): ModelTypes;
