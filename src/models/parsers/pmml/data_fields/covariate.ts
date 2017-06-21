import { parseCustomFunction } from './custom_functions/custom_function';
import { RcsCustomFunctionJson } from '../../json/data_fields/custom_functions/rcs_custom_function';
import { Pmml, IDataField, IParameter, IPCell, IPredictor } from '../../../pmml';
import { CovariateJson } from '../../json/data_fields/covariate';
import { InteractionCovariateType } from '../../json/data_fields/interaction_covariate';
import { parseDataFieldFromDataFieldPmmlNode } from './data_field';
import { parseExtensions } from '../extensions';
import { throwErrorIfUndefined } from '../../../common/undefined';
import { NoDataFieldNodeFound, NoParameterNodeFoundWithLabel, NoPCellNodeFoundWithParameterName } from '../errors';

/**
 * 
 * @param {string} name 
 * @returns {boolean} 
 */
function isCovariateWithNameAnInteractionCovariate(covariateName: string): boolean {
    return covariateName.indexOf('_int') > -1;
}

/**
 * Returns a string representing the type of covariate. Covariate types are:
 * Interaction
 * 
 * @param {string} name 
 * @returns {string} 
 */
function getCovariateType(name: string): string {
    if (isCovariateWithNameAnInteractionCovariate(name)) {
        return InteractionCovariateType
    }
    else {
        return '';
    }
}

/**
 * Returns the covariate json object for the passed predictor arg
 * 
 * @param {Predictor} predictor 
 * @param {DataField} dataField DataField node whose name field matches with the predictor's name field
 * @param {Parameter} parameter Parameter node whose label field matches with the predictor's name field
 * @param {PCell} pCell PCell node whose parameterName field matches with the parameter's name field
 * @param {(RcsCustomFunctionJson | null)} customFunctionJson The custom function is any for this covariate
 * @returns {CovariateJson} 
 */
function parseCovariateFromPredictor(
    predictor: IPredictor,
    dataField: IDataField,
    parameter: IParameter,
    pCell: IPCell,
    customFunctionJson: RcsCustomFunctionJson | null
): CovariateJson {
    return Object.assign(
        {},
        parseDataFieldFromDataFieldPmmlNode(dataField), {
            type: getCovariateType(predictor.$.name),
            name: predictor.$.name,
            beta: Number(pCell.$.beta),
            referencePoint: Number(parameter.$.referencePoint),
            customFunction: customFunctionJson,
            extensions: parseExtensions(dataField)
        }
    );
}


/**
 * Returns all the JSON covariate objects in the pmml argument
 * 
 * @export
 * @param {CustomPmmlXml} pmml 
 * @returns {Array<CovariateJson>} 
 */
export function parseCovariates(pmml: Pmml): Array<CovariateJson> {
    //Each Predictor Node in the CovariateList node is a covariate
    return pmml.pmmlXml.PMML.GeneralRegressionModel.CovariateList.Predictor
        .map((predictor) => {
            //DataField whose name field is the same as the predictor's name field. Problem if we don't find one. Need it for the following fields: name, displayName, opType, recommended extension anf question extension
            const dataFieldForCurrentPredictor = throwErrorIfUndefined(
                pmml.findDataFieldWithName(predictor.$.name),
                NoDataFieldNodeFound(predictor.$.name)
            );

            //Paramter whose label field is the same as the predictor's name field. Problem if we don't find one. Need it for the referencePoint
            const parameterForCurrentPredictor = throwErrorIfUndefined(
                pmml.findParameterWithLabel(predictor.$.name),
                NoParameterNodeFoundWithLabel(predictor.$.name)
            );

            //PCell whose parameterName field is the same as the predictor's name field. Problem if we dont find one. Need it for the beta
            const pCellForCurrentParamater = throwErrorIfUndefined(
                pmml.findPCellWithParameterName(
                    parameterForCurrentPredictor.$.name
                ),
                NoPCellNodeFoundWithParameterName(
                    parameterForCurrentPredictor.$.name
                )
            );

            //Using the DataField, Parameter, Predictor, PCell get the CovariateJson
            return parseCovariateFromPredictor(
                predictor,
                dataFieldForCurrentPredictor,
                parameterForCurrentPredictor,
                pCellForCurrentParamater,
                parseCustomFunction(
                    parameterForCurrentPredictor,
                    pmml.pmmlXml.PMML.CustomPMML.RestrictedCubicSpline
                )
            );
        });
}