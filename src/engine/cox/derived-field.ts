import { GenericCategoricalDerivedField, GenericContinuousDerivedField, GenericDerivedFieldWithoutOpType, GenericDataField } from '../common/generic-types';
import { getDatumForField } from './field';
import { FieldTypes } from '../common/field-types';
import * as _ from 'lodash';
import { Data, datumFactory, Coefficent } from '../common/datum';
import { Covariate, calculateCoefficent as calculateCoefficentForCovariate } from './covariate'
import PmmlFunctions from './pmml-functions'
import { shouldLogDebugInfo } from '../common/env';

export type DerivedFrom = DerivedField | GenericDataField | Covariate;

export interface DerivedFieldWithoutOpType extends GenericDerivedFieldWithoutOpType<DerivedFrom> {}
export interface CategoricalDerivedField extends GenericCategoricalDerivedField<DerivedFrom> {}
export interface ContinuousDerivedField extends GenericContinuousDerivedField<DerivedFrom> {}

export type DerivedField = DerivedFieldWithoutOpType | CategoricalDerivedField | ContinuousDerivedField;

function evaluateEquation(obj: {
    [index: string]: any
}): any {
    obj;

    let derived: any = undefined;
    let func = PmmlFunctions;
    func;

    eval(this.equation);

    return derived;
}

export function calculateCoefficent(
    derivedField: DerivedField,
    data: Data
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
        if (dataForEvaluation.length !== this.derivedFrom.length) {
            dataForEvaluation = calculateDataToCalculateCoefficent(
                derivedField,
                data
            );
        }

        if (shouldLogDebugInfo() === true) {
            console.groupCollapsed(`Derived Field: ${this.name}`)
            console.log(`Name: ${this.name}`)
            console.log(`Derived Field: ${this.equation}`)
            console.log(`Derived Field Data`)
            console.table(dataForEvaluation)
        }

        //make the object with the all the data needed for the equation evaluation
        const obj: {
            [index: string]: any
        } = {};
        dataForEvaluation.forEach(datum => obj[datum.name] = datum.coefficent);

        const evaluatedValue = evaluateEquation(obj);
        if (shouldLogDebugInfo()) {
            console.log(`Evaluated value: ${evaluatedValue}`);
            console.groupEnd();
        }
        return evaluatedValue;
    }
}

export function calculateDataToCalculateCoefficent(
    derivedField: DerivedField,
    data: Data
): Data {
    //Go through each explanatory predictor and calculate the coefficent for each which will be used for the evaluation
    return _.flatten(derivedField.derivedFrom
        .map((derivedFromItem) => {
            const fieldName = derivedFromItem.name;

            if (derivedFromItem.fieldType === FieldTypes.InteractionCovariate || derivedFromItem.fieldType === FieldTypes.NonInteractionCovariate) {
                return datumFactory(
                    fieldName,
                    calculateCoefficentForCovariate(
                        derivedFromItem,
                        data
                    )
                );
            }
            else if (derivedFromItem.fieldType === FieldTypes.DerivedField) {
                return datumFactory(
                    fieldName, 
                    calculateCoefficent(
                        derivedFromItem,
                        data
                    )
                );
            }
            else {
                const datumFound = getDatumForField(
                    derivedFromItem,
                    data
                );

                if (!datumFound) {
                    throw new Error(``)
                }
                else {
                    return datumFound;
                }
            }
        }));
}