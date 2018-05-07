import { parseCustomFunction } from './custom_functions/custom_function';
import { ICovariateJson } from '../../../parsers/json/json-covariate';
import { IRcsCustomFunctionJson } from '../../../parsers/json/json-rcs-custom-function';
import { DataFieldType } from '../../../parsers/json/data-field-type';
import {
    Pmml,
    IDataField,
    IParameter,
    IPCell,
    IPredictor,
    IGeneralRegressionModel,
} from '../../pmml';
import { parseDataFieldFromDataFieldPmmlNode } from './data_field';
import { parseExtensions } from '../extensions';
import { throwErrorIfUndefined } from '../../../engine/undefined';
import {
    NoDataFieldNodeFound,
    NoParameterNodeFoundWithLabel,
    NoPCellNodeFoundWithParameterName,
} from '../errors';

/**
 * 
 * @param {string} name 
 * @returns {boolean} 
 */
function isCovariateWithNameAnInteractionCovariate(
    covariateName: string,
): boolean {
    return covariateName.indexOf('_int') > -1;
}

/**
 * Returns a string representing the type of covariate. Covariate types are:
 * Interaction
 * 
 * @param {string} name 
 * @returns {string} 
 */
function getCovariateType(
    name: string,
): DataFieldType.InteractionCovariate | DataFieldType.NonInteractionCovariate {
    if (isCovariateWithNameAnInteractionCovariate(name)) {
        return DataFieldType.InteractionCovariate;
    } else {
        return DataFieldType.NonInteractionCovariate;
    }
}

/**
 * Returns the covariate json object for the passed predictor arg
 * 
 * @param {Predictor} predictor 
 * @param {DataField} dataField DataField node whose name field matches with the predictor's name field
 * @param {Parameter} parameter Parameter node whose label field matches with the predictor's name field
 * @param {PCell} pCell PCell node whose parameterName field matches with the parameter's name field
 * @param {(IRcsCustomFunctionJson | null)} customFunctionJson The custom function is any for this covariate
 * @returns {CovariateJson} 
 */
function parseCovariateFromPredictor(
    predictor: IPredictor,
    dataField: IDataField,
    parameter: IParameter,
    pCell: IPCell,
    customFunctionJson: IRcsCustomFunctionJson | undefined,
): ICovariateJson {
    return Object.assign({}, parseDataFieldFromDataFieldPmmlNode(dataField), {
        dataFieldType: getCovariateType(
            predictor.$.name,
        ) as DataFieldType.NonInteractionCovariate,
        name: predictor.$.name,
        beta: Number(pCell.$.beta),
        referencePoint: Number(parameter.$.referencePoint),
        customFunction: customFunctionJson,
        extensions: parseExtensions(dataField),
    });
}

/**
 * Returns all the JSON covariate objects in the pmml argument
 * 
 * @export
 * @param {CustomPmmlXml} pmml 
 * @returns {Array<CovariateJson>} 
 */
export function parseCovariates(pmml: Pmml): Array<ICovariateJson> {
    //Each Predictor Node in the CovariateList node is a covariate
    return (pmml.pmmlXml.PMML
        .GeneralRegressionModel as IGeneralRegressionModel).CovariateList.Predictor.map(
        predictor => {
            //DataField whose name field is the same as the predictor's name field. Problem if we don't find one. Need it for the following fields: name, displayName, opType, recommended extension anf question extension
            const dataFieldForCurrentPredictor = throwErrorIfUndefined(
                pmml.findDataFieldWithName(predictor.$.name),
                NoDataFieldNodeFound(predictor.$.name),
            );

            //Paramter whose label field is the same as the predictor's name field. Problem if we don't find one. Need it for the referencePoint
            const parameterForCurrentPredictor = throwErrorIfUndefined(
                pmml.findParameterWithLabel(predictor.$.name),
                NoParameterNodeFoundWithLabel(predictor.$.name),
            );

            //PCell whose parameterName field is the same as the predictor's name field. Problem if we dont find one. Need it for the beta
            const pCellForCurrentParamater = throwErrorIfUndefined(
                pmml.findPCellWithParameterName(
                    parameterForCurrentPredictor.$.name,
                ),
                NoPCellNodeFoundWithParameterName(
                    parameterForCurrentPredictor.$.name,
                ),
            );

            //Using the DataField, Parameter, Predictor, PCell get the CovariateJson
            return parseCovariateFromPredictor(
                predictor,
                dataFieldForCurrentPredictor,
                parameterForCurrentPredictor,
                pCellForCurrentParamater,
                parseCustomFunction(
                    parameterForCurrentPredictor,
                    pmml.pmmlXml.PMML.CustomPMML.RestrictedCubicSpline,
                ),
            );
        },
    );
}
