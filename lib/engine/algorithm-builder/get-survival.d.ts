import { Cox } from '../cox/cox';
import { Data } from '../common/datum';
export declare function curryGetSurvivalFunction(cox: Cox): (data: Data) => number;
export interface GetSurvival {
    getSurvival: (data: Data) => number;
}
