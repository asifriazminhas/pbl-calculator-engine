import { Coefficent } from './coefficent';
import { Covariate } from '../data-field/covariate/covariate';
import { DataField } from '../data-field/data-field';
export interface IDatum {
    name: string;
    coefficent: Coefficent;
}

export function datumFromCovariateReferencePointFactory(
    covariate: Covariate,
): IDatum {
    return {
        coefficent: covariate.referencePoint,
        name: covariate.name,
    };
}

/**
 * Returns a new Datum object where the name matches with that of the
 * dataField arg and the coefficient arg has been checked if it's within the
 * acceptable bounds. If it isn't then we set it's value to either the lower or
 * upper bound
 *
 * @export
 * @param {DataField} dataField
 * @param {Coefficent} coefficient
 * @returns {IDatum}
 */
export function datumFactoryFromDataField(
    dataField: DataField,
    coefficient: Coefficent,
): IDatum {
    // Find an interval where the num is within it's bounds
    const validatedInterval =
        typeof coefficient === 'number' &&
        dataField.intervals &&
        dataField.intervals.find(interval => {
            return interval.validate(coefficient);
        });

    return {
        name: dataField.name,
        coefficent:
            dataField.intervals && validatedInterval === undefined
                ? dataField.intervals[0].limitNumber(coefficient as number)
                : coefficient,
    };
}
