import { Data } from '../data';
import { ReferencePopulation } from './reference-population';
import { Cox } from '../cox';
export declare function getHealthAge(refPop: ReferencePopulation, data: Data, cox: Cox, oneYearRisk?: number): number;
