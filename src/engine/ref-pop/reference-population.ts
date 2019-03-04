import { PredicateJson } from '../../parsers/json/json-predicate';

export interface ReferencePopulationRow {
    age: number;
    outcomeRisk: number;
}

export type ReferencePopulation = Array<ReferencePopulationRow>;

export type RefPopsWithPredicate = Array<{
    refPop: ReferencePopulation;
    predicate: PredicateJson;
}>;
