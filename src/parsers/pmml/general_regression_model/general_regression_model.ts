import { IParameter } from './parameter';
import { IPCell } from './p_cell';
import { IPredictor } from './predictor';

export const CoxRegressionModelType = 'CoxRegression';
export const LogisticRegressionModelType = 'logisticRegression';
export type GeneralRegressionModelType =
    | typeof CoxRegressionModelType
    | typeof LogisticRegressionModelType;

export interface IGeneralRegressionModel {
    //The nodes inside this nodes is what should be used to as the list of pedictors a certain algorithm needs
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
}

export function mergeGeneralRegressionModel(
    generalRegressionModelOne?: IGeneralRegressionModel,
    generalRegressionModelTwo?: IGeneralRegressionModel,
): IGeneralRegressionModel | undefined {
    if (generalRegressionModelOne && generalRegressionModelTwo) {
        const mergedProps = Object.keys(generalRegressionModelOne.$).reduce(
            (currentMergedProps, currentProp) => {
                return Object.assign(currentMergedProps, {
                    [currentProp]:
                        generalRegressionModelTwo.$[currentProp] === '' ||
                        generalRegressionModelTwo.$[currentProp] === null ||
                        generalRegressionModelTwo.$[currentProp] === undefined
                            ? generalRegressionModelOne.$[currentProp]
                            : generalRegressionModelTwo.$[currentProp],
                });
            },
            {} as IGeneralRegressionModel['$'],
        );

        return Object.assign(
            {},
            generalRegressionModelOne,
            generalRegressionModelTwo,
            {
                $: mergedProps,
                ParameterList:
                    generalRegressionModelOne.ParameterList.Parameter.length ===
                    0
                        ? generalRegressionModelTwo.ParameterList
                        : generalRegressionModelOne.ParameterList,
                ParamMatrix:
                    generalRegressionModelOne.ParamMatrix.PCell.length === 0
                        ? generalRegressionModelTwo.ParamMatrix
                        : generalRegressionModelOne.ParamMatrix,
                CovariateList:
                    generalRegressionModelOne.CovariateList.Predictor.length ===
                    0
                        ? generalRegressionModelTwo.CovariateList
                        : generalRegressionModelOne.CovariateList,
            },
        );
    } else if (generalRegressionModelOne && !generalRegressionModelTwo) {
        return generalRegressionModelOne;
    } else if (!generalRegressionModelOne && generalRegressionModelTwo) {
        return generalRegressionModelTwo;
    } else {
        return undefined;
    }
}
