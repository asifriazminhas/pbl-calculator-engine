//models
import Predictor, {
    PredictorObj
} from './predictor'
import HelperFunctions from './helper_functions'
import Datum from '../data/datum'

export interface IntermediatePredictorObj extends PredictorObj {
    equation: string
    explanatoryPredictors: Array<string>
}

class IntermediatePredictor extends Predictor {
    equation: string
    explanatoryPredictors: Array<string>

    constructFromPmml(name: string, opType: string, equation: string, explanatoryPredictors: Array<string>): IntermediatePredictor {
        super.constructFromNameAndOpType(name, opType)

        this.equation = equation
        this.explanatoryPredictors = explanatoryPredictors

        return this
    }

    constructFromIntermediatePredictorObject(intermediatePredictorObj: IntermediatePredictorObj): IntermediatePredictor {
        super.constructFromPredictorObject(intermediatePredictorObj)

        this.equation = intermediatePredictorObj.equation
        this.explanatoryPredictors = intermediatePredictorObj.explanatoryPredictors

        return this
    }

    evaluate(explanatoryPredictorsData: Array<Datum>): number {
        var obj: {
            [index: string]: string | number
        } = {}
        let derived: any = undefined
        let func = HelperFunctions
        
        this.explanatoryPredictors.forEach((explanatoryPredictor) => {
            var dataForCurrentExplanatoryPredictor = explanatoryPredictorsData
            .find((explanatoryPredictorData) => {
                return explanatoryPredictor === explanatoryPredictorData.name
            })

            if(!dataForCurrentExplanatoryPredictor) {
                throw new Error(`No data found for predictor ${explanatoryPredictor}`)
            }
            else {
                obj[explanatoryPredictor] = dataForCurrentExplanatoryPredictor.coefficent
            }
        })

        eval(this.equation)

        return derived
    }
}

export default IntermediatePredictor