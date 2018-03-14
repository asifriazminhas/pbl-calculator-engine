//TODO Remove predicate out into it's own module
import { IPredicate } from '../multiple-algorithm-model/predicate/predicate';

export interface ReferencePopulationRow {
    age: number;
    outcomeRisk: number;
}

export type ReferencePopulation = Array<ReferencePopulationRow>;

export type RefPopsWithPredicate = Array<{
    refPop: ReferencePopulation;
    predicate: IPredicate;
}>;
