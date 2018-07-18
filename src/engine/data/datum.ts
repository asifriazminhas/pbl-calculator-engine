// import {} from '../cox/covariate';
import { Coefficent } from './coefficent';
import { Covariate } from '../data-field/covariate/covariate';
export interface IDatum {
    name: string;
    coefficent: Coefficent;
}

export function datumFactory(name: string, coefficent: Coefficent): IDatum {
    return {
        coefficent,
        name,
    };
}

export function datumFromCovariateReferencePointFactory(
    covariate: Covariate,
): IDatum {
    return {
        coefficent: covariate.referencePoint,
        name: covariate.name,
    };
}
