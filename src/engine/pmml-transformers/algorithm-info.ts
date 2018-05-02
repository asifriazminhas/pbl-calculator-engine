import { GeneralRegressionModelType } from '../pmml/general_regression_model/general_regression_model';
import { TimeMetric } from '../algorithm/regression-algorithm/cox-survival-algorithm/time-metric';

export interface IAlgorithmInfoCsvRow {
    AlgorithmName: string;
    GenderSpecific: 'true' | 'false';
    BaselineHazard: string;
    RegressionType: GeneralRegressionModelType;
    TimeMetric: TimeMetric;
    MaximumTime: string;
}

export type AlgorithmInfoCsv = IAlgorithmInfoCsvRow[];
