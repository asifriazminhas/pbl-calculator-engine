import { IDerivedField, mergeDerivedFields } from './derived_field';
import { returnEmptyArrayIfUndefined } from '../../../util/undefined';
import { DefineFunction, mergeDefineFunctions } from './define-function';

export interface ILocalTransformations {
    DerivedField: IDerivedField[] | IDerivedField;
    DefineFunction?: DefineFunction[];
}

export function mergeLocalTransformations(
    localTransformationsOne: ILocalTransformations,
    localTransformationsTwo: ILocalTransformations,
): ILocalTransformations {
    return {
        DerivedField: mergeDerivedFields(
            localTransformationsOne
                ? localTransformationsOne.DerivedField instanceof Array ||
                  localTransformationsOne.DerivedField === undefined
                  ? returnEmptyArrayIfUndefined(
                        localTransformationsOne.DerivedField,
                    )
                  : [localTransformationsOne.DerivedField]
                : [],
            localTransformationsTwo
                ? localTransformationsTwo.DerivedField instanceof Array ||
                  localTransformationsTwo.DerivedField === undefined
                  ? returnEmptyArrayIfUndefined(
                        localTransformationsTwo.DerivedField,
                    )
                  : [localTransformationsTwo.DerivedField]
                : [],
        ),
        DefineFunction: mergeDefineFunctions(
            localTransformationsOne
                ? returnEmptyArrayIfUndefined(
                      localTransformationsOne.DefineFunction,
                  )
                : [],
            localTransformationsTwo
                ? returnEmptyArrayIfUndefined(
                      localTransformationsTwo.DefineFunction,
                  )
                : [],
        ),
    };
}
