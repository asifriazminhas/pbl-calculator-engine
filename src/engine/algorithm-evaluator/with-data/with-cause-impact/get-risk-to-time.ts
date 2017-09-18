import { WithCauseImpactChainMethodResult } from './with-cause-impact-common';
import { BaseWithDataResult } from '../with-data';

export interface GetRiskToTimeWithCauseImpact<
    T extends object,
    U extends BaseWithDataResult<T & WithCauseImpactChainMethodResult>
> {
    getRiskToTime: () => U;
}

export function getGetRiskToTimeWithCauseImpact<
    T extends object,
    U extends BaseWithDataResult<T & WithCauseImpactChainMethodResult>
>(
    currentResult: T,
    getNextObjectInChain: (nextResult: T & WithCauseImpactChainMethodResult) => U
): GetRiskToTimeWithCauseImpact<T, U> {
    return {
        getRiskToTime: () => {
            const riskToTimeWithCauseImpact = Math.random();

            return getNextObjectInChain(
                Object.assign({}, currentResult, {
                    withCauseImpact: {
                        'placeholder': {
                            survivalToTime: [],
                            riskToTime: [riskToTimeWithCauseImpact],
                            lifeExpectancy: 0
                        }
                    }
                })
            );
        }
    }
}