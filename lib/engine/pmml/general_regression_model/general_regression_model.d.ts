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
        baselineHazard: string;
        modelType: GeneralRegressionModelType;
    };
}
export declare function mergeGeneralRegressionModel(generalRegressionModelOne: IGeneralRegressionModel, generalRegressionModelTwo: IGeneralRegressionModel): IGeneralRegressionModel;
