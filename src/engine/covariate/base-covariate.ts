import { GenericBaseCovariate } from './generic-covariate';
import {
    DerivedField,
    calculateDataToCalculateCoefficent as calculateDataToCalculateCoefficentForDerivedField,
} from '../derived-field/derived-field';
import { Covariate } from './covariate';
import { shouldLogWarnings } from '../env';
import {
    Data,
    datumFactory,
    datumFromCovariateReferencePointFactory,
} from '../data';
import { getDatumForField } from '../field';
// tslint:disable-next-line
import { calculateDataToCalculateCoefficent as calculateDataToCalculateCoefficentForRcsCustomFunction } from '../custom-function';
import { oneLine } from 'common-tags';
import { Algorithm } from '../algorithm/algorithm';

export interface IBaseCovariate extends GenericBaseCovariate<Covariate> {
    derivedField: DerivedField | undefined;
}

export function calculateDataToCalculateCoefficent(
    covariate: IBaseCovariate,
    data: Data,
    userDefinedFunctions: Algorithm<any>['userFunctions'],
    tables: Algorithm<any>['tables'],
): Data {
    // Try to find a datum with the same name field in the data arg
    const datumFound = getDatumForField(covariate, data);

    /* If we did not find anything then we need to calculate the coefficent
    using either a custom function or the coresponding derived field */
    if (!datumFound) {
        // Custom function has higher priority
        if (covariate.customFunction) {
            return calculateDataToCalculateCoefficentForRcsCustomFunction(
                covariate.customFunction,
                data,
                userDefinedFunctions,
                tables,
            );
        } else if (covariate.derivedField) {
            // Fall back to derived field
            try {
                return calculateDataToCalculateCoefficentForDerivedField(
                    covariate.derivedField,
                    data,
                    userDefinedFunctions,
                    tables,
                );
            } catch (err) {
                if (shouldLogWarnings()) {
                    console.warn(oneLine`Incomplete data to calculate coefficent for
                        data field ${covariate.name}. Setting it to reference
                        point`);
                }

                return [datumFactory(covariate.name, covariate.referencePoint)];
            }
        } else {
            // Fall back to setting it to reference point
            if (shouldLogWarnings()) {
                console.warn(oneLine`Incomplete data to calculate coefficent for
                    datafield ${covariate.name}. Setting it to reference point`);
            }

            return [datumFromCovariateReferencePointFactory(covariate)];
        }
    } else {
        return [datumFound];
    }
}
