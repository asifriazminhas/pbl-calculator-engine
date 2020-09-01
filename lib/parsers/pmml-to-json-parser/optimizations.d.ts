import { IModelJson } from '../../parsers/json/json-model';
import { JsonAlgorithms } from '../json/json-algorithms';
export declare function optimizeModel<T extends JsonAlgorithms>(model: IModelJson<T>): IModelJson<T>;
