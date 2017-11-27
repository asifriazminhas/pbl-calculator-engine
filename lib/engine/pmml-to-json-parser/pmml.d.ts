import { JsonModelTypes } from '../model';
import { Predicate } from '../multiple-algorithm-model';
export declare function pmmlXmlStringsToJson(modelPmmlXmlStrings: string[][], predicates: Predicate[]): Promise<JsonModelTypes>;
