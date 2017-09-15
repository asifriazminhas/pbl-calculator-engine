import * as moment from 'moment';
import { Data } from '../../common/data';
import { getDataForCauseImpactForRiskFactor } from './cause-impact-common';
import { CoxJson } from '../../common/json-types';
import { Cox , getRiskToTime } from '../../cox';
import { } from '../'
export interface GetRiskToTimeWithCauseImpact {
    getRiskToTime: (data: Data, time?: moment.Moment | Date) => number;
}

export function getGetRiskToTimeWithCauseImpact(
    coxJson: CoxJson,
    cox: Cox,
    riskFactor: string
): GetRiskToTimeWithCauseImpact {
    return {
        getRiskToTime: (data, time) => {
            return getRiskToTime(
                cox,
                getDataForCauseImpactForRiskFactor(
                    coxJson,
                    riskFactor,
                    data
                ),
                time
            );
        }
    };
}