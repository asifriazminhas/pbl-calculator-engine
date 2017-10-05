import * as moment from 'moment';
import { Data } from '../../common/data';
import { getRiskToTimeWithCauseImpact, CauseImpactRef, CauseImpactRefTypes, getCauseImpactRefForData } from '../../cause-impact';
import { ModelTypes, getAlgorithmForModelAndData, JsonModelTypes, getAlgorithmJsonForModelAndData } from '../../model';

export interface GetRiskToTimeWithCauseImpact {
    getRiskToTime: (data: Data, time?: moment.Moment | Date) => number;
}

export function getGetRiskToTimeWithCauseImpact(
    model: ModelTypes,
    modelJson: JsonModelTypes,
    riskFactors: string[],
    causeImpactRef?: CauseImpactRefTypes,
): GetRiskToTimeWithCauseImpact {
    return {
        getRiskToTime: (data, time) => {
            let causeImpactRefToUse: CauseImpactRef;
            if(!causeImpactRef) {
                causeImpactRefToUse = getAlgorithmJsonForModelAndData(
                    modelJson, data
                ).causeDeletedRef;
            } else {
                causeImpactRefToUse = getCauseImpactRefForData(
                    causeImpactRef,
                    data
                )
            }

            return getRiskToTimeWithCauseImpact(
                causeImpactRefToUse,
                getAlgorithmForModelAndData(model, data),
                riskFactors,
                data,
                time
            )
        }
    };
}