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
    getExplanatoryPredictorDataForIntermediatePredictor(intermediatePredictor: IntermediatePredictor, data: Array<Datum>): Array<Datum> {
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
                    return new Datum().constructorForNewDatum(intermediatePredictorForExplanatoryPredictor.name, intermediatePredictorForExplanatoryPredictor.evaluate(this.getExplanatoryPredictorDataForIntermediatePredictor(intermediatePredictorForExplanatoryPredictor, data)))
                }
            }
            //If there is return it
            else {
                return dataForExplanatoryPredictor
            }
        })
    }

    private getBeta(coefficent: number, pmmlBeta: number): number {
        return Math.pow(Math.E, (coefficent*pmmlBeta))
    }

    evaluate(data: Array<Datum>): number {
        console.log(`------------Predictors------------`)

        var output = this.explanatoryPredictors.reduce((currentValue, explanatoryPredictor) => {
            console.log(`\t------${explanatoryPredictor.name}------`)

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
                    let coefficent = foundIntermediatePredictor.evaluate(this.getExplanatoryPredictorDataForIntermediatePredictor(foundIntermediatePredictor, data))
                    let beta = this.getBeta(coefficent, explanatoryPredictor.beta)
                    if(process.env.NODE_ENV === 'test') {
                        console.log(`\t\tPredictor ${explanatoryPredictor.name}`)
                        console.log(`\t\t\tCoefficent ${coefficent}`)
                        console.log(`\t\t\tPMML Beta ${explanatoryPredictor.beta}`)
                        console.log(`\t\t\tBeta ${beta}`)
                    }

                    console.log('')
                    return currentValue + beta
                }
            }
            else {
                if(typeof foundDatumForCurrentPredictor.coefficent === 'number') {
                    let coefficent = foundDatumForCurrentPredictor.coefficent
                    let beta = this.getBeta(coefficent, explanatoryPredictor.beta)
                    if(process.env.NODE_ENV === 'test') {
                        console.log(`\t\tPredictor ${explanatoryPredictor.name}`)
                        console.log(`\t\t\tCoefficent ${coefficent}`)
                        console.log(`\t\t\tPMML Beta ${explanatoryPredictor.beta}`)
                        console.log(`\t\t\tBeta ${beta}`)
                    }

                    console.log('')
                    return currentValue + beta
                }
                else {
                    throw new Error(`Datum for predictor ${explanatoryPredictor.name} is not a number`)
                }
            }
        }, 0)
        console.log(`------------Predictors------------`)

        return output
    }
}

export default Algorithm