import { RegressionAlgorithm } from './regression_algorithm';
import { Datum } from '../../data/datum';
import { env } from '../../env/env';

export class LogisticRegressionAlgorithm extends RegressionAlgorithm {
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
        const logit = this.baselineHazard + score;
        const elogit = Math.exp(logit);

        return elogit / (1 + elogit);
    }
}