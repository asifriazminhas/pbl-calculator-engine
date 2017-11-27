import { OpType } from '../op-type';

export interface ContinuousOpType {
    opType: OpType.Continuous;
    min: number;
    max: number;
}