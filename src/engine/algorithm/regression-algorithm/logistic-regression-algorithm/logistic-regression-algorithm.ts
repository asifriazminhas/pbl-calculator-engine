import { RegressionAlgorithm } from '../regression-algorithm';
import { Data } from '../../../data/data';
import { FileReport } from '../../algorithm';

export class LogsiticRegressionAlgorithm extends RegressionAlgorithm {

    public getHeaderReport (headers: string[]): FileReport {
        return {
            valid: headers,
            errors: headers,
            warnings: headers,
            ignored: headers
        };
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
