import { GenericCategoricalDerivedField, GenericContinuousDerivedField, GenericDerivedFieldWithoutOpType, GenericDataField } from '../common/generic-types';
import { Data, Coefficent } from '../common/datum';
import { Covariate } from './covariate';
export declare type DerivedFrom = DerivedField | GenericDataField | Covariate;
export interface DerivedFieldWithoutOpType extends GenericDerivedFieldWithoutOpType<DerivedFrom> {
}
export interface CategoricalDerivedField extends GenericCategoricalDerivedField<DerivedFrom> {
}
export interface ContinuousDerivedField extends GenericContinuousDerivedField<DerivedFrom> {
}
export declare type DerivedField = DerivedFieldWithoutOpType | CategoricalDerivedField | ContinuousDerivedField;
export declare function calculateCoefficent(derivedField: DerivedField, data: Data): Coefficent;
export declare function calculateDataToCalculateCoefficent(derivedField: DerivedField, data: Data): Data;
