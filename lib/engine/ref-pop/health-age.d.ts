import { Data } from '../data';
import { ReferencePopulation } from './reference-population';
import { CoxSurvivalAlgorithm } from '../algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm';
export declare function getHealthAge(refPop: ReferencePopulation, data: Data, cox: CoxSurvivalAlgorithm, oneYearRisk?: number): number;
