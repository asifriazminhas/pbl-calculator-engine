import {
    GenericBaseInteractionCovariate,
    GenericCategoricalInteractionCovariate,
    GenericContinuousInteractionCovariate,
} from './generic-covariate';
import { Covariate } from './covariate';
import { IBaseCovariate } from './base-covariate';
import { DerivedField } from '../derived-field';
import { IDatum, Data, datumFromCovariateReferencePointFactory } from '../data';
import { NonInteractionCovariate } from './non-interaction-covariate';
import { calculateDataToCalculateCoefficent as calculateDataToCalculateCoefficentForCovariate } from './base-covariate';
import { Algorithm } from '../algorithm';

/* Need the following three interfaces because of this issue
https://github.com/Microsoft/TypeScript/issues/14174 */
export interface IBaseInteractionCovariate
    extends GenericBaseInteractionCovariate<Covariate>,
        IBaseCovariate {
    derivedField: DerivedField;
}
export interface ICategoricalInteractionCovariate
    extends GenericCategoricalInteractionCovariate<Covariate>,
        IBaseInteractionCovariate {}
export interface IContinuousInteractionCovariate
    extends GenericContinuousInteractionCovariate<Covariate>,
        IBaseInteractionCovariate {}

export type InteractionCovariate =
    | IBaseInteractionCovariate
    | ICategoricalInteractionCovariate
    | IContinuousInteractionCovariate;

function isCoefficentDatumSetToReferencePoint(
    interactionCovariate: InteractionCovariate,
    datum: IDatum,
): boolean {
    const derivedFieldForDatum = interactionCovariate.derivedField.derivedFrom.find(
        derivedFromItem => derivedFromItem.name === datum.name,
    );

    if (!derivedFieldForDatum) {
        throw new Error(`No derived field found for datum ${datum.name}`);
    }

    return (
        (derivedFieldForDatum as NonInteractionCovariate).referencePoint ===
        datum.coefficent
    );
}

export function calculateDataToCalculateCoefficent(
    interactionCovariate: InteractionCovariate,
    data: Data,
    userDefinedFunctions: Algorithm<any>['userFunctions'],
    tables: Algorithm<any>['tables'],
): IDatum[] {
    const coefficentData = calculateDataToCalculateCoefficentForCovariate(
        interactionCovariate,
        data,
        userDefinedFunctions,
        tables,
    );

    if (
        isCoefficentDatumSetToReferencePoint(
            interactionCovariate,
            coefficentData[0],
        ) ||
        isCoefficentDatumSetToReferencePoint(
            interactionCovariate,
            coefficentData[1],
        )
    ) {
        return [datumFromCovariateReferencePointFactory(interactionCovariate)];
    } else {
        return coefficentData;
    }
}
