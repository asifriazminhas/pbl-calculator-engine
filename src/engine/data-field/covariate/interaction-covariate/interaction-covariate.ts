import { Covariate } from '../covariate';
import { autobind } from 'core-decorators';
import { DerivedField } from '../../derived-field/derived-field';
import { Data } from '../../../data/data';
import { IDatum } from '../../../data';
import { NonInteractionCovariate } from '../non-interaction-covariats/non-interaction-covariate';
import { IUserFunctions } from '../../../algorithm/user-functions/user-functions';
import { ITables } from '../../../algorithm/tables/tables';

@autobind
export class InteractionCovariate extends Covariate {
    // Initialized in the covariate constructor
    derivedField!: DerivedField;

    calculateDataToCalculateCoefficent(
        data: Data,
        userDefinedFunctions: IUserFunctions,
        tables: ITables,
    ): Data {
        const coefficentData = super.calculateDataToCalculateCoefficent(
            data,
            userDefinedFunctions,
            tables,
        );

        // Check whether the coefficent data has the interaction covariate in it and if it does return it
        if (
            coefficentData.length === 1 &&
            coefficentData[0].name === this.name
        ) {
            return coefficentData;
        }

        if (
            this.isCoefficentDatumSetToReferencePoint(coefficentData[0]) ||
            this.isCoefficentDatumSetToReferencePoint(coefficentData[1])
        ) {
            return [];
        } else {
            return coefficentData;
        }
    }

    private isCoefficentDatumSetToReferencePoint(datum: IDatum): boolean {
        const derivedFieldForDatum = this.derivedField.derivedFrom.find(
            derivedFromItem => derivedFromItem.name === datum.name,
        );

        if (!derivedFieldForDatum) {
            throw new Error(
                `No datum found for derived field ${this.derivedField.name}`,
            );
        }

        return (
            (derivedFieldForDatum as NonInteractionCovariate).referencePoint ===
            datum.coefficent
        );
    }
}
