import { IDerivedField } from './derived_field';
import { DefineFunction } from './define-function';
export interface ILocalTransformations {
    DerivedField: Array<IDerivedField>;
    DefineFunction: Array<DefineFunction>;
}
export declare function mergeLocalTransformations(localTransformationsOne: ILocalTransformations, localTransformationsTwo: ILocalTransformations): ILocalTransformations;
