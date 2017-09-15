import { Data } from '../../common/data';
import { getLifeExpectancyUsingRefLifeTable } from '../../life-expectancy';
import { RefLifeTable } from '../../common/life-table';
import { Cox } from '../../cox';
import { getDataForCauseImpactForRiskFactor } from './cause-impact-common';
import { CoxJson } from '../../common/json-types';

export interface GetLifeExpectancyWithCauseImpact {
    getLifeExpectancy: (data: Data) => number
}

export function getGetLifeExpectancyWithCauseImpact(
    riskFactor: string,
    refLifeTable: RefLifeTable,
    coxAlgorithm: Cox,
    coxJson: CoxJson,
    useExFromLifeTableFromAge: number = 99
): GetLifeExpectancyWithCauseImpact {
    return {
        getLifeExpectancy: (data) => {
            return getLifeExpectancyUsingRefLifeTable(
                getDataForCauseImpactForRiskFactor(
                    coxJson,
                    riskFactor,
                    data
                ),
                refLifeTable,
                coxAlgorithm,
                useExFromLifeTableFromAge
            )
        }
    }
}