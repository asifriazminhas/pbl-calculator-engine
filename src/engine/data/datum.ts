import { Covariate } from '../cox/covariate';
import { Coefficent } from './coefficent';

export interface Datum {
    name: string;
    coefficent: Coefficent;
}

export type Data = Array<Datum>;

export function datumFactory(
    name: string,
    coefficent: Coefficent
): Datum {
    return {
        name,
        coefficent
    };
}

export function datumFromCovariateReferencePointFactory(
    covariate: Covariate
): Datum {
    return {
        name: covariate.name,
        coefficent: covariate.referencePoint
    }
}