import { Coefficent } from './coefficent';
import { IBaseCovariate } from '../covariate';
export interface IDatum {
    name: string;
    coefficent: Coefficent;
}
export declare function datumFactory(name: string, coefficent: Coefficent): IDatum;
export declare function datumFromCovariateReferencePointFactory(covariate: IBaseCovariate): IDatum;
