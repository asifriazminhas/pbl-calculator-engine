import { CauseImpactRef } from './cause-impact-ref';
import { Cox, getSurvivalToTime, getRiskToTime } from '../cox';
import { Data, updateDataWithData } from '../common/data';
import * as moment from 'moment';
import { RefLifeTable } from '../common/life-table';
import { getLifeExpectancyUsingRefLifeTable } from '../life-expectancy';

export function getSurvivalToTimeWithCauseImpact(
    causeImpactRef: CauseImpactRef,
    cox: Cox,
    riskFactor: string,
    data: Data,
    time?: Date | moment.Moment
): number {
    return getSurvivalToTime(
        cox,
        updateDataWithData(data, causeImpactRef[riskFactor]),
        time
    );
}

export function getRiskToTimeWithCauseImpact(
    causeImpactRef: CauseImpactRef,
    cox: Cox,
    riskFactor: string,
    data: Data,
    time?: Date | moment.Moment
): number { 
    return getRiskToTime(
        cox,
        updateDataWithData(data, causeImpactRef[riskFactor]),
        time
    );
}

export function getLifeExpectancyWithCauseImpact(
    causeImpactRef: CauseImpactRef,
    cox: Cox,
    refLifeTable: RefLifeTable,
    riskFactor: string,
    data: Data,
    useExFromLifeTableFromAge: number = 99
): number {
    return getLifeExpectancyUsingRefLifeTable(
        updateDataWithData(data, causeImpactRef[riskFactor]),
        refLifeTable,
        cox,
        useExFromLifeTableFromAge
    )
}
