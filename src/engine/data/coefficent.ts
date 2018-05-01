import * as moment from 'moment';
import { Covariate } from '../data-field/covariate/covariate';

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
): number | undefined {
    if (coefficent instanceof moment || coefficent instanceof Date) {
        throw new Error(`Coefficent is not a number ${covariate.name}`);
    } else if (
        coefficent === null ||
        coefficent === undefined ||
        coefficent === 'NA' ||
        isNaN(coefficent as number)
    ) {
        return covariate.referencePoint;
    } else {
        return Number(coefficent);
    }
}
