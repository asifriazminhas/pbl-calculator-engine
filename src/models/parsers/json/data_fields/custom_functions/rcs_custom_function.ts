import { GenericRcsCustomFunction } from '../../../../common';
import { RcsCustomFunction, IRcsCustomFunction } from '../../../../algorithm/data_fields/custom_functions/rcs_custom_function';
import { AlgorithmJson } from '../../algorithm';
import { CovariateJson, parseCovariate } from '../../data_fields/covariate';
import { Covariate } from '../../../../algorithm/data_fields/covariate';
import { DerivedField } from '../../../../algorithm/data_fields/derived_field';
import { DataField } from '../../../../algorithm/data_fields/data_field';

export interface RcsCustomFunctionJson extends GenericRcsCustomFunction<string> {
    type: 'rcs'
}

export function parseRcsCustomFunctionJson(
    customFunction: RcsCustomFunctionJson,
    algorithm: AlgorithmJson,
    parsedCovariates: Array<Covariate>,
    parsedDerivedFields: Array<DerivedField>,
    parsedDataFields: Array<DataField>
): RcsCustomFunction {
    const foundFirstVariableCovariate = algorithm
        .covariates
        .find(covariate => covariate.name === customFunction.firstVariableCovariate);
    
    const rcsCustomFunction: IRcsCustomFunction = Object.assign(
        {},
        customFunction,
        {
            firstVariableCovariate: parseCovariate(
                foundFirstVariableCovariate as CovariateJson,
                algorithm,
                parsedCovariates,
                parsedDerivedFields,
                parsedDataFields
            )
        }
    );

    return Object
        .setPrototypeOf(rcsCustomFunction, RcsCustomFunction.prototype);
}