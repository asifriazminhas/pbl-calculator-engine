//models
import IntermediatePredictor, {
    IntermediatePredictorObj
} from './predictors/intermediate_predictor'
import ExplanatoryPredictor, {
    ExplanatoryPredictorObj
} from './predictors/explanatory_predictor'
import Datum from './data/datum'

export interface AlgorithmObj {
    name: string
    explanatoryPredictors: Array<ExplanatoryPredictorObj>
    intermediatePredictors: Array<IntermediatePredictorObj>
}

class Algorithm {
    name: string
    explanatoryPredictors: Array<ExplanatoryPredictor>
    intermediatePredictors: Array<IntermediatePredictor>

    constructFromPmml(explanatoryPredictors: Array<ExplanatoryPredictor>, intermediatePredictors: Array<IntermediatePredictor>): Algorithm {
        this.explanatoryPredictors = explanatoryPredictors
        this.intermediatePredictors = intermediatePredictors

        return this
    }

    constructFromAlgorithmObject(algorithmObj: AlgorithmObj): Algorithm {
        this.name = algorithmObj.name
        this.explanatoryPredictors = algorithmObj.explanatoryPredictors
        .map((explanatoryPredictor) => {
            return new ExplanatoryPredictor().constructFromExplanatoryPredictorObject(explanatoryPredictor)
        })
        this.intermediatePredictors = algorithmObj.intermediatePredictors
        .map((intermediatePredictor) => {
            return new IntermediatePredictor().constructFromIntermediatePredictorObject(intermediatePredictor)
        })

        return this
    }

    getExplanatoryPredictorDataForIntermediatePredictor(intermediatePredictor: IntermediatePredictor, data: Array<Datum>): Array<Datum> {
        return intermediatePredictor.explanatoryPredictors.map((explanatoryPredictor) => {
            var dataForExplanatoryPredictor = data.find((datum) => {
                return datum.name ===  explanatoryPredictor
            })

            if(!dataForExplanatoryPredictor) {
                var intermediatePredictorForExplanatoryPredictor = this.intermediatePredictors
                .find((intermediatePredictor) => {
                    return intermediatePredictor.name === explanatoryPredictor
                })

                if(!intermediatePredictorForExplanatoryPredictor) {
                    throw new Error(`No error for predictor ${explanatoryPredictor}`)
                }
                else {
                    return new Datum().constructorForNewDatum(intermediatePredictorForExplanatoryPredictor.name, intermediatePredictorForExplanatoryPredictor.evaluate(this.getExplanatoryPredictorDataForIntermediatePredictor(intermediatePredictorForExplanatoryPredictor, data)))
                }
            }
            else {
                return dataForExplanatoryPredictor
            }
        })
    }

    evaluate(data: Array<Datum>): number {
        return this.explanatoryPredictors.reduce((currentValue, explanatoryPredictor) => {
            let foundDatumForCurrentPredictor = data.find((datum) => {
                return datum.name === explanatoryPredictor.name
            })

            if(!foundDatumForCurrentPredictor) {
                let foundIntermediatePredictor = this.intermediatePredictors
                .find((intermediatePredictor) => {
                    return intermediatePredictor.name === explanatoryPredictor.name
                })

                if(!foundIntermediatePredictor) {
                    throw new Error(`No predictor found for ${explanatoryPredictor.name}`)
                }
                else {
                    return foundIntermediatePredictor.evaluate(this.getExplanatoryPredictorDataForIntermediatePredictor(foundIntermediatePredictor, data))
                }
            }
            else {
                return currentValue + foundDatumForCurrentPredictor.coefficent*explanatoryPredictor.beta
            }
        }, 0)
    }
}

export default Algorithm