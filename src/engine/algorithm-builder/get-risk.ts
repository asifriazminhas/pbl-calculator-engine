import { getRisk, Cox } from '../cox/cox';
import { Data } from '../common/datum';

export interface GetRisk {
    getRisk: (data: Data) => number;
}

export function curryGetRiskFunction(
    cox: Cox
): (data: Data) => number {
    return (data) => {
        return getRisk(cox, data);
    }
}