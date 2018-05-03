import {
    ReferencePopulation,
    RefPopsWithPredicate,
} from './reference-population';
import { RefPopFunctions } from './ref-pop-functions';
import { Model } from '../model/model';

export interface IWithRefPopBuilderFunction {
    withRefPop: (
        refPop: ReferencePopulation | RefPopsWithPredicate,
    ) => RefPopFunctions;
}

export interface IRefPopFunctionsBuilder {
    withModel: (model: Model) => IWithRefPopBuilderFunction;
}

export const RefPopFunctionsBuilder: IRefPopFunctionsBuilder = {
    withModel: model => {
        return {
            withRefPop: refPop => {
                return new RefPopFunctions(model, refPop);
            },
        };
    },
};
