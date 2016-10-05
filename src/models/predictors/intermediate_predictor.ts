//models
import {
    PmmlIntermediatePredictorParser
} from '../parsers/pmml'
import Predictor from './predictor'

class IntermediatePredictor extends Predictor implements PmmlIntermediatePredictorParser {
    equation: string
    explanatoryPredictors: Array<string>

    constructFromPmml(name: string, opType: string, equation: string, explanatoryPredictors: Array<string>): IntermediatePredictor {
        super.constructFromPmml(name, opType)

        this.equation = equation
        this.explanatoryPredictors = explanatoryPredictors

        return this
    }
}

export default IntermediatePredictor