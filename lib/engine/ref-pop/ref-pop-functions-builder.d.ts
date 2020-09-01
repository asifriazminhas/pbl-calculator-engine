import { ReferencePopulation, RefPopsWithPredicate } from './reference-population';
import { RefPopFunctions } from './ref-pop-functions';
import { Model } from '../model/model';
import { CoxSurvivalAlgorithm } from '../model';
export interface IWithRefPopBuilderFunction {
    withRefPop: (refPop: ReferencePopulation | RefPopsWithPredicate) => RefPopFunctions;
}
export interface IRefPopFunctionsBuilder {
    withModel: (model: Model<CoxSurvivalAlgorithm>) => IWithRefPopBuilderFunction;
}
export declare const RefPopFunctionsBuilder: IRefPopFunctionsBuilder;
