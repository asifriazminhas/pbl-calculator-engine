import { GenericCox } from '../generic-cox';
import { DerivedFieldJson } from '../derived-field';
import { CovariateJson } from '../covariate';

export interface CoxJson extends GenericCox<CovariateJson, string> {
    derivedFields: Array<DerivedFieldJson>;
    //TODO Implement this
    causeDeletedRef: any;
}
