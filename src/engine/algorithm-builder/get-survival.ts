import { getSurvival, Cox } from '../cox/cox';
import { Data } from '../common/datum';

export function curryGetSurvivalFunction(
    cox: Cox
): (data: Data) => number {
    return (data) => {
        return getSurvival(cox, data);
    }
}

export interface GetSurvival {
    getSurvival: (data: Data) => number;
}