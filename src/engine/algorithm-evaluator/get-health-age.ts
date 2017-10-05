import { Data } from '../common/datum';
import { ReferencePopulation } from '../health-age/reference-population';
import { getHealthAge } from '../health-age/health-age';
import { ModelTypes, getAlgorithmForModelAndData } from '../model';

export interface GetHealthAge {
    getHealthAge: (data: Data) => number;
}

export function getGetHealthAge(
    refPop: ReferencePopulation,
    model: ModelTypes
): GetHealthAge {
    return {
        getHealthAge: (data) => {
            return getHealthAge(
                refPop, data, getAlgorithmForModelAndData(model, data));
        }
    }
}
