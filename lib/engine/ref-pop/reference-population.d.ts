import { PredicateJson } from '../../parsers/json/json-predicate';
export interface ReferencePopulationRow {
    age: number;
    outcomeRisk: number;
}
export declare type ReferencePopulation = Array<ReferencePopulationRow>;
export declare type RefPopsWithPredicate = Array<{
    refPop: ReferencePopulation;
    predicate: PredicateJson;
}>;
