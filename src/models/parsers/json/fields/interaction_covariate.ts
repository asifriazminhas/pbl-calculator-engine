import { CovariateJson } from './covariate';
import { DerivedFieldJson } from './derived_field';

export const InteractionCovariateType = 'interaction';

export interface InteractionCovariateJson extends CovariateJson {
    type: 'interaction';
    derivedField: DerivedFieldJson;
}

export function isInteractionCovariate(covariateJson: CovariateJson): covariateJson is InteractionCovariateJson {
    return covariateJson.type === InteractionCovariateType;
}