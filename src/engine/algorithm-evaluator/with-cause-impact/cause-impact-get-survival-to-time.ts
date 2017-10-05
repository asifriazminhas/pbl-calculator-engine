import * as moment from 'moment';
import { Data } from '../../common/data';
import { CauseImpactRef, getSurvivalToTimeWithCauseImpact, CauseImpactRefTypes, getCauseImpactRefForData } from '../../cause-impact';
import { ModelTypes, getAlgorithmForModelAndData, JsonModelTypes, getAlgorithmJsonForModelAndData } from '../../model';

export interface GetSurvivalToTimeWithCauseImpact {
    getSurvivalToTime: (data: Data, time?: moment.Moment | Date) => number;
}

export function getGetSurvivalToTimeWithCauseImpact(
    model: ModelTypes,
    modelJson: JsonModelTypes,
    riskFactors: string[],
    causeImpactRef?: CauseImpactRefTypes,
): GetSurvivalToTimeWithCauseImpact {
    return {
        getSurvivalToTime: (data, time) => {
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
            
            return getSurvivalToTimeWithCauseImpact(
                causeImpactRefToUse,
                getAlgorithmForModelAndData(model, data),
                riskFactors,
                data,
                time
            )
        }
    };
}