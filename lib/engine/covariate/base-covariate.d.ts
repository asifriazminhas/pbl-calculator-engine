import { GenericBaseCovariate } from './generic-covariate';
import { DerivedField } from '../derived-field';
import { Covariate } from './covariate';
import { Data } from '../data';
import { Algorithm } from '../algorithm/algorithm';
export interface IBaseCovariate extends GenericBaseCovariate<Covariate> {
    derivedField: DerivedField | undefined;
}
export declare function calculateDataToCalculateCoefficent(covariate: IBaseCovariate, data: Data, userDefinedFunctions: Algorithm<any>['userFunctions'], tables: Algorithm<any>['tables']): Data;
