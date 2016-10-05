//models
import IntermediatePredictor from './predictors/intermediate_predictor'
import ExplanatoryPredictor from './predictors/explanatory_predictor'
import getPmmlParser, {
    PmmlAlgorithmParser
} from './parsers/pmml'

class Algorithm implements PmmlAlgorithmParser {
    explanatoryPredictors: Array<ExplanatoryPredictor>
    intermediatePredictor: Array<IntermediatePredictor>

    constructFromPmml(explanatoryPredictors: Array<ExplanatoryPredictor>, intermediatePredictors: Array<IntermediatePredictor>): Algorithm {
        this.explanatoryPredictors = explanatoryPredictors
        this.intermediatePredictor = intermediatePredictors

        return this
    }

    static parsePmml=getPmmlParser(Algorithm, ExplanatoryPredictor, IntermediatePredictor)
}

export default Algorithm