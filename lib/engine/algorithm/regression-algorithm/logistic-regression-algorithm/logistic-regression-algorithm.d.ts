import { RegressionAlgorithm } from '../regression-algorithm';
import { Data } from '../../../data/data';
export declare class LogsiticRegressionAlgorithm extends RegressionAlgorithm {
    getRisk(data: Data): number;
    evaluate(data: Data): number;
}
