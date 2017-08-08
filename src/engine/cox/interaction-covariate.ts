import { GenericInteractionCovariateWithoutOpType, GenericCategoricalInteractionCovariate, GenericContinuousInteractionCovariate } from '../common/generic-types';
import { DerivedField } from './derived-field';
import { Covariate } from './covariate';
import { Data, Datum, datumFromCovariateReferencePointFactory } from '../common/datum';
import { NonInteractionCovariate } from './non-interaction-covariate';
import { calculateDataToCalculateCoefficent as calculateDataToCalculateCoefficentForCovariate } from './covariate';

export interface InteractionCovariateWithoutOpType extends GenericInteractionCovariateWithoutOpType<Covariate, DerivedField> {}
export interface CategoricalInteractionCovariate extends GenericCategoricalInteractionCovariate<Covariate, DerivedField> {}
export interface ContinuousInteractionCovariate extends GenericContinuousInteractionCovariate<Covariate, DerivedField> {}

export type InteractionCovariate = InteractionCovariateWithoutOpType | CategoricalInteractionCovariate | ContinuousInteractionCovariate;

function isCoefficentDatumSetToReferencePoint(
    interactionCovariate: InteractionCovariate,
    datum: Datum
): boolean {
    const derivedFieldForDatum = interactionCovariate.derivedField
        .derivedFrom
        .find(derivedFromItem => derivedFromItem.name === datum.name);

    if(!derivedFieldForDatum) {
        throw new Error(`No derived field found for datum ${datum.name}`);
    }

    return (derivedFieldForDatum as NonInteractionCovariate).referencePoint === datum.coefficent;
}

export function calculateDataToCalculateCoefficent(
    interactionCovariate: InteractionCovariate,
    data: Data
): Array<Datum> {
    const coefficentData = calculateDataToCalculateCoefficentForCovariate(
        interactionCovariate,
        data
    );

    if(isCoefficentDatumSetToReferencePoint(
        interactionCovariate,
        coefficentData[0]
    ) ||isCoefficentDatumSetToReferencePoint(
        interactionCovariate,
        coefficentData[1]
    )) {
        return [
            datumFromCovariateReferencePointFactory(interactionCovariate)
        ]
    }
    else {
        return coefficentData;
    }
}