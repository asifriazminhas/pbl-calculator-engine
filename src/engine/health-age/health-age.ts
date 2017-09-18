import { Data } from '../common/datum';
import { ReferencePopulation } from './reference-population';
import { Cox, getRiskToTime } from '../cox';

export function getHealthAge(
    refPop: ReferencePopulation,
    data: Data,
    cox: Cox
): number {
    const oneYearRisk = getRiskToTime(cox, data);

    return refPop.reduce((currentRefPopRow, refPopRow) => {
        if(Math.abs(refPopRow.outcomeRisk - oneYearRisk) < 
            Math.abs(currentRefPopRow.outcomeRisk - oneYearRisk)) {
            return refPopRow;
        }
        
        return currentRefPopRow;
    }, refPop[0]).age;
}