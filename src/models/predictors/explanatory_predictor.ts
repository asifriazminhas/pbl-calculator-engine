//models
import Predictor from './predictor'

class ExplanatoryPredictor extends Predictor {
    beta: number

    constructFromPmml(name: string, opType: string, beta: string): ExplanatoryPredictor {
        super.constructFromNameAndOpType(name, opType)

        this.beta = Number(beta)

        return this
    }
}

export default ExplanatoryPredictor