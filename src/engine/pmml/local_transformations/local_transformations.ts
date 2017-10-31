import { IDerivedField, mergeDerivedFields } from './derived_field';
import { returnEmptyArrayIfUndefined } from '../../undefined';
import { DefineFunction, mergeDefineFunctions } from './define-function';

export interface ILocalTransformations {
    DerivedField: Array<IDerivedField>;
    DefineFunction: Array<DefineFunction>;
}

export function mergeLocalTransformations(
    localTransformationsOne: ILocalTransformations,
    localTransformationsTwo: ILocalTransformations
): ILocalTransformations {
    return {
        DerivedField: mergeDerivedFields(
            localTransformationsOne ? returnEmptyArrayIfUndefined(
                localTransformationsOne.DerivedField,
             ) : [],
            localTransformationsTwo ? returnEmptyArrayIfUndefined(
                localTransformationsTwo.DerivedField
             ) : []
        ),
        DefineFunction: mergeDefineFunctions(
            localTransformationsOne ? returnEmptyArrayIfUndefined(
                localTransformationsOne.DefineFunction,
             ) : [],
            localTransformationsTwo ? returnEmptyArrayIfUndefined(
                localTransformationsTwo.DefineFunction
             ) : []
        )
    };
}