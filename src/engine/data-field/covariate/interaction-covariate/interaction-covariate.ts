import { Covariate } from '../covariate';
import { autobind } from 'core-decorators';
import { DerivedField } from '../../derived-field/derived-field';
import { Data } from '../../../data/data';
import { IAlgorithm } from '../../../algorithm/algorithm';
import { datumFromCovariateReferencePointFactory, IDatum } from '../../../data';
import { NonInteractionCovariate } from '../non-interaction-covariats/non-interaction-covariate';

@autobind
export class InteractionCovariate extends Covariate {
    derivedField: DerivedField;

    calculateDataToCalculateCoefficent(
        data: Data,
        userDefinedFunctions: IAlgorithm<any>['userFunctions'],
        tables: IAlgorithm<any>['tables'],
    ): Data {
        const coefficentData = super.calculateDataToCalculateCoefficent(
            data,
            userDefinedFunctions,
            tables,
        );

        if (
            this.isCoefficentDatumSetToReferencePoint(coefficentData[0]) ||
            this.isCoefficentDatumSetToReferencePoint(coefficentData[1])
        ) {
            return [datumFromCovariateReferencePointFactory(this)];
        } else {
            return coefficentData;
        }
    }

    private isCoefficentDatumSetToReferencePoint(datum: IDatum): boolean {
        const derivedFieldForDatum = this.derivedField.derivedFrom.find(
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
}
