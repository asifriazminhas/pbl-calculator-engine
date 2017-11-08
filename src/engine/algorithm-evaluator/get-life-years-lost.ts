import { Data } from '../data';
import { RefLifeTable } from '../life-table';
import { getLifeYearsLost } from '../life-years-lost';
import {
    CauseImpactRefTypes,
    getCauseImpactRefForData,
    CauseImpactRef,
} from '../cause-impact';
import {
    ModelTypes,
    getAlgorithmJsonForModelAndData,
    getAlgorithmForModelAndData,
    JsonModelTypes,
} from '../model';

export interface GetLifeYearsLost {
    getLifeYearsLost: (
        data: Data,
        riskFactors: string[],
        useExFromLifeTableFromAge: number,
    ) => number;
}

export function getGetLifeYearsLost(
    model: ModelTypes,
    modelJson: JsonModelTypes,
    refLifeTable: RefLifeTable,
    causeDeletedRef?: CauseImpactRefTypes,
): GetLifeYearsLost {
    return {
        getLifeYearsLost: (
            data,
            riskFactors,
            useExFromLifeTableFromAge = 99,
        ) => {
            let causeImpactRefToUse: CauseImpactRef;
            if (!causeDeletedRef) {
                causeImpactRefToUse = getAlgorithmJsonForModelAndData(
                    modelJson,
                    data,
                ).causeDeletedRef;
            } else {
                causeImpactRefToUse = getCauseImpactRefForData(
                    causeDeletedRef,
                    data,
                );
            }

            return getLifeYearsLost(
                causeImpactRefToUse,
                refLifeTable,
                getAlgorithmForModelAndData(model, data),
                data,
                riskFactors,
                useExFromLifeTableFromAge,
            );
        },
    };
}
