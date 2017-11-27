import { InteractionCovariate } from './interaction-covariate';
import { NonInteractionCovariate } from './non-interaction-covariate';
import { Data } from '../data';
import { Cox } from '../cox';
export declare type Covariate = InteractionCovariate | NonInteractionCovariate;
export declare function getComponent(covariate: Covariate, data: Data, userFunctions: Cox['userFunctions']): number;
export declare function calculateCoefficent(covariate: Covariate, data: Data, userDefinedFunctions: Cox['userFunctions']): number;
