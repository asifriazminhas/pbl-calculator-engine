import { Data } from '../common/datum';
import { ReferencePopulation } from '../health-age/reference-population';
import { getHealthAge } from '../health-age/health-age';

export interface GetHealthAge {
    getHealthAge: (data: Data) => number;
}

export function getGetHealthAge(
    refPop: ReferencePopulation
): GetHealthAge {
    return {
        getHealthAge: (data) => {
            return getHealthAge(refPop, data);
        }
    }
}
