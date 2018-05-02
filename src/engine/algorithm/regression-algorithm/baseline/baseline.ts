import { Data, findDatumWithName } from '../../../data';
import { throwErrorIfUndefined } from '../../../undefined';
import { NoBaselineFoundForAge } from '../../../errors';
import { BaselineJson } from '../../../../parsers/json/json-baseline';

export class Baseline {
    private baseline:
        | number
        | {
              [index: number]: number | undefined;
          };

    constructor(baselineJson: BaselineJson) {
        this.baseline = baselineJson;
    }

    getBaselineForData(data: Data): number {
        /* If it's a number then it's not a function of the age datum in the data argument so return it */
        if (typeof this.baseline === 'number') {
            return this.baseline;
        } else {
            // Get the age datum
            const ageDatum = findDatumWithName('age', data);

            // Get the baseline value for this age value. If it doesn't exist then
            // throw an error
            return throwErrorIfUndefined(
                this.baseline[Number(ageDatum.coefficent)],
                new NoBaselineFoundForAge(ageDatum.coefficent as number),
            );
        }
    }
}
