import { WithCauseImpactChainMethodResult } from './with-cause-impact-common';
import { BaseWithDataResult } from '../with-data';

export interface GetSurvivalToTimeWithCauseImpact<
    T extends object,
    U extends BaseWithDataResult<T & WithCauseImpactChainMethodResult>
    > {
    getSurvivalToTime: () => U;
}

export function getGetSurvivalToTimeWithCauseImpact<
    T extends object,
    U extends BaseWithDataResult<T & WithCauseImpactChainMethodResult>
>(
    currentResult: T,
    getNextObjectInChain: (nextResult: T & WithCauseImpactChainMethodResult) => U
): GetSurvivalToTimeWithCauseImpact<T, U> {
    return {
        getSurvivalToTime: () => {
            const survivalToTimeWithCauseImpact = Math.random();

            return getNextObjectInChain(
                Object.assign({}, currentResult, {
                    withCauseImpact: {
                        'placeholder': {
                            survivalToTime: [survivalToTimeWithCauseImpact],
                            riskToTime: [],
                            lifeExpectancy: 0
                        }
                    }
                })
            );
        }
    }
}