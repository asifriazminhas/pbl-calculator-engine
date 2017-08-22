import { Covariate } from './covariate';
import { Data } from '../common/datum';
import { GenericCox } from '../common/generic-types';
import * as moment from 'moment';
export declare type Cox = GenericCox<Covariate>;
export declare function getSurvivalToTime(cox: Cox, data: Data, time?: Date | moment.Moment): number;
export declare function getRisk(cox: Cox, data: Data): number;
