import { IGenericCox } from './generic-cox';
import { DerivedFieldJson } from '../derived-field';
import { CovariateJson } from '../covariate';

export interface ICoxJson extends IGenericCox<CovariateJson, string> {
    derivedFields: DerivedFieldJson[];
    // TODO Implement this
    causeDeletedRef: any;
}
