import { OpType } from '../../op_type';

export function getOpTypeFromPmmlOpType(opType: string): OpType {
    switch(opType) {
        case 'continuous': {
            return OpType.Continuous
        }
        case 'categorical': {
            return OpType.Categorical
        }
        default: {
            throw new Error(`Unknown Pmml OpType ${opType}`)
        }
    }
}