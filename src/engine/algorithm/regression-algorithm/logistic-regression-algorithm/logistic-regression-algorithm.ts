import { RegressionAlgorithm } from '../regression-algorithm';
import { Data } from '../../../data/data';
import { DataNameReport } from '../../algorithm';

export class LogsiticRegressionAlgorithm extends RegressionAlgorithm {

    public buildDataNameReport (headers: string[]): DataNameReport {
        throw new Error(this.buildDataNameReport.name + ' is not implemented');
    }

    getRisk(data: Data) {
        return this.evaluate(data);
    }

    evaluate(data: Data) {
        const logit = this.calculateScore(data);
        const elogit = Math.exp(logit);

        return elogit / (1 + elogit);
    }
}
