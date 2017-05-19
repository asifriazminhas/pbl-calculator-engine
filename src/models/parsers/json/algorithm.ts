import { GenericAlgorithm } from '../../common';
import { CovariateJson, parseCovariate } from './fields/covariate';
import { DerivedFieldJson, parseDerivedField } from './fields/derived_field';
import { Algorithm, IAlgorithm } from '../../algorithm';
import { DataField } from '../../fields/data_field';
import { DerivedField } from '../../fields/derived_field';
import { Covariate } from '../../fields/covariate';
import * as _ from 'lodash';

export interface AlgorithmJson extends GenericAlgorithm<string> {
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
export function isACovariate(algorithm: AlgorithmJson, dataFieldName: string): boolean {
    return algorithm
        .covariates
        .find(covariate => covariate.name === dataFieldName) ? true : false;
}

/**
 * Checks if the passed data field name is in the localTransformations array
 * 
 * @param {AlgorithmJson} algorithm 
 * @param {string} dataFieldName 
 * @returns 
 */
function isADerivedField(algorithm: AlgorithmJson, dataFieldName: string) {
    return algorithm
        .localTransformations
        .find(derivedField => derivedField.name === dataFieldName) ? true : false;
}

/**
 * Goes through all the derivedFrom arrays in DerivedFields and returns all those derivedFrom items which do not depend on anything as a DataField object (Covariates are not returned as DataField). For example in the tree of local transformations everything at the very bottom of the tree that does not connect to anything is returned as a DataField
 * 
 * @param {AlgorithmJson} algorithm 
 * @returns {Array<DataField>} 
 */
function getDataFieldsFromDerivedFields(algorithm: AlgorithmJson): Array<DataField> {
    return _.flatten(
        //Get the array of all the derivedFrom items
        algorithm
            .localTransformations
            .map((derivedField) => derivedField.derivedFrom)
        )
        //Remove duplicates
        .filter((derivedFromItem, index, derivedFrom) => {
            return derivedFrom.indexOf(derivedFromItem) === index
        })
        //Remove ones which are a covariate or a derivedField
        .filter((derivedFromItem) => {
            return !(isACovariate(algorithm, derivedFromItem) || isADerivedField(algorithm, derivedFromItem))
        })
        //Map them to a DataField
        .map((dataFieldName) => {
            return Object.setPrototypeOf({
                name: dataFieldName
            }, DataField.prototype)
        });
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
    const parsedDataFields: Array<DataField> = getDataFieldsFromDerivedFields(algorithm);
    const parsedDerivedFields: Array<DerivedField> = [];
    const parsedCovariates: Array<Covariate> = [];
    
    const parsedAlgorithm : IAlgorithm = Object.assign({}, algorithm, {
        localTransformations: algorithm
            .localTransformations
            .map((derivedField) => {
                return parseDerivedField(derivedField, algorithm, parsedCovariates, parsedDerivedFields, parsedDataFields)
            }),
        covariates: algorithm
            .covariates
            .map((covariate) => {
                return parseCovariate(covariate, algorithm, parsedCovariates, parsedDerivedFields, parsedDataFields)
            })
    });

    return Object.setPrototypeOf(parsedAlgorithm, Algorithm.prototype);
}