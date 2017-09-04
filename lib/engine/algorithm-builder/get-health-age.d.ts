import { Data } from '../common/datum';
import { ReferencePopulation } from '../health-age/reference-population';
export declare type GetHealthAgeFunction = (data: Data) => number;
export interface GetHealthAge {
    getHealthAge: GetHealthAgeFunction;
}
export declare function curryGetHeathAgeFunction(refPop: ReferencePopulation): GetHealthAgeFunction;
