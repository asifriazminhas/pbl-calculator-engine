//models
import Predictor, {
    PredictorObj
} from './predictor'
import CustomFunction from '../custom_functions/custom_function';
import RCSSpline from '../custom_functions/rcs_spline';

export interface ExplanatoryPredictorObj extends PredictorObj {
    beta: number
    referencePoint: number
    customFunction: any
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
        //TODO Implement this better for the future when we need more cusotm functions
        this.customFunction = explanatoryPredictorObj.customFunction ? Object.setPrototypeOf(Object.assign({}, explanatoryPredictorObj.customFunction), RCSSpline.prototype) : null;

        return this
    }

    isInteractionPredictor(): boolean {
        return this.name.split('_')[1].trim().toLowerCase() === 'int';
    }
}

export default ExplanatoryPredictor