import { CustomFunctionJson, parseCustomFunction } from './custom_functions/custom_function';
import { GenericCovariate, GenericCategoricalField, GenericContinuousField  } from '../../../common';
import { AlgorithmJson } from '../algorithm';
import { DerivedField } from '../../../algorithm/data_fields/derived_field';
import { Covariate, ICovariate, CategoricalCovariate, ContinuousCovariate } from '../../../algorithm/data_fields/covariate';
import { DataField } from '../../../algorithm/data_fields/data_field';
import { parseDerivedField } from './derived_field';
import { InteractionCovariate, CategoricalInteractionCovariate, ContinuousInteractionCovariate } from '../../../algorithm/data_fields/interaction_covariate';
import { isInteractionCovariate } from './interaction_covariate';
import { setFieldPrototypeToBaseOrCategoricalOrContinuous } from '../optype';

export interface CovariateJson extends GenericCovariate {
    type: string;

    customFunction: CustomFunctionJson | null;
}

export interface CategoricalCovariateJson extends CovariateJson, GenericCategoricalField {}
export interface ContinuousCovariateJson extends CovariateJson, GenericContinuousField {}

/**
 * 
 * 
 * @export
 * @param {CovariateJson} covariate 
 * @param {AlgorithmJson} algorithm 
 * @param {Array<Covariate>} parsedCovariates 
 * @param {Array<DerivedField>} parsedDerivedFields 
 * @param {Array<DataField>} parsedDataFields 
 * @returns {Covariate} 
 */
export function parseCovariate(
    covariate: CovariateJson,
    algorithm: AlgorithmJson,
    parsedCovariates: Array<Covariate>,
    parsedDerivedFields: Array<DerivedField>,
    parsedDataFields: Array<DataField>
): Covariate {
    const foundParsedCovariate = parsedCovariates
        .find(parsedCovariate => parsedCovariate.name === covariate.name);
    if(foundParsedCovariate) {
        return foundParsedCovariate;
    }

    let parsedDerivedFieldForCovariate: DerivedField | null = null;

    //Check if this covariate has a derived field associated with it
    let derivedField = algorithm
        .localTransformations
        .find(derivedField => derivedField.name === covariate.name);
    //If it does then parse it to set it to the deirvedField field in the parsed covariate
    if(derivedField) {
        parsedDerivedFieldForCovariate = parseDerivedField(derivedField, algorithm, parsedCovariates, parsedDerivedFields, parsedDataFields);
    }

    const parsedCovariate: ICovariate = Object.assign({}, covariate, {
        derivedField: parsedDerivedFieldForCovariate,
        customFunction: covariate.customFunction ?
            parseCustomFunction(
                covariate.customFunction,
                algorithm,
                parsedCovariates,
                parsedDerivedFields,
                parsedDataFields
            ) : null
    });

    let parsedCovariateInstance = setFieldPrototypeToBaseOrCategoricalOrContinuous(
        parsedCovariate,
        Covariate,
        CategoricalCovariate,
        ContinuousCovariate
    );

    if(isInteractionCovariate(covariate)) {
        parsedCovariateInstance = setFieldPrototypeToBaseOrCategoricalOrContinuous(
            parsedCovariate,
            InteractionCovariate,
            CategoricalInteractionCovariate,
            ContinuousInteractionCovariate
        );
    }
    parsedCovariates.push(parsedCovariateInstance);

    return parsedCovariateInstance;
}
