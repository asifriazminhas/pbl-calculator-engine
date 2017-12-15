import { InteractionCovariate } from './interaction-covariate';
import { NonInteractionCovariate } from './non-interaction-covariate';
import { Data } from '../data';
import { Algorithm } from '../algorithm';
export declare type Covariate = InteractionCovariate | NonInteractionCovariate;
export declare function getComponent(covariate: Covariate, data: Data, userFunctions: Algorithm<any>['userFunctions'], tables: Algorithm<any>['tables']): number;
export declare function calculateCoefficent(covariate: Covariate, data: Data, userDefinedFunctions: Algorithm<any>['userFunctions'], tables: Algorithm<any>['tables']): number;
