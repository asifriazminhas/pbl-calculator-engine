import { Data } from '../common/datum';
import { ReferencePopulation } from '../health-age/reference-population';
import { getHealthAge } from '../health-age/health-age';
import { Cox } from '../cox';

export interface GetHealthAge {
    getHealthAge: (data: Data) => number;
}

export function getGetHealthAge(
    refPop: ReferencePopulation,
    cox: Cox
): GetHealthAge {
    return {
        getHealthAge: (data) => {
            return getHealthAge(refPop, data, cox);
        }
    }
}
