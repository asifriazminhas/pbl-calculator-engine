import { Data } from '../common/datum';
import { ReferencePopulation } from '../health-age/reference-population';
import { getHealthAge } from '../health-age/health-age';

export type GetHealthAgeFunction = (data: Data) => number;

export interface GetHealthAge {
    getHealthAge: GetHealthAgeFunction;
}

export function curryGetHeathAgeFunction(
    refPop: ReferencePopulation
): GetHealthAgeFunction {
    return (data) => {
        return getHealthAge(refPop, data);
    }
}
