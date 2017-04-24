import { parseCustomFunction } from './custom_function/custom_function';
import { CustomPmmlXml } from './interfaces/custom/pmml';
import { IExplanatoryPredictor } from '../../predictors/explanatory_predictor';
import { getOpTypeFromPmmlOpType } from './op_type';

/**
 * Parses all the Explanatory predictors from the provided PMML file
 * 
 * @export
 * @param {CustomPmmlXml} pmml
 * @returns {Array<ExplanatoryPredictor>}
 */
export function parseDataFields(pmml: CustomPmmlXml): Array<IExplanatoryPredictor> {
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

            return {
                name: parameter.$.label,
                opType: getOpTypeFromPmmlOpType(dataFieldForCurrentParamater.$.optype),
                beta: Number(pCellForCurrentParamater.$.beta),
                referencePoint: Number(parameter.$.referencePoint),
                customFunction: parseCustomFunction(parameter, pmml.PMML.CustomPMML.RestrictedCubicSpline)
            };
        })
}