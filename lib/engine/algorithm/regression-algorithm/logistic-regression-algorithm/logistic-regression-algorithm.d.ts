import { RegressionAlgorithm } from '../regression-algorithm';
import { Data } from '../../../data/data';
import { DataNameReport } from '../../algorithm';
export declare class LogsiticRegressionAlgorithm extends RegressionAlgorithm {
    buildDataNameReport(): DataNameReport;
    getRisk(data: Data): number;
    evaluate(data: Data): number;
}
