import * as moment from 'moment';
import { Covariate } from '../covariate';
export declare type Coefficent = string | number | moment.Moment | Date | null | undefined;
export declare function formatCoefficentForComponent(coefficent: Coefficent, covariate: Covariate): number | undefined;
