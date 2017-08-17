import { Cox } from '../cox/cox';
import { Data } from '../common/datum';
export interface GetRisk {
    getRisk: (data: Data) => number;
}
export declare function curryGetRiskFunction(cox: Cox): (data: Data) => number;
