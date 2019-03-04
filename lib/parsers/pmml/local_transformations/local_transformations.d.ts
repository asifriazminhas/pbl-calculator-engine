import { IDerivedField } from './derived_field';
import { DefineFunction } from './define-function';
export interface ILocalTransformations {
    DerivedField: IDerivedField[] | IDerivedField;
    DefineFunction?: DefineFunction[];
}
export declare function mergeLocalTransformations(localTransformationsOne: ILocalTransformations, localTransformationsTwo: ILocalTransformations): ILocalTransformations;
