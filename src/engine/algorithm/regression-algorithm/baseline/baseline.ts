import { BaselineJson } from '../../../../parsers/json/json-baseline';
import { sortedIndexBy } from 'lodash';

export class Baseline {
    private baseline: number | Array<{ time: number; baselineHazard: number }>; // time is in days

    constructor(baselineJson: BaselineJson) {
        if (baselineJson === null || baselineJson === undefined) {
            this.baseline = 1;
        } else if (typeof baselineJson === 'number') {
            this.baseline = baselineJson;
        } else {
            this.baseline = baselineJson;
        }
    }

    getBaselineHazard(timeInDays: number): number {
        /* If it's a number then it's not a function of the age datum in the data argument so return it */
        if (typeof this.baseline === 'number') {
            return this.baseline;
        } else {
            const closestTimeIndex = sortedIndexBy(
                this.baseline,
                {
                    time: timeInDays,
                    baselineHazard: 1,
                },
                baselineObj => {
                    return baselineObj.time;
                },
            );

            return this.baseline[closestTimeIndex].baselineHazard;
        }
    }
}
