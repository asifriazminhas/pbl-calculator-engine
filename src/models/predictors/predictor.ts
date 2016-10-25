//models
import OpType, {
    getOpTypeFromPmmlOpType
} from '../op_type'

export interface PredictorObj {
    name: string
    opType: number
}

class Predictor {
    name: string
    opType: OpType

    protected constructFromNameAndOpType(name: string, opType: string): Predictor {
        this.name = name
        this.opType = getOpTypeFromPmmlOpType(opType)

        return this
    }

    protected constructFromPredictorObject(predictor: PredictorObj) {
        this.name = predictor.name
        this.opType = predictor.opType

        return this
    }
}

export default Predictor