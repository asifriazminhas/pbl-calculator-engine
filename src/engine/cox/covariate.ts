import { FieldType } from '../field';
import { InteractionCovariate } from './interaction-covariate';
import { NonInteractionCovariate } from './non-interaction-covariate';
import { Data, datumFactory, datumFromCovariateReferencePointFactory } from '../common/datum';
import { calculateDataToCalculateCoefficent as calculateDataToCalculateCoefficentForRcsCustomFunction, calculateCoefficent as calculateCoefficentForRcsCustomFunction } from './custom-functions/rcs-custom-function';
import { calculateDataToCalculateCoefficent as calculateDataToCalculateCoefficentForDerivedField, calculateCoefficent as calculateCoefficentForDerivedField } from './derived-field';
import { calculateDataToCalculateCoefficent as calculateDataToCalculateCoefficentForInteractionCovariate } from './interaction-covariate';
import { shouldLogDebugInfo, shouldLogWarnings } from '../common/env';
import { getDatumForField } from './field';
import * as moment from 'moment';

export type Covariate = InteractionCovariate | NonInteractionCovariate;

function formatCoefficent(
    covariate: Covariate,
    coefficent: any
): number {
    if (!coefficent === null || coefficent === undefined) {
        return covariate.referencePoint;
    }
    if (coefficent instanceof moment) {
        throw new Error(`Coefficent is not a number ${covariate.name}`);
    }
    else if (coefficent === 'NA') {
        return covariate.referencePoint;
    }
    else if (!isNaN(coefficent as number)) {
        return Number(coefficent);
    }
    else if (isNaN(coefficent)) {
        return covariate.referencePoint;
    }
    else {
        throw new Error(`Coefficent is not a number ${covariate.name}`);
    }
}

function calculateComponent(
    covariate: Covariate,
    coefficent: number
): number {
    var component = coefficent*covariate.beta;

    if(shouldLogDebugInfo()) {
        console.log(`Covariate ${covariate.name}`)
        console.log(`Input ${coefficent} ${coefficent === covariate.referencePoint ? 'Set to Reference Point' : ''}`)
        console.log(`PMML Beta ${covariate.beta}`)
        console.log(`Component ${component}`)
    }

    return component
}

export function getComponent(
    covariate: Covariate,
    data: Data,
    userFunctions: {
        [index: string]: Function
    }
): number {
    if(shouldLogWarnings()) {
        console.groupCollapsed(`${covariate.name}`);
    }

    const component = calculateComponent(
        covariate,
        calculateCoefficent(covariate, data, userFunctions)
    );

    if(shouldLogDebugInfo() === true) {
        console.groupEnd()
    }

    return component
}

export function calculateCoefficent(
    covariate: Covariate,
    data: Data,
    userDefinedFunctions: {
        [index: string]: Function
    }
): number {
    const coefficentData = covariate.fieldType ===  FieldType.InteractionCovariate ? calculateDataToCalculateCoefficentForInteractionCovariate(
        covariate, 
        data,
        userDefinedFunctions
    ) : calculateDataToCalculateCoefficent(
        covariate,
        data,
        userDefinedFunctions
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
            coefficentData,
            userDefinedFunctions
        );
    }

    return formatCoefficent(covariate, coefficent);
}

export function calculateDataToCalculateCoefficent(
    covariate: Covariate,
    data: Data,
    userDefinedFunctions: {
        [index: string]: Function
    }
): Data {
    //Try to find a datum with the same name field in the data arg
    const datumFound = getDatumForField(covariate, data);

    //If we did not find anything then we need to calculate the coefficent using either a custom function or the coresponding derived field
    if (!datumFound) {
        //Custom function has higher priority
        if (covariate.customFunction) {
            return calculateDataToCalculateCoefficentForRcsCustomFunction(
                covariate.customFunction,
                data,
                userDefinedFunctions
            );
        }
        //Fall back tod erived field
        else if (covariate.derivedField) {
            try {
                return calculateDataToCalculateCoefficentForDerivedField(
                    covariate.derivedField,
                    data,
                    userDefinedFunctions
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
                console.warn(`Incomplete data to calculate coefficent for data field ${covariate.name}. Setting it to reference point`);
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