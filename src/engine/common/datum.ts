import * as moment from 'moment';
import { Covariate } from '../cox/covariate';

export type Coefficent = string | number | moment.Moment | Date;

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