export enum OpType {
    Continuous=0,
    Categorical=1
}

export function getOpTypeFromPmmlOpType(opType: string): OpType {
    switch(opType) {
        case 'continuous': {
            return OpType.Continuous
        }
        case 'categorical': {
            return OpType.Categorical
        }
        default: {
            throw new Error('Unknown Pmml OpType')
        }
    }
}

export default OpType