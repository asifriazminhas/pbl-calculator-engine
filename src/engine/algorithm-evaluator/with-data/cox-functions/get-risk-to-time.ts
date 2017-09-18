import { BaseWithDataResult, getNextObjectInChain } from '../with-data';

export interface GetRiskToTimeResult {
    riskToTime: number;
}

export interface GetRiskToTime<
    T extends object,
    U extends BaseWithDataResult<T & GetRiskToTimeResult>
> {
    getRiskToTime: () => U;
}

export function getGetRiskToTime<
    T extends object,
    U extends BaseWithDataResult<T & GetRiskToTimeResult>
>(
    currentResult: T,
    getNextObjectInChain: getNextObjectInChain<T & GetRiskToTimeResult, U>
): GetRiskToTime<T, U> {
    return {
        getRiskToTime: () => {
            const riskToTime = Math.random();

            return getNextObjectInChain(
                Object.assign({}, currentResult, { riskToTime }),
                {}
            )
        }
    }
}