import * as moment from 'moment';
import { Data } from '../../common/data';
import { Cox } from '../../cox';
import { getRiskToTimeWithCauseImpact, CauseImpactRef } from '../../cause-impact';

export interface GetRiskToTimeWithCauseImpact {
    getRiskToTime: (data: Data, time?: moment.Moment | Date) => number;
}

export function getGetRiskToTimeWithCauseImpact(
    causeImpactRef: CauseImpactRef,
    cox: Cox,
    riskFactor: string
): GetRiskToTimeWithCauseImpact {
    return {
        getRiskToTime: (data, time) => {
            return getRiskToTimeWithCauseImpact(
                causeImpactRef,
                cox,
                riskFactor,
                data,
                time
            )
        }
    };
}