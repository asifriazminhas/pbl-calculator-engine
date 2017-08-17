import { IDerivedField } from './derived_field';
export interface ILocalTransformations {
    DerivedField: Array<IDerivedField>;
}
export declare function mergeLocalTransformations(localTransformationsOne: ILocalTransformations, localTransformationsTwo: ILocalTransformations): ILocalTransformations;
