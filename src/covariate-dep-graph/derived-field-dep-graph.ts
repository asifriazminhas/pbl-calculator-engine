// tslint:disable-next-line:max-line-length
import { NonInteractionCovariate } from '../engine/data-field/covariate/non-interaction-covariats/non-interaction-covariate';
import { InteractionCovariate } from '../engine/data-field/covariate/interaction-covariate/interaction-covariate';
import { DerivedField } from '../engine/data-field/derived-field/derived-field';

export function findDescendantDerivedField(
    derivedField: DerivedField,
    name: string,
): DerivedField | undefined {
    let foundDerivedField: DerivedField | undefined;

    derivedField.derivedFrom.every(derivedFromItem => {
        if (derivedFromItem.name === name) {
            if (derivedFromItem instanceof DerivedField) {
                foundDerivedField = derivedFromItem;
            }
        } else {
            if (
                derivedFromItem instanceof NonInteractionCovariate &&
                derivedFromItem.derivedField
            ) {
                foundDerivedField = findDescendantDerivedField(
                    derivedFromItem.derivedField,
                    name,
                );
            } else if (derivedFromItem instanceof InteractionCovariate) {
                foundDerivedField = findDescendantDerivedField(
                    derivedFromItem.derivedField,
                    name,
                );
            } else if (derivedFromItem instanceof DerivedField) {
                foundDerivedField = findDescendantDerivedField(
                    derivedFromItem,
                    name,
                );
            }
        }

        return foundDerivedField ? false : true;
    });

    return foundDerivedField;
}
