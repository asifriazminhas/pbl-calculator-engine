//models
import Predictor, {
    PredictorObj
} from './predictor'

export interface ExplanatoryPredictorObj extends PredictorObj {
    beta: number
}

class ExplanatoryPredictor extends Predictor {
    beta: number

    constructFromPmml(name: string, opType: string, beta: string): ExplanatoryPredictor {
        super.constructFromNameAndOpType(name, opType)

        this.beta = Number(beta)

        return this
    }

    constructFromExplanatoryPredictorObject(explanatoryPredictorObj: ExplanatoryPredictorObj): ExplanatoryPredictor {
        super.constructFromPredictorObject(explanatoryPredictorObj)

        this.beta = explanatoryPredictorObj.beta

        return this
    }
}

export default ExplanatoryPredictor