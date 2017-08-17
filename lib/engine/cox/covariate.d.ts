import { InteractionCovariate } from './interaction-covariate';
import { NonInteractionCovariate } from './non-interaction-covariate';
import { Data } from '../common/datum';
export declare type Covariate = InteractionCovariate | NonInteractionCovariate;
export declare function getComponent(covariate: Covariate, data: Data): number;
export declare function calculateCoefficent(covariate: Covariate, data: Data): number;
export declare function calculateDataToCalculateCoefficent(covariate: Covariate, data: Data): Data;
