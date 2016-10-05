//models
import Predictor from './predictor'
import {
    PmmlExplanatoryPredictorParser
} from '../parsers/pmml'

class ExplanatoryPredictor extends Predictor implements PmmlExplanatoryPredictorParser {
    beta: number

    constructFromPmml(name: string, opType: string, beta: string): ExplanatoryPredictor {
        super.constructFromPmml(name, opType)

        this.beta = Number(beta)

        return this
    }
}

export default ExplanatoryPredictor