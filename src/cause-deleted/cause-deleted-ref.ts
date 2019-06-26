import { IGenderSpecificCauseEffectRef } from '../engine/cause-effect';

export type CauseDeletedRef = Array<{
    // In the context of the algorithm which this reference is for, the name of
    // the sex variable
    sexVariable: string;
    // In the same context, the value of the sex variable which activates this
    // reference
    sexValue: string;
    ref: IGenderSpecificCauseEffectRef;
}>;
