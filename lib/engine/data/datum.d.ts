import { Coefficent } from './coefficent';
import { Covariate } from '../data-field/covariate/covariate';
import { DataField } from '../data-field/data-field';
export interface IDatum {
    name: string;
    coefficent: Coefficent;
}
export declare function datumFromCovariateReferencePointFactory(covariate: Covariate): IDatum;
/**
 * Returns a new Datum object where the name matches with that of the
 * dataField arg and the coefficient arg has been checked if it's within the
 * acceptable bounds. If it isn't then we set it's value to either the lower or
 * upper bound
 *
 * @export
 * @param {DataField} dataField
 * @param {Coefficent} coefficient
 * @returns {IDatum}
 */
export declare function datumFactoryFromDataField(dataField: DataField, coefficient: Coefficent): IDatum;
