import { FieldTypes } from '../common/field-types';
import { InteractionCovariate } from './interaction-covariate';
import { NonInteractionCovariate } from './non-interaction-covariate';
import { Data, datumFactory, datumFromCovariateReferencePointFactory } from '../common/datum';
import { calculateDataToCalculateCoefficent as calculateDataToCalculateCoefficentForRcsCustomFunction, calculateCoefficent as calculateCoefficentForRcsCustomFunction } from './custom-functions/rcs-custom-function';
import { calculateDataToCalculateCoefficent as calculateDataToCalculateCoefficentForDerivedField, calculateCoefficent as calculateCoefficentForDerivedField } from './derived-field';
import { calculateDataToCalculateCoefficent as calculateDataToCalculateCoefficentForInteractionCovariate } from './interaction-covariate';
import { shouldLogDebugInfo, shouldLogWarnings } from '../common/env';
import { getDatumForField } from './field';

export type Covariate = InteractionCovariate | NonInteractionCovariate;

function calculateComponent(
    covariate: Covariate,
    coefficent: number
): number {
    var component = coefficent*covariate.beta;

    if(shouldLogDebugInfo()) {
        console.log(`Covariate ${this.name}`)
        console.log(`Input ${coefficent} ${coefficent === this.referencePoint ? 'Set to Reference Point' : ''}`)
        console.log(`PMML Beta ${this.beta}`)
        console.log(`Component ${component}`)
    }

    return component
}

export function getComponent(
    covariate: Covariate,
    data: Data
): number {
    if(shouldLogWarnings()) {
        console.groupCollapsed(`${this.name}`);
    }

    const component = calculateComponent(
        covariate,
        calculateCoefficent(covariate, data)
    );

    if(shouldLogDebugInfo() === true) {
        console.groupEnd()
    }

    return component
}

export function calculateCoefficent(
    covariate: Covariate,
    data: Data
): number {
    const coefficentData = covariate.fieldType ===  FieldTypes.InteractionCovariate ? calculateDataToCalculateCoefficentForInteractionCovariate(covariate, data) : calculateDataToCalculateCoefficent(
        covariate,
        data
    );
    
    let coefficent: any = 0;

    if (coefficentData.length === 1 && coefficentData[0].name === covariate.name) {
        coefficent = (coefficentData[0].coefficent);
    }
    else if (covariate.customFunction) {
        coefficent = calculateCoefficentForRcsCustomFunction(
            covariate.customFunction,
            coefficentData
        )
    }
    else if (covariate.derivedField) {
        coefficent = calculateCoefficentForDerivedField(
            covariate.derivedField,
            coefficentData
        );
    }

    return this.formatCoefficent(coefficent);
}

export function calculateDataToCalculateCoefficent(
    covariate: Covariate,
    data: Data
): Data {
    //Try to find a datum with the same name field in the data arg
    const datumFound = getDatumForField(covariate, data);

    //If we did not find anything then we need to calculate the coefficent using either a custom function or the coresponding derived field
    if (!datumFound) {
        //Custom function has higher priority
        if (covariate.customFunction) {
            return calculateDataToCalculateCoefficentForRcsCustomFunction(
                covariate.customFunction,
                data
            );
        }
        //Fall back tod erived field
        else if (covariate.derivedField) {
            try {
                return calculateDataToCalculateCoefficentForDerivedField(
                    covariate.derivedField,
                    data
                );
            }
            catch (err) {
                if (shouldLogWarnings()) {
                    console.warn(`Incomplete data to calculate coefficent for data field ${covariate.name}. Setting it to reference point`);
                }

                return [
                    datumFactory(covariate.name, covariate.referencePoint)
                ];
            }
        }
        //Fall back to setting it to reference point
        else {
            if (shouldLogWarnings()) {
                console.warn(`Incomplete data to calculate coefficent for data field ${this.name}. Setting it to reference point`);
            }

            return [
                datumFromCovariateReferencePointFactory(covariate)
            ];
        }
    }
    else {
        return [
            datumFound
        ];
    }
}