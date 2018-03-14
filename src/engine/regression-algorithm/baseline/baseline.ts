import { Data, findDatumWithName } from '../../data/data';
import { throwErrorIfUndefined } from '../../undefined/undefined';
import { NoBaselineFoundForAge } from '../../errors/no-baseline-hazard-found';

/**
 * Mixin to add for a regression algorithm with a baseline value
 *
 * @export
 * @interface IBaselineMixin
 */
export interface IBaselineMixin {
    /**
     * The value of the baseline. If it's an object then it implies that this
     * baseline is dependent on the age of the individual
     *
     * @type {(number | { [index: number]: number | undefined;})}
     * @memberof IBaselineMixin
     */
    baseline:
        | number
        | {
              [index: number]: number | undefined;
          };
}

/**
 * Returns the value of baseline to use for the given Data argument
 *
 * @export
 * @param {IBaselineMixin} { baseline }
 * @param {Data} data
 * @returns {number}
 */
export function getBaselineForData(
    { baseline }: IBaselineMixin,
    data: Data,
): number {
    /* If it's a number then it's not a function of the age datum in the data argument so return it */
    if (typeof baseline === 'number') {
        return baseline;
    } else {
        // Get the age datum
        const ageDatum = findDatumWithName('age', data);

        // Get the baseline value for this age value. If it doesn't exist then
        // throw an error
        return throwErrorIfUndefined(
            baseline[Number(ageDatum.coefficent)],
            new NoBaselineFoundForAge(ageDatum.coefficent as number),
        );
    }
}
