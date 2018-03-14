import { GeneralRegressionModelType } from '../pmml/general_regression_model/general_regression_model';
import { TimeMetric } from '../cox/time-metric';
export interface IAlgorithmInfoCsvRow {
    AlgorithmName: string;
    GenderSpecific: 'true' | 'false';
    BaselineHazard: string;
    RegressionType: GeneralRegressionModelType;
    TimeMetric: TimeMetric;
    MaximumTime: string;
}
export declare type AlgorithmInfoCsv = IAlgorithmInfoCsvRow[];
