//models
import Predictor, {
    PredictorObj
} from './predictor'

export interface ExplanatoryPredictorObj extends PredictorObj {
    beta: number
    referencePoint: number
}

class ExplanatoryPredictor extends Predictor {
    beta: number
    referencePoint: number

    constructFromPmml(name: string, opType: string, beta: string, referencePoint: string): ExplanatoryPredictor {
        super.constructFromNameAndOpType(name, opType)

        this.beta = Number(beta)
        this.referencePoint = Number(referencePoint)

        return this
    }

    constructFromExplanatoryPredictorObject(explanatoryPredictorObj: ExplanatoryPredictorObj): ExplanatoryPredictor {
        super.constructFromPredictorObject(explanatoryPredictorObj)

        this.beta = explanatoryPredictorObj.beta
        this.referencePoint = explanatoryPredictorObj.referencePoint
        
        return this
    }
}

export default ExplanatoryPredictor