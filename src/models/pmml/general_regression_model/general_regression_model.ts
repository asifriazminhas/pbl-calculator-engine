import { IParameter } from './parameter';
import { IPCell } from './p_cell';
import { IPredictor } from './predictor';

export interface IGeneralRegressionModel {
    //The nodes inside this nodes is what should be used to as the list of pedictors a certain algorithm needs
    ParameterList: {
        Parameter: Array<IParameter>
    };
    ParamMatrix: {
        PCell: Array<IPCell>
    };
    CovariateList: {
        Predictor: Array<IPredictor>
    };
    $: {
        baselineHazard: string
    }
}

export function mergeGeneralRegressionModel(
    generalRegressionModelOne: IGeneralRegressionModel,
    generalRegressionModelTwo: IGeneralRegressionModel
): IGeneralRegressionModel {
    return Object.assign(
        {},
        generalRegressionModelOne,
        generalRegressionModelTwo
    );
}