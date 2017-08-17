import { IDerivedField, mergeDerivedFields } from './derived_field';
import { returnEmptyArrayIfUndefined } from '../../common/undefined';

export interface ILocalTransformations {
    DerivedField: Array<IDerivedField>;
}

export function mergeLocalTransformations(
    localTransformationsOne: ILocalTransformations,
    localTransformationsTwo: ILocalTransformations
): ILocalTransformations {
    return {
        DerivedField: mergeDerivedFields(
            localTransformationsOne ? returnEmptyArrayIfUndefined(
                localTransformationsOne.DerivedField
             ) : [],
            localTransformationsTwo ? returnEmptyArrayIfUndefined(
                localTransformationsTwo.DerivedField
             ) : []
        )
    };
}