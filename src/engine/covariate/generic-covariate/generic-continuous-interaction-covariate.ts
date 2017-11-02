import { GenericBaseInteractionCovariate } from './generic-base-interaction-covariate';
import { ContinuousOpType } from '../../op-type';

export interface GenericContinuousInteractionCovariate<T>
    extends GenericBaseInteractionCovariate<T>,
        ContinuousOpType {}
