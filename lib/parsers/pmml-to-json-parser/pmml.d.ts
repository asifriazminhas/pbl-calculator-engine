import { IModelJson } from '../../parsers/json/json-model';
import { PredicateJson } from '../../parsers/json/json-predicate';
export declare function pmmlXmlStringsToJson(modelPmmlXmlStrings: string[][], predicates: PredicateJson[]): Promise<IModelJson<any>>;
