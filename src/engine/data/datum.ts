import {} from '../cox/covariate';
import { Coefficent } from './coefficent';
import { IBaseCovariate } from '../covariate';

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
    covariate: IBaseCovariate,
): IDatum {
    return {
        coefficent: covariate.referencePoint,
        name: covariate.name,
    };
}
