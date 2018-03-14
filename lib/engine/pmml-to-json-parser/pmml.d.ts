import { JsonModelTypes } from '../model';
import { IPredicate } from '../multiple-algorithm-model';
export declare function pmmlXmlStringsToJson(modelPmmlXmlStrings: string[][], predicates: IPredicate[]): Promise<JsonModelTypes>;
