import { RegressionAlgorithm } from '../regression-algorithm';
import { Data } from '../../../data/data';

export class LogsiticRegressionAlgorithm extends RegressionAlgorithm {
    getRisk(data: Data) {
        return this.evaluate(data);
    }

    evaluate(data: Data) {
        const logit = this.calculateScore(data);
        const elogit = Math.exp(logit);

        return elogit / (1 + elogit);
    }
}
