import { Covariate } from './covariate';
import { DerivedField } from './derived_field';
import { Datum, datumFromCovariateReferencePointFactory } from '../data/datum';

export class InteractionCovariate extends Covariate {
    derivedField: DerivedField;

    isCoefficentDatumSetToReferencePoint(datum: Datum): boolean {
        const derivedFieldForDatum = this.derivedField
            .derivedFrom
            .find(derivedFromItem => derivedFromItem.name === datum.name);

        if(!derivedFieldForDatum) {
            throw new Error(`No derived field found for datum ${datum.name}`);
        }

        return (derivedFieldForDatum as Covariate).referencePoint === datum.coefficent;
    }

    calculateDataToCalculateCoefficent(data: Array<Datum>): Array<Datum> {
        const coefficentData = super.calculateDataToCalculateCoefficent(data);

        if(this.isCoefficentDatumSetToReferencePoint(coefficentData[0]) ||this.isCoefficentDatumSetToReferencePoint(coefficentData[1])) {
            return [
                datumFromCovariateReferencePointFactory(this)
            ]
        }
        else {
            return coefficentData;
        }
    }
}