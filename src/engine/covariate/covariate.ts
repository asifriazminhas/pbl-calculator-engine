import {
    InteractionCovariate,
    calculateDataToCalculateCoefficent as calculateDataToCalculateCoefficentForInteractionCovariate,
} from './interaction-covariate';
import { NonInteractionCovariate } from './non-interaction-covariate';
import { calculateDataToCalculateCoefficent as calculateDataToCalculateCoefficentForCovariate } from './base-covariate';
import { shouldLogDebugInfo, shouldLogWarnings } from '../env';
import { Data, formatCoefficentForComponent } from '../data';
import { FieldType } from '../field';
// tslint:disable-next-line
import { calculateCoefficent as calculateCoefficentForRcsCustomFunction } from '../cox/custom-functions/rcs-custom-function';
import { calculateCoefficent as calculateCoefficentForDerivedField } from '../derived-field';
import { Cox } from '../cox';

export type Covariate = InteractionCovariate | NonInteractionCovariate;

function calculateComponent(covariate: Covariate, coefficent: number): number {
    const component = coefficent * covariate.beta;

    if (shouldLogDebugInfo()) {
        console.log(`Covariate ${covariate.name}`);
        console.log(
            `Input ${coefficent} ${coefficent === covariate.referencePoint
                ? 'Set to Reference Point'
                : ''}`,
        );
        console.log(`PMML Beta ${covariate.beta}`);
        console.log(`Component ${component}`);
    }

    return component;
}

export function getComponent(
    covariate: Covariate,
    data: Data,
    userFunctions: Cox['userFunctions'],
): number {
    if (shouldLogWarnings()) {
        console.groupCollapsed(`${covariate.name}`);
    }

    const component = calculateComponent(
        covariate,
        calculateCoefficent(covariate, data, userFunctions),
    );

    if (shouldLogDebugInfo() === true) {
        console.groupEnd();
    }

    return component;
}

export function calculateCoefficent(
    covariate: Covariate,
    data: Data,
    userDefinedFunctions: Cox['userFunctions'],
): number {
    const coefficentData =
        covariate.fieldType === FieldType.InteractionCovariate
            ? calculateDataToCalculateCoefficentForInteractionCovariate(
                  covariate,
                  data,
                  userDefinedFunctions,
              )
            : calculateDataToCalculateCoefficentForCovariate(
                  covariate,
                  data,
                  userDefinedFunctions,
              );

    let coefficent: any = 0;

    if (
        coefficentData.length === 1 &&
        coefficentData[0].name === covariate.name
    ) {
        coefficent = coefficentData[0].coefficent;
    } else if (covariate.customFunction) {
        coefficent = calculateCoefficentForRcsCustomFunction(
            covariate.customFunction,
            coefficentData,
        );
    } else if (covariate.derivedField) {
        coefficent = calculateCoefficentForDerivedField(
            covariate.derivedField,
            coefficentData,
            userDefinedFunctions,
        );
    }

    return formatCoefficentForComponent(coefficent, covariate);
}
