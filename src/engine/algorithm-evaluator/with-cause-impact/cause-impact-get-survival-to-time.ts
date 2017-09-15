import * as moment from 'moment';
import { CoxJson } from '../../common/json-types';
import { Data } from '../../common/data';
import { getDataForCauseImpactForRiskFactor } from './cause-impact-common';
import { Cox, getSurvivalToTime } from '../../cox';

export interface GetSurvivalToTimeWithCauseImpact {
    getSurvivalToTime: (data: Data, time?: moment.Moment | Date) => number;
}

export function getGetSurvivalToTimeWithCauseImpact(
    coxJson: CoxJson,
    cox: Cox,
    riskFactor: string
): GetSurvivalToTimeWithCauseImpact {
    return {
        getSurvivalToTime: (data, time) => {
            return getSurvivalToTime(
                cox,
                getDataForCauseImpactForRiskFactor(
                    coxJson,
                    riskFactor,
                    data
                ),
                time
            )
        }
    };
}