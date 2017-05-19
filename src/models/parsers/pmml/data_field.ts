import { parseCustomFunction } from './custom_functions/custom_function';
import { CustomPmmlXml } from './interfaces/custom/pmml';
import { CovariateJson } from '../json/fields/covariate';
import { InteractionCovariateType } from '../json/fields/interaction_covariate';

function isInteractionCovariate(name: string): boolean {
    return name.indexOf('_int') > -1;
}

function getCovariateType(name: string): string {
    if(isInteractionCovariate(name)) {
        return InteractionCovariateType
    }
    else {
        return '';
    }
}

/**
 * Parses all the Explanatory predictors from the provided PMML file
 * 
 * @export
 * @param {CustomPmmlXml} pmml
 * @returns {Array<ExplanatoryPredictor>}
 */
export function parseDataFields(pmml: CustomPmmlXml): Array<CovariateJson> {
    //Go through all the paramaters since they are the predictors which are actually used in the algorithm
    return pmml.PMML.GeneralRegressionModel.CovariateList.Predictor
        .map((predictor) => {
            //get the dat field for this paramater.It will gave the optype of this predictor
            const dataFieldForCurrentPredictor = pmml.PMML.DataDictionary.DataField
                .find((dataField) => {
                    return dataField.$.name === predictor.$.name;
                });

            const parameterForCurrentPredictor = pmml.PMML.GeneralRegressionModel.ParameterList
                .Parameter
                .find(parameter => parameter.$.label === predictor.$.name);
            if(!parameterForCurrentPredictor) {
                throw new Error(`No Parameter found for predictor with name ${predictor.$.name}`);
            }
            
            //If we did not find one then we have a problem
            if(dataFieldForCurrentPredictor === undefined) {
                throw new Error(`No DataField node found for predictor with name ${predictor.$.name}`);
            }

            //Get the pCell for this parameter. It will have beta
            const pCellForCurrentParamater = pmml.PMML.GeneralRegressionModel.ParamMatrix.PCell
                .find((pCell) => {
                    return pCell.$.parameterName === parameterForCurrentPredictor.$.name;
                });
            
            //if we did not find a pCell then we have a problem
            if(pCellForCurrentParamater === undefined) {
                throw new Error(`No PCell node found for predictor with name ${predictor.$.name}`);
            }

            return {
                type: getCovariateType(predictor.$.name),
                name: predictor.$.name,
                beta: Number(pCellForCurrentParamater.$.beta),
                referencePoint: Number(parameterForCurrentPredictor.$.referencePoint),
                customFunction: parseCustomFunction(parameterForCurrentPredictor, pmml.PMML.CustomPMML.RestrictedCubicSpline)
            };
        })
}