import { Data } from '../common/datum';
import { RefLifeTable } from '../common/life-table';
import { CauseImpactRef, getLifeExpectancyWithCauseImpact } from '../cause-impact';
import { getLifeExpectancyUsingRefLifeTable } from '../life-expectancy';
import { Cox } from '../cox';

export function getLifeYearsLost(
    causeDeletedRef: CauseImpactRef,
    refLifeTable: RefLifeTable,
    cox: Cox,
    data: Data,
    riskFactor: string,
    useExFromLifeTableFromAge: number = 99
): number {
    return getLifeExpectancyUsingRefLifeTable(
        data,
        refLifeTable,
        cox,
        useExFromLifeTableFromAge
    ) - getLifeExpectancyWithCauseImpact(
        causeDeletedRef,
        cox,
        refLifeTable,
        riskFactor,
        data,
        useExFromLifeTableFromAge
    )
}