import { Data } from '../data';
import { ReferencePopulation } from './reference-population';
import { CoxSurvivalAlgorithm } from '../algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm';

export function getHealthAge(
    refPop: ReferencePopulation,
    data: Data,
    cox: CoxSurvivalAlgorithm,
    oneYearRisk: number = cox.getRiskToTime(data),
): number {
    return refPop.reduce((currentRefPopRow, refPopRow) => {
        if (
            Math.abs(refPopRow.outcomeRisk - oneYearRisk) <
            Math.abs(currentRefPopRow.outcomeRisk - oneYearRisk)
        ) {
            return refPopRow;
        }

        return currentRefPopRow;
    }, refPop[0]).age;
}
