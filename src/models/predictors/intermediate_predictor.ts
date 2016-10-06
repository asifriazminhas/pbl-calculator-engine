//models
import {
    PmmlIntermediatePredictorParser
} from '../parsers/pmml'
import Predictor from './predictor'
import HelperFunctions from './helper_functions'
import Datum from '../data/datum'

class IntermediatePredictor extends Predictor implements PmmlIntermediatePredictorParser {
    equation: string
    explanatoryPredictors: Array<string>

    constructFromPmml(name: string, opType: string, equation: string, explanatoryPredictors: Array<string>): IntermediatePredictor {
        super.constructFromPmml(name, opType)

        this.equation = equation
        this.explanatoryPredictors = explanatoryPredictors

        return this
    }

    evaluate(explanatoryPredictorsData: Array<Datum>): number {
        var obj: {
            [index: string]: number
        } = {}

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

        var func = HelperFunctions

        return eval(this.equation)
    }
}

export default IntermediatePredictor