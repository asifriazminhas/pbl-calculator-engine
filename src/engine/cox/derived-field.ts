import { GenericCategoricalDerivedField, GenericContinuousDerivedField, GenericDerivedFieldWithoutOpType } from '../common/generic-types';
import { DataField } from '../data-field';
import { getDatumForField } from './field';
import { FieldType } from '../field';
import { flatten } from 'lodash';
import { Data, datumFactory, Coefficent } from '../common/datum';
import { Covariate, calculateCoefficent as calculateCoefficentForCovariate } from './covariate'
import PmmlFunctions from './pmml-functions'
import { shouldLogDebugInfo } from '../common/env';

export type DerivedFrom = DerivedField | DataField | Covariate;

export interface DerivedFieldWithoutOpType extends GenericDerivedFieldWithoutOpType<DerivedFrom> {}
export interface CategoricalDerivedField extends GenericCategoricalDerivedField<DerivedFrom> {}
export interface ContinuousDerivedField extends GenericContinuousDerivedField<DerivedFrom> {}

export type DerivedField = DerivedFieldWithoutOpType | CategoricalDerivedField | ContinuousDerivedField;

function evaluateEquation(
    derivedField: DerivedField,
    obj: {
        [index: string]: any
    },
    userFunctions: {
        [index: string]: Function
    }
): any {
    obj;
    userFunctions;

    let derived: any = undefined;
    let func = PmmlFunctions;
    func;

    eval(derivedField.equation);

    return derived;
}

export function calculateCoefficent(
    derivedField: DerivedField,
    data: Data,
    userDefinedFunctions: {
        [index: string]: Function
    }
): Coefficent {
    //Check if there is a datum for this intermediate predictor. If there is then we don't need to go further
    const datumForCurrentDerivedField = getDatumForField(
        derivedField,
        data
    );

    if (datumForCurrentDerivedField) {
        return datumForCurrentDerivedField.coefficent;
    }
    else {
        //Filter out all the datum which are not needed for the equation evaluation
        let dataForEvaluation = data
            .filter(datum => derivedField.derivedFrom
                .find(derivedFromItem => derivedFromItem.name === datum.name) ? true : false);

        //If we don't have all the data for evaluation when calculate it
        if (dataForEvaluation.length !== derivedField.derivedFrom.length) {
            dataForEvaluation = calculateDataToCalculateCoefficent(
                derivedField,
                data,
                userDefinedFunctions
            );
        }

        if (shouldLogDebugInfo() === true) {
            console.groupCollapsed(`Derived Field: ${derivedField.name}`)
            console.log(`Name: ${derivedField.name}`)
            console.log(`Derived Field: ${derivedField.equation}`)
            console.log(`Derived Field Data`)
            console.table(dataForEvaluation)
        }

        //make the object with the all the data needed for the equation evaluation
        const obj: {
            [index: string]: any
        } = {};
        dataForEvaluation.forEach(datum => obj[datum.name] = datum.coefficent);

        const evaluatedValue = evaluateEquation(
            derivedField, 
            obj, 
            userDefinedFunctions
        );
        if (shouldLogDebugInfo()) {
            console.log(`Evaluated value: ${evaluatedValue}`);
            console.groupEnd();
        }
        return evaluatedValue;
    }
}

export function calculateDataToCalculateCoefficent(
    derivedField: DerivedField,
    data: Data,
    userDefinedFunctions: {
        [index: string]: Function
    }
): Data {
    //Go through each explanatory predictor and calculate the coefficent for each which will be used for the evaluation
    return flatten(derivedField.derivedFrom
        .map((derivedFromItem) => {
            const fieldName = derivedFromItem.name;

            if (derivedFromItem.fieldType === FieldType.InteractionCovariate || derivedFromItem.fieldType === FieldType.NonInteractionCovariate) {
                return datumFactory(
                    fieldName,
                    calculateCoefficentForCovariate(
                        derivedFromItem,
                        data,
                        userDefinedFunctions
                    )
                );
            }
            else if (derivedFromItem.fieldType === FieldType.DerivedField) {
                return datumFactory(
                    fieldName, 
                    calculateCoefficent(
                        derivedFromItem,
                        data,
                        userDefinedFunctions
                    )
                );
            }
            else {
                const datumFound = getDatumForField(
                    derivedFromItem,
                    data
                );

                if (!datumFound) {
                    return {
                        name: derivedField.name,
                        coefficent: null
                    }
                }
                else {
                    return datumFound;
                }
            }
        }));
}

export function getLeafFieldsForDerivedField(
    derivedField: DerivedField
): Array<DerivedFrom> {
    if(derivedField.derivedFrom.length === 0) {
        return [
            derivedField
        ];
    } else {
        return flatten(
            derivedField
                .derivedFrom
                .map((derivedFromItem) => {
                    if(derivedFromItem.fieldType === FieldType.DataField) {
                        return derivedFromItem;
                    } else if(derivedFromItem.fieldType === FieldType.DerivedField) {
                        return getLeafFieldsForDerivedField(derivedFromItem);
                    } else {
                        if(derivedFromItem.derivedField) {
                            return getLeafFieldsForDerivedField(
                                derivedFromItem.derivedField
                            );
                        } else {
                            return derivedFromItem;
                        }
                    }
                })
        )
    }
}