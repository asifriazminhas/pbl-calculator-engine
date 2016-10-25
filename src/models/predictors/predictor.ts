import OpType, {
    getOpTypeFromPmmlOpType
} from '../op_type'

class Predictor {
    name: string
    opType: OpType

    protected constructFromNameAndOpType(name: string, opType: string): Predictor {
        this.name = name
        this.opType = getOpTypeFromPmmlOpType(opType)

        return this
    }
}

export default Predictor