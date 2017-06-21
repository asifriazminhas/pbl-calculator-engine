import * as moment from 'moment';
import { Covariate } from '../algorithm/data_fields/covariate';

export type DatumCoefficent = string | number | moment.Moment;

/**
 * The Datum object that has all the coefficents the engine needs to calculate it's value
 * 
 * @export
 * @interface Datum
 */
export interface Datum {
    name: string;
    coefficent: DatumCoefficent;
}

export function datumFactory(name: string, coefficent: DatumCoefficent): Datum {
    return {
        name,
        coefficent
    };
}

/**
 * Creates a Datum where the name field is set to the covariate's name field and it's coeffcient field is set to it's referencePoint field
 * 
 * @export
 * @param {Covariate} covariate 
 * @returns {Datum} 
 */
export function datumFromCovariateReferencePointFactory(covariate: Covariate): Datum {
    return {
        name: covariate.name,
        coefficent: covariate.referencePoint
    }
}