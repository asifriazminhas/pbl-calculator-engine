import { GenericAlgorithm, GenericDataFields } from '../../common';
import { CovariateJson, parseCovariate } from './data_fields/covariate';
import { DerivedFieldJson } from './data_fields/derived_field';
import { Algorithm, IAlgorithm } from '../../algorithm/algorithm';
import { DataField } from '../../algorithm/data_fields/data_field';
import { DerivedField } from '../../algorithm/data_fields/derived_field';
import { Covariate } from '../../algorithm/data_fields/covariate';

export interface AlgorithmJson extends GenericAlgorithm<
    string | GenericDataFields
> {
    localTransformations: Array<DerivedFieldJson>;
    covariates: Array<CovariateJson>;
}

/**
 * Checks if the passed data field name is in the covariates array
 * 
 * @export
 * @param {AlgorithmJson} algorithm 
 * @param {string} dataFieldName 
 * @returns {boolean} 
 */
export function isACovariate(
    algorithm: AlgorithmJson,
    dataFieldName: string
): boolean {
    return algorithm
        .covariates
        .find(covariate => covariate.name === dataFieldName) ? true : false;
}

function filterUnparsedDerivedFields(
    localTransformations: Array<DerivedFieldJson>,
    parsedDerivedFields: Array<DerivedField>
) {
    return localTransformations
        .filter((localTransform) => {
            return parsedDerivedFields
                .find((parsedDerivedField) => {
                    return parsedDerivedField.name === localTransform.name;
                }) ? false : true;
        })
}

function checkForUnusedLocalTransformations(
    algorithm: AlgorithmJson,
    parsedDerivedFields: Array<DerivedField>
) {
    filterUnparsedDerivedFields(
        algorithm.localTransformations,
        parsedDerivedFields
    )
    .map((danglingDerivedField) => {
        console.log(
            `DerivedField ${danglingDerivedField.name} is not used anywhere`
        );
    })
    .forEach(() => {
        throw new Error(`DerivedFields mentioned above are not used anywhere`);
    })
}
/**
 * Takes an algorithm json and returns an Algorithm object
 * 
 * @export
 * @param {AlgorithmJson} algorithm 
 * @returns {Algorithm} 
 */
export function parseFromAlgorithmJson(algorithm: AlgorithmJson): Algorithm {
    //All the DataFields (ones which are not covariates or derived fields)
    const parsedDataFields: Array<DataField> = [];
    const parsedDerivedFields: Array<DerivedField> = [];
    const parsedCovariates: Array<Covariate> = [];
    
    const covariates = algorithm
        .covariates
        .map((covariate) => {
            return parseCovariate(covariate, algorithm, parsedCovariates, parsedDerivedFields, parsedDataFields)
        });
    
    const parsedAlgorithm : IAlgorithm = Object.assign({}, algorithm, {
        localTransformations: covariates
            .filter(covariate => covariate.derivedField)
            .map(covariateWithDerivedField => covariateWithDerivedField.derivedField as DerivedField),
        covariates
    });

    checkForUnusedLocalTransformations(algorithm, parsedDerivedFields);

    return Object.setPrototypeOf(parsedAlgorithm, Algorithm.prototype);
}