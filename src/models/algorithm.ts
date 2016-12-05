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

    //Returns the array of Datum objects for all the explanatoryPredictors in an intermediatePredictors
    getExplanatoryPredictorDataForIntermediatePredictor(intermediatePredictor: IntermediatePredictor, data: Array<Datum>, logData: boolean): Array<Datum> {
        //Go through all the explanatory predictors for the intermediate predictor and return the Datum object for each
        return intermediatePredictor.explanatoryPredictors.map((explanatoryPredictor) => {
            //Check if there is already a datum object for this explanatory predictor in the data param
            var dataForExplanatoryPredictor = data.find((datum) => {
                return datum.name ===  explanatoryPredictor
            })

            //If there isn't
            if(!dataForExplanatoryPredictor) {
                //If there isn't then it means this is actually an intermediate predictor in the algorithm so get the intermediate predictor object from the list of intermediat predictors
                var intermediatePredictorForExplanatoryPredictor = this.intermediatePredictors
                .find((intermediatePredictor) => {
                    return intermediatePredictor.name === explanatoryPredictor
                })

                //If we didn't find one then there is a problem
                if(!intermediatePredictorForExplanatoryPredictor) {
                    throw new Error(`No error for predictor ${explanatoryPredictor}`)
                }
                //Otherwise create a new Datum object using the name field as the identifier and evaluating this value for this intermediate predictor
                else {
                    return new Datum().constructorForNewDatum(intermediatePredictorForExplanatoryPredictor.name, intermediatePredictorForExplanatoryPredictor.evaluate(this.getExplanatoryPredictorDataForIntermediatePredictor(intermediatePredictorForExplanatoryPredictor, data, logData), logData))
                }
            }
            //If there is return it
            else {
                return dataForExplanatoryPredictor
            }
        })
    }

    private getBeta(explanatoryPredictor: ExplanatoryPredictor, coefficent: number | string, pmmlBeta: number, logData: boolean): number {
        let formattedCoefficient: number = 0
        if(typeof coefficent === 'string') {
            if(coefficent === 'NA') {
                formattedCoefficient = explanatoryPredictor.referencePoint
            }
            else {
                throw new Error(`coefficient is not a number`)
            }
        }
        else if(isNaN(coefficent)) {
            formattedCoefficient = explanatoryPredictor.referencePoint
        }
        else {
            formattedCoefficient = coefficent
        }

        var beta = Math.pow(Math.E, (formattedCoefficient*pmmlBeta))

        if(logData === true) {
            console.log(`\t\tExplanatory Predictor ${explanatoryPredictor.name}`)
            console.log(`\t\t\tInput ${formattedCoefficient} ${formattedCoefficient === explanatoryPredictor.referencePoint ? 'Set to Reference Point' : ''}`)
            console.log(`\t\t\tPMML Beta ${explanatoryPredictor.beta}`)
            console.log(`\t\t\tBeta ${beta}`)
        }

        return beta
    }

    evaluate(data: Array<Datum>, logData: boolean): number {
        if(logData === true) {
            console.log(`------------Predictors------------`)
        }

        var output = this.explanatoryPredictors.reduce((currentValue, explanatoryPredictor) => {
            if(logData === true) {
                console.log(`\t------${explanatoryPredictor.name}------`)
            }

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
                    let coefficent = foundIntermediatePredictor.evaluate(this.getExplanatoryPredictorDataForIntermediatePredictor(foundIntermediatePredictor, data, logData), logData)
                    let beta = this.getBeta(explanatoryPredictor, coefficent, explanatoryPredictor.beta, logData)

                    console.log('')
                    return currentValue*beta
                }
            }
            else {
                let coefficent = foundDatumForCurrentPredictor.coefficent
                let beta = this.getBeta(explanatoryPredictor, coefficent, explanatoryPredictor.beta, logData)

                console.log('')
                return currentValue*beta
            }
        }, 0)

        if(logData === true) {
            console.log(`------------Predictors------------`)
        }

        return output
    }
}

export default Algorithm