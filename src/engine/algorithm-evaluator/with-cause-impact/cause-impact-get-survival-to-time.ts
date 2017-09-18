import * as moment from 'moment';
import { Data } from '../../common/data';
import { CauseImpactRef, getSurvivalToTimeWithCauseImpact } from '../../cause-impact';
import { Cox } from '../../cox';

export interface GetSurvivalToTimeWithCauseImpact {
    getSurvivalToTime: (data: Data, time?: moment.Moment | Date) => number;
}

export function getGetSurvivalToTimeWithCauseImpact(
    causeImpactRef: CauseImpactRef,
    cox: Cox,
    riskFactor: string
): GetSurvivalToTimeWithCauseImpact {
    return {
        getSurvivalToTime: (data, time) => {
            return getSurvivalToTimeWithCauseImpact(
                causeImpactRef,
                cox,
                riskFactor,
                data,
                time
            )
        }
    };
}