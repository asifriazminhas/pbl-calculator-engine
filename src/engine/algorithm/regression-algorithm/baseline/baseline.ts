import { Data, findDatumWithName } from '../../../data';
import { throwErrorIfUndefined } from '../../../../util/undefined';
import { NoBaselineFoundForAge } from '../../../errors';
import { BaselineJson } from '../../../../parsers/json/json-baseline';

export class Baseline {
    private baseline:
        | number
        | {
              [index: number]: number | undefined;
          };

    constructor(baselineJson: BaselineJson) {
        if (baselineJson === null || baselineJson === undefined) {
            this.baseline = 1;
        } else if (typeof baselineJson === 'number') {
            this.baseline = baselineJson;
        } else {
            this.baseline = baselineJson.reduce(
                (
                    baseline: {
                        [index: number]: number;
                    },
                    currentBaselineJsonItem,
                ) => {
                    baseline[currentBaselineJsonItem.age] =
                        currentBaselineJsonItem.baseline;

                    return baseline;
                },
                {},
            );
        }
    }

    getBaselineForData(data: Data): number {
        /* If it's a number then it's not a function of the age datum in the data argument so return it */
        if (typeof this.baseline === 'number') {
            return this.baseline;
        } else {
            // Get the age datum
            const ageDatum = findDatumWithName('DHHGAGE', data);

            // Get the baseline value for this age value. If it doesn't exist then
            // throw an error
            return throwErrorIfUndefined(
                this.baseline[Number(ageDatum.coefficent)],
                new NoBaselineFoundForAge(ageDatum.coefficent as number),
            );
        }
    }
}
