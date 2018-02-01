import { GeneralRegressionModelType } from '../pmml/general_regression_model/general_regression_model';

export interface IAlgorithmInfoCsvRow {
    AlgorithmName: string;
    GenderSpecific: 'true' | 'false';
    BaselineHazard: string;
    RegressionType: GeneralRegressionModelType;
}

export type AlgorithmInfoCsv = IAlgorithmInfoCsvRow[];
