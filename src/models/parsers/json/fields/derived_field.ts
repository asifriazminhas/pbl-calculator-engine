import { GenericDerivedField } from '../../../common';
import { AlgorithmJson, isACovariate } from '../algorithm';
import { parseCovariate, CovariateJson } from './covariate';
import { DerivedField, IDerivedField } from '../../../fields/derived_field';
import { Covariate } from '../../../fields/covariate';
import { DataField } from '../../../fields/data_field';
import { DerivedFieldJson } from './derived_field';

export interface DerivedFieldJson extends GenericDerivedField<string> {

}

function isInDataFieldsArray(dataFields: Array<DataField>, name: string) {
    return dataFields
        .find(dataField => dataField.name === name) ? true : false;
}

/**
 * Parses a derived field json into a DerivedField and adds it to the master list of parsed derived fields
 * 
 * @export
 * @param {DerivedFieldJson} derivedField 
 * @param {AlgorithmJson} algorithm 
 * @param {Array<Covariate>} parsedCovariates 
 * @param {Array<DerivedField>} parsedDerivedFields 
 * @param {Array<DataField>} parsedDataFields 
 * @returns {DerivedField} 
 */
export function parseDerivedField(derivedField: DerivedFieldJson, algorithm: AlgorithmJson, parsedCovariates: Array<Covariate>, parsedDerivedFields: Array<DerivedField>, parsedDataFields: Array<DataField>): DerivedField {
    //Check if this has already been parsed and if it has return it
    const foundParsedDerivedField = parsedDerivedFields
        .find(parsedDerivedField => parsedDerivedField.name === derivedField.name);
    if(foundParsedDerivedField) {
        return foundParsedDerivedField;
    }

    const parsedDerivedField: IDerivedField = Object.assign({}, derivedField, {
        derivedFrom: derivedField
            .derivedFrom
            .map((derivedFromItem) => {
                //if it is a DataField
                if(isInDataFieldsArray(parsedDataFields, derivedFromItem)) {
                    return parsedDataFields
                        .find(parsedDataField => parsedDataField.name === derivedFromItem) as DataField;
                }

                //if it is a covariate
                if(isACovariate(algorithm, derivedFromItem)) {
                    const covariateJson = algorithm
                        .covariates
                        .find(covariate => covariate.name === derivedFromItem);

                    return parseCovariate(covariateJson as CovariateJson, algorithm, parsedCovariates, parsedDerivedFields, parsedDataFields)
                }

                //Otherwise it's a derived field
                const derivedFieldJson = algorithm
                    .localTransformations
                    .find(derivedField => derivedField.name === derivedFromItem);

                return parseDerivedField(derivedFieldJson as DerivedFieldJson, algorithm, parsedCovariates,parsedDerivedFields, parsedDataFields);
            })
    });

    const derivedFieldInstance = Object.setPrototypeOf(parsedDerivedField, DerivedField.prototype);
    parsedDerivedFields.push(derivedFieldInstance);

    return derivedFieldInstance;
}