import { Data } from '../../common/data';
import { RefLifeTable } from '../../life-table';
import { getLifeExpectancyWithCauseImpact, CauseImpactRef, CauseImpactRefTypes, getCauseImpactRefForData } from '../../cause-impact';
import { ModelTypes, getAlgorithmForModelAndData, JsonModelTypes, getAlgorithmJsonForModelAndData } from '../../model';

export interface GetLifeExpectancyWithCauseImpact {
    getLifeExpectancy: (data: Data) => number
}

export function getGetLifeExpectancyWithCauseImpact(
    riskFactors: Array<string>,
    refLifeTable: RefLifeTable,
    model: ModelTypes,
    modelJson: JsonModelTypes,
    useExFromLifeTableFromAge: number = 99,
    causeImpactRef?: CauseImpactRefTypes,
): GetLifeExpectancyWithCauseImpact {
    return {
        getLifeExpectancy: (data) => {
            let causeImpactRefToUse: CauseImpactRef;
            if(!causeImpactRef) {
                causeImpactRefToUse = getAlgorithmJsonForModelAndData(
                    modelJson, data
                ).causeDeletedRef;
            } else {
                causeImpactRefToUse = getCauseImpactRefForData(
                    causeImpactRef,
                    data
                );
            }

            return getLifeExpectancyWithCauseImpact(
                causeImpactRefToUse,
                getAlgorithmForModelAndData(model, data),
                refLifeTable,
                riskFactors,
                data,
                useExFromLifeTableFromAge
            )
        }
    }
}