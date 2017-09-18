import { WithCauseImpactChainMethodResult } from './with-cause-impact-common';
import { BaseWithDataResult } from '../with-data';
import { } from '../../..'
export interface GetLifeExpectancyWithCauseImpact<
    T extends object,
    U extends BaseWithDataResult<T & WithCauseImpactChainMethodResult>
> {
    getLifeExpectancy: () => U;
}

export function getGetLifeExpectancyWithCauseImpact<
    T extends object,
    U extends BaseWithDataResult<T & WithCauseImpactChainMethodResult>
>(
    currentResult: T,
    getNextObjectInChain: (nextResult: T & WithCauseImpactChainMethodResult) => U
): GetLifeExpectancyWithCauseImpact<T, U> {
    return {
        getLifeExpectancy: () => {
            const lifeExpectancyWithCauseImpact = Math.random();

            return getNextObjectInChain(
                Object.assign({}, currentResult, {
                    withCauseImpact: {
                        'placeholder': {
                            survivalToTime: [],
                            riskToTime: [],
                            lifeExpectancy: lifeExpectancyWithCauseImpact
                        }
                    }
                })
            )
        }
    }
}