//models
import IntermediatePredictor, {
    IntermediatePredictorObj
} from './predictors/intermediate_predictor'
import ExplanatoryPredictor, {
    ExplanatoryPredictorObj
} from './predictors/explanatory_predictor'
import Datum from './data/datum'
import * as moment from 'moment';

export interface AlgorithmObj {
    name: string
    explanatoryPredictors: Array<ExplanatoryPredictorObj>
    intermediatePredictors: Array<IntermediatePredictorObj>,
    baselineHazard: number
}

class Algorithm {
    name: string
    explanatoryPredictors: Array<ExplanatoryPredictor>
    intermediatePredictors: Array<IntermediatePredictor>
    baselineHazard: number

    constructFromPmml(explanatoryPredictors: Array<ExplanatoryPredictor>, intermediatePredictors: Array<IntermediatePredictor>, baselineHazard: number): Algorithm {
        this.explanatoryPredictors = explanatoryPredictors
        this.intermediatePredictors = intermediatePredictors
        this.baselineHazard = baselineHazard

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
        this.baselineHazard = algorithmObj.baselineHazard

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

    private getComponent(explanatoryPredictor: ExplanatoryPredictor, coefficent: number | string | moment.Moment, pmmlBeta: number, logData: boolean): number {
        let formattedCoefficient: number = 0
        if(typeof coefficent === 'string') {
            if(coefficent === 'NA') {
                formattedCoefficient = explanatoryPredictor.referencePoint
            }
            else {
                throw new Error(`coefficient is not a number`)
            }
        }
        else if(coefficent instanceof moment) {
            throw new Error(`coefficent is a moment object`)
        }
        else if(isNaN(coefficent as number)) {
            formattedCoefficient = explanatoryPredictor.referencePoint
        }
        else {
            formattedCoefficient = coefficent as number
        }

        var beta = Math.pow(Math.E, (formattedCoefficient*pmmlBeta))

        if(logData === true) {
            console.log(`Explanatory Predictor ${explanatoryPredictor.name}`)
            console.log(`Input ${formattedCoefficient} ${formattedCoefficient === explanatoryPredictor.referencePoint ? 'Set to Reference Point' : ''}`)
            console.log(`PMML Beta ${explanatoryPredictor.beta}`)
            console.log(`Component ${beta}`)
        }

        return beta
    }

    get pmmlData(): Array<Datum> {
        return [
            new Datum().constructorForNewDatum('StartDate', moment())
        ]
    }

    evaluate(data: Array<Datum>, logData: boolean): number {
        let calculatorData = data.concat(this.pmmlData);

        if(logData === true) {
            console.groupCollapsed(`Predictors`)
        }

        var score = this.explanatoryPredictors.reduce((currentValue, explanatoryPredictor) => {
            if(logData === true) {
                console.groupCollapsed(`${explanatoryPredictor.name}`)
            }

            let foundDatumForCurrentPredictor = calculatorData.find((datum) => {
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
                    let coefficent = foundIntermediatePredictor.evaluate(this.getExplanatoryPredictorDataForIntermediatePredictor(foundIntermediatePredictor, calculatorData, logData), logData)
                    let beta = this.getComponent(explanatoryPredictor, coefficent, explanatoryPredictor.beta, logData)

                    console.groupEnd()
                    return currentValue*beta
                }
            }
            else {
                let coefficent = foundDatumForCurrentPredictor.coefficent
                let beta = this.getComponent(explanatoryPredictor, coefficent, explanatoryPredictor.beta, logData)

                console.groupEnd();
                return currentValue*beta
            }
        }, 1)

        if(logData === true) {
            console.groupEnd();
        }

        return 1 - (this.baselineHazard*score);
    }
}

export default Algorithm