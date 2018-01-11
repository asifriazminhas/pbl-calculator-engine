import { ReferencePopulation } from './reference-population';
import { RefPopFunctions } from './ref-pop-functions';
import { ModelTypes } from '../model';
export interface IWithRefPopBuilderFunction {
    withRefPop: (refPop: ReferencePopulation) => RefPopFunctions;
}
export interface IRefPopFunctionsBuilder {
    withModel: (model: ModelTypes) => IWithRefPopBuilderFunction;
}
export declare const RefPopFunctionsBuilder: IRefPopFunctionsBuilder;
