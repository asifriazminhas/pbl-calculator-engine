import { GenericRcsCustomFunction } from '../../../common';
import { RcsCustomFunction, IRcsCustomFunction } from '../../../custom_functions/rcs_custom_function';
import { AlgorithmJson } from '../algorithm';
import { CovariateJson, parseCovariate } from '../fields/covariate';
import { Covariate } from '../../../fields/covariate';
import { DerivedField } from '../../../fields/derived_field';
import { DataField } from '../../../fields/data_field';

export interface RcsCustomFunctionJson extends GenericRcsCustomFunction<string> {
    type: 'rcs'
}

export function parseRcsCustomFunctionJson(customFunction: RcsCustomFunctionJson, algorithm: AlgorithmJson, parsedCovariates: Array<Covariate>, parsedDerivedFields: Array<DerivedField>, parsedDataFields: Array<DataField>): RcsCustomFunction {
    const foundFirstVariableCovariate = algorithm
        .covariates
        .find(covariate => covariate.name === customFunction.firstVariableCovariate);
    
    const rcsCustomFunction: IRcsCustomFunction = Object.assign({}, customFunction, {
        firstVariableCovariate: parseCovariate(foundFirstVariableCovariate as CovariateJson, algorithm, parsedCovariates, parsedDerivedFields, parsedDataFields)
    });

    return Object.setPrototypeOf(rcsCustomFunction, RcsCustomFunction.prototype);
}