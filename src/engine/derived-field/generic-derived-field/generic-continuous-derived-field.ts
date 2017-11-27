import { GenericBaseDerivedField } from './generic-base-derived-field';
import { ContinuousOpType } from '../../op-type';

export interface GenericContinuousDerivedField<T>
    extends GenericBaseDerivedField<T>,
        ContinuousOpType {}
