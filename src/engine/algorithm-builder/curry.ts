import { getSurvival, getRisk, Cox } from '../cox/cox';
import { Data } from '../common/datum';

export function curryGetSurvivalFunction(
    cox: Cox
): (data: Data) => number {
    return (data) => {
        return getSurvival(cox, data);
    }
}

export function curryGetRiskFunction(
    cox: Cox
): (data: Data) => number {
    return (data) => {
        return getRisk(cox, data);
    }
}