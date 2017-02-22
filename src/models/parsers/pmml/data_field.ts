import { parseCustomFunction } from './custom_function/custom_function';
import { CustomPmml } from './interfaces/custom/pmml';
import ExplanatoryPredictor from '../../predictors/explanatory_predictor';

/**
 * Parses all the Explanatory predictors from the provided PMML file
 * 
 * @export
 * @param {CustomPmml} pmml
 * @returns {Array<ExplanatoryPredictor>}
 */
export function parseDataFields(pmml: CustomPmml): Array<ExplanatoryPredictor> {
    //Go through all the paramaters since they are the predictors which are actually used in the algorithm
    return pmml.PMML.GeneralRegressionModel.ParameterList.Parameter
        .map((parameter) => {
            //get the dat field for this paramater.It will gave the optype of this predictor
            const dataFieldForCurrentParamater = pmml.PMML.DataDictionary.DataField
                .find((dataField) => {
                    return dataField.$.name === parameter.$.label;
                });
            
            //If we did not find one then we have a problem
            if(dataFieldForCurrentParamater === undefined) {
                throw new Error(`No DataField node found for paramater with label ${parameter.$.label}`);
            }

            //Get the pCell for this parameter. It will have beta
            const pCellForCurrentParamater = pmml.PMML.GeneralRegressionModel.ParamMatrix.PCell
                .find((pCell) => {
                    return pCell.$.parameterName === parameter.$.name;
                });
            
            //if we did not find a pCell then we have a problem
            if(pCellForCurrentParamater === undefined) {
                throw new Error(`No PCell node found for parameter with name ${parameter.$.name}`);
            }

            //Construct and return the explanatory predictor
            return new ExplanatoryPredictor().constructFromPmml(parameter.$.label, dataFieldForCurrentParamater.$.optype, pCellForCurrentParamater.$.beta, parameter.$.referencePoint, parseCustomFunction(parameter, pmml.CustomPMML.RestrictedCubicSpline))
        })
}