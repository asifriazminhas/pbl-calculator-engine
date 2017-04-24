import { ICustomFunction, CustomFunction } from '../../custom_functions/custom_function';
import RcsCustomFunction, { GenericRcsCustomFunction } from '../../custom_functions/rcs_spline';
import DataField from '../../predictors/explanatory_predictor';
import Field from '../../predictors/predictor';
import { JsonParseError } from '../../errors';

export interface RcsCustomFunctionJson extends GenericRcsCustomFunction<string> {

}

export function constructFromICustomFunction(customFunction: ICustomFunction, dataFields: Array<DataField>): CustomFunction {
    if(customFunction.type === 'RcsCustomFunction') {
        const rcsCustomFunction = customFunction as RcsCustomFunctionJson;

        const firstVariableDataField = dataFields
            .find(Field.findPredictorWithName(rcsCustomFunction.firstVariablePredictor));

        if(!firstVariableDataField) {
            throw JsonParseError(`No first variable predictor found with name ${rcsCustomFunction.firstVariablePredictor}`)
        }

        return Object.setPrototypeOf(Object.assign({}, rcsCustomFunction, {
            firstVariablePredictor: firstVariableDataField
        }) as GenericRcsCustomFunction<DataField>, RcsCustomFunction.prototype);
    }
    else {
        throw JsonParseError(`Unknown custom function type ${customFunction.type}`);
    }
}