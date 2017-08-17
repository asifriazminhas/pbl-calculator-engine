import * as moment from 'moment';
import { Covariate } from '../cox/covariate';
export declare type Coefficent = string | number | moment.Moment | Date;
export interface Datum {
    name: string;
    coefficent: Coefficent;
}
export declare type Data = Array<Datum>;
export declare function datumFactory(name: string, coefficent: Coefficent): Datum;
export declare function datumFromCovariateReferencePointFactory(covariate: Covariate): Datum;
