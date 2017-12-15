import { GenericBaseDerivedField, GenericCategoricalDerivedField, GenericContinuousDerivedField } from './generic-derived-field';
import { DerivedFrom } from './derived-from';
import { Data, Coefficent } from '../data';
import { Cox } from '../cox';
import { Algorithm } from '../algorithm';
export interface IBaseDerivedField extends GenericBaseDerivedField<DerivedFrom> {
}
export interface ICategoricalDerivedField extends GenericCategoricalDerivedField<DerivedFrom> {
}
export interface IContinuousDerivedField extends GenericContinuousDerivedField<DerivedFrom> {
}
export declare type DerivedField = IBaseDerivedField | ICategoricalDerivedField | IContinuousDerivedField;
export declare function calculateCoefficent(derivedField: DerivedField, data: Data, userDefinedFunctions: Algorithm<any>['userFunctions'], tables: Algorithm<any>['tables']): Coefficent;
export declare function calculateDataToCalculateCoefficent(derivedField: DerivedField, data: Data, userDefinedFunctions: Cox['userFunctions'], tables: Algorithm<any>['tables']): Data;
export declare function getLeafFieldsForDerivedField(derivedField: DerivedField): DerivedFrom[];
export declare function findDescendantDerivedField(derivedField: DerivedField, name: string): DerivedField | undefined;
