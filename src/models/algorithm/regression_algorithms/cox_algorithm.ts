import { RegressionAlgorithm } from './regression_algorithm';
import { Datum } from '../../data/datum';
import { env } from '../../env/env';

export class CoxAlgorithm extends RegressionAlgorithm {
    //Returns survival
    evaluate(data: Array<Datum>): number {
        if (env.shouldLogDebugInfo() === true) {
            console.groupCollapsed(`Predictors`)
        }

        if (env.shouldLogDebugInfo()) {
            console.log(`Baseline Hazard: ${this.baselineHazard}`);
        }

        if (env.shouldLogDebugInfo() === true) {
            console.groupEnd();
        }

        const score = this.calculateScore(data);

        return 1 - Math.pow(
            Math.E,
            -1 * this.baselineHazard * Math.pow(Math.E, score)
        );
    }
}
