import * as moment from 'moment';
import { Covariate } from '../covariate';

export type Coefficent =
    | string
    | number
    | moment.Moment
    | Date
    | null
    | undefined;

export function formatCoefficentForComponent(
    coefficent: Coefficent,
    covariate: Covariate,
): number {
    if (
        coefficent === null ||
        coefficent === undefined ||
        coefficent === 'NA'
    ) {
        return covariate.referencePoint;
    } else if (
        coefficent instanceof moment ||
        coefficent instanceof Date ||
        isNaN(Number(coefficent))
    ) {
        throw new Error(`Coefficent is not a number ${covariate.name}`);
    } else {
        return Number(coefficent);
    }
}
