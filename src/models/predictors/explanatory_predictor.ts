//models
import Predictor, {
    PredictorObj
} from './predictor'
import CustomFunction from '../custom_functions/custom_function';

export interface ExplanatoryPredictorObj extends PredictorObj {
    beta: number
    referencePoint: number
}

class ExplanatoryPredictor extends Predictor {
    beta: number
    referencePoint: number
    customFunction: CustomFunction<any> | null;

    constructFromPmml(name: string, opType: string, beta: string, referencePoint: string, customFunction: CustomFunction<any> | null): ExplanatoryPredictor {
        super.constructFromNameAndOpType(name, opType)

        this.beta = Number(beta)
        this.referencePoint = Number(referencePoint)
        this.customFunction = customFunction;

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