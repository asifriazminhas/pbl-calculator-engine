import { GenericBaseDerivedField, GenericCategoricalDerivedField, GenericContinuousDerivedField } from './generic-derived-field';
import { DerivedFrom } from './derived-from';
import { Data, Coefficent } from '../data';
import { Cox } from '../cox';
export interface IBaseDerivedField extends GenericBaseDerivedField<DerivedFrom> {
}
export interface ICategoricalDerivedField extends GenericCategoricalDerivedField<DerivedFrom> {
}
export interface IContinuousDerivedField extends GenericContinuousDerivedField<DerivedFrom> {
}
export declare type DerivedField = IBaseDerivedField | ICategoricalDerivedField | IContinuousDerivedField;
export declare function calculateCoefficent(derivedField: DerivedField, data: Data, userDefinedFunctions: Cox['userFunctions']): Coefficent;
export declare function calculateDataToCalculateCoefficent(derivedField: DerivedField, data: Data, userDefinedFunctions: Cox['userFunctions']): Data;
export declare function getLeafFieldsForDerivedField(derivedField: DerivedField): DerivedFrom[];
