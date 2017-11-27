import { GenericBaseCovariate } from './generic-covariate';
import { DerivedField } from '../derived-field';
import { Covariate } from './covariate';
import { Data } from '../data';
import { Cox } from '../cox';
export interface IBaseCovariate extends GenericBaseCovariate<Covariate> {
    derivedField: DerivedField | undefined;
}
export declare function calculateDataToCalculateCoefficent(covariate: IBaseCovariate, data: Data, userDefinedFunctions: Cox['userFunctions']): Data;
