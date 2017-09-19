import { CauseImpactRef } from './cause-impact-ref';
import { Cox, getSurvivalToTime, getRiskToTime } from '../cox';
import { Data, updateDataWithData } from '../common/data';
import * as moment from 'moment';
import { RefLifeTable, CompleteLifeTable } from '../common/life-table';
import { getLifeExpectancyUsingRefLifeTable } from '../life-expectancy';

function getCauseImpactDataForRiskFactors(
    riskFactors: Array<string>,
    causeImpactRef: CauseImpactRef
): Data {
    return riskFactors
        .map((riskFactor) => {
            return causeImpactRef[riskFactor]
        })
        .reduce((currentCauseImpactRefData, causeImpactRefData) => {
            return currentCauseImpactRefData.concat(causeImpactRefData);
        }, []);
}

export function getSurvivalToTimeWithCauseImpact(
    causeImpactRef: CauseImpactRef,
    cox: Cox,
    riskFactors: Array<string>,
    data: Data,
    time?: Date | moment.Moment
): number {
    const causeImpactRefData = getCauseImpactDataForRiskFactors(
        riskFactors,
        causeImpactRef
    );

    return getSurvivalToTime(
        cox,
        updateDataWithData(data, causeImpactRefData),
        time
    );
}

export function getRiskToTimeWithCauseImpact(
    causeImpactRef: CauseImpactRef,
    cox: Cox,
    riskFactors: string[],
    data: Data,
    time?: Date | moment.Moment
): number { 
    const causeImpactRefData = getCauseImpactDataForRiskFactors(
        riskFactors,
        causeImpactRef
    );

    return getRiskToTime(
        cox,
        updateDataWithData(data, causeImpactRefData),
        time
    );
}

export function getLifeExpectancyWithCauseImpact(
    causeImpactRef: CauseImpactRef,
    cox: Cox,
    refLifeTable: RefLifeTable,
    riskFactors: Array<string>,
    data: Data,
    useExFromLifeTableFromAge: number = 99,
    completeLifeTableForCauseImpactData?: CompleteLifeTable
): number {
    const causeImpactRefData = getCauseImpactDataForRiskFactors(
        riskFactors,
        causeImpactRef
    );

    return getLifeExpectancyUsingRefLifeTable(
        updateDataWithData(data, causeImpactRefData),
        refLifeTable,
        cox,
        useExFromLifeTableFromAge,
        completeLifeTableForCauseImpactData
    )
}
