import { Data } from '../../common/data';
import { RefLifeTable } from '../../common/life-table';
import { Cox } from '../../cox';
import { getLifeExpectancyWithCauseImpact, CauseImpactRef } from '../../cause-impact';

export interface GetLifeExpectancyWithCauseImpact {
    getLifeExpectancy: (data: Data) => number
}

export function getGetLifeExpectancyWithCauseImpact(
    causeImpactRef: CauseImpactRef,
    riskFactors: Array<string>,
    refLifeTable: RefLifeTable,
    coxAlgorithm: Cox,
    useExFromLifeTableFromAge: number = 99
): GetLifeExpectancyWithCauseImpact {
    return {
        getLifeExpectancy: (data) => {
            return getLifeExpectancyWithCauseImpact(
                causeImpactRef,
                coxAlgorithm,
                refLifeTable,
                riskFactors,
                data,
                useExFromLifeTableFromAge
            )
        }
    }
}