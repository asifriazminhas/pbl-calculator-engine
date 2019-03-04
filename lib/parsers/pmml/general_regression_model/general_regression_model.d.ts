import { IParameter } from './parameter';
import { IPCell } from './p_cell';
import { IPredictor } from './predictor';
export declare const CoxRegressionModelType = "CoxRegression";
export declare const LogisticRegressionModelType = "logisticRegression";
export declare type GeneralRegressionModelType = typeof CoxRegressionModelType | typeof LogisticRegressionModelType;
export interface IGeneralRegressionModel {
    ParameterList: {
        Parameter: Array<IParameter>;
    };
    ParamMatrix: {
        PCell: Array<IPCell>;
    };
    CovariateList: {
        Predictor: Array<IPredictor>;
    };
    $: {
        [index: string]: string;
        baselineHazard: string;
        modelType: GeneralRegressionModelType;
    };
    Extension: [GeneralRegressionModelExtensions, GeneralRegressionModelExtensions];
}
export declare function mergeGeneralRegressionModel(generalRegressionModelOne?: IGeneralRegressionModel, generalRegressionModelTwo?: IGeneralRegressionModel): IGeneralRegressionModel | undefined;
interface IMaximumTimeExtension {
    name: 'maximumTime';
    value: string;
}
interface ITimeMetricExtension {
    name: 'timeMetric';
    value: 'days' | 'years';
}
declare type GeneralRegressionModelExtensions = IMaximumTimeExtension | ITimeMetricExtension;
export {};
