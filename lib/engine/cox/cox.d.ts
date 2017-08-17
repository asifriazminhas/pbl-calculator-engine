import { Covariate } from './covariate';
import { Data } from '../common/datum';
import { GenericCox } from '../common/generic-types';
export declare type Cox = GenericCox<Covariate>;
export declare function getSurvival(cox: Cox, data: Data): number;
export declare function getRisk(cox: Cox, data: Data): number;
