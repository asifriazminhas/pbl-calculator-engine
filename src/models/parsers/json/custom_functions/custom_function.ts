import { RcsCustomFunctionJson, parseRcsCustomFunctionJson } from './rcs_custom_function';
import { AlgorithmJson } from '../algorithm';
import { DerivedField } from '../../../fields/derived_field';
import { DataField } from '../../../fields/data_field';
import { Covariate } from '../../../fields/covariate';
import { CustomFunction } from '../../../custom_functions/custom_function';

export type CustomFunctionJson = RcsCustomFunctionJson;

export function parseCustomFunction(customFunction: CustomFunctionJson, algorithm: AlgorithmJson, parsedCovariates: Array<Covariate>, parsedDerivedFields: Array<DerivedField>, parsedDataFields: Array<DataField>): CustomFunction {
    if(customFunction.type === 'rcs') {
        return parseRcsCustomFunctionJson(customFunction, algorithm, parsedCovariates, parsedDerivedFields, parsedDataFields);
    }
    else {
        throw new Error(`Unknown custom function type ${customFunction.type}`);
    }
}