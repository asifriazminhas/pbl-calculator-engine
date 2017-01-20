//models
import IntermediatePredictor, {
    IntermediatePredictorObj
} from './predictors/intermediate_predictor'
import ExplanatoryPredictor, {
    ExplanatoryPredictorObj
} from './predictors/explanatory_predictor'
import Datum from './data/datum'
import * as moment from 'moment';
import RCSSpline from './custom_functions/rcs_spline';
import CustomFunction from './custom_functions/custom_function';
import Predictor from './predictors/predictor';
import env from './env/env';

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

    private calculateComponent(explanatoryPredictor: ExplanatoryPredictor, coefficent: number | string | moment.Moment, pmmlBeta: number): number {
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

        var beta = formattedCoefficient*pmmlBeta

        if(env.isEnvironmentTesting()) {
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
    
    /**
     * Calculates the component for a predictor with a a custom function
     * 
     * @private
     * @param {CustomFunction<any>} customFunction
     * @param {Array<Datum>} data
     * @returns {number}
     * 
     * @memberOf Algorithm
     */
    private getComponentForCustomFunction(customFunction: CustomFunction<any>, data: Array<Datum>, beta: number): number {
        //If the custom function is a spline function
        if(customFunction instanceof RCSSpline) {
            const firstVariablePredictor = (this.explanatoryPredictors as Array<Predictor>).concat(this.intermediatePredictors as Array<Predictor>)
                .find((explanatoryPreditor) => {
                    return explanatoryPreditor.name === customFunction.firstVariableName;
                });

            if(!firstVariablePredictor) {
                throw new Error(`No first variable predictor found with name ${customFunction.firstVariableName} when evaluating spline custom function`);
            }
            else {
                let firstVariableValue = this.getCoefficentForPredictor(firstVariablePredictor, data);

                if(firstVariableValue instanceof moment) {
                    throw new Error(`firstVariableValue is not a number when evluating spline function`); 
                }
                if(isNaN(firstVariableValue as number)) {
                    throw new Error(`firstVariableValue is not a number when evluating spline function`);
                }
                else {
                    return customFunction.evaluate({
                        firstVariableValue: Number(firstVariableValue)
                    })*beta;
                }
            }
        }
        else {
            throw new Error(`Unknown custom function`);
        }
    }
    
    /**
     * 
     * 
     * @private
     * @param {Predictor} predictor
     * @param {Array<Datum>} data
     * @returns {(number | string | moment.Moment)}
     * 
     * @memberOf Algorithm
     */
    private getCoefficentForPredictor(predictor: Predictor, data: Array<Datum>): number | string | moment.Moment {
        if(predictor instanceof ExplanatoryPredictor) {
            //Get the data for this predictor from which we can get the coefficent
            let foundDatumForCurrentPredictor = data.find((datum) => {
                return datum.name === predictor.name
            });

            //If no data was found
            if(!foundDatumForCurrentPredictor) {
                //Get the intermediate predictor for this explanatory predictor
                let foundIntermediatePredictor = this.intermediatePredictors
                .find((intermediatePredictor) => {
                    return intermediatePredictor.name === predictor.name
                });

                //If we did not find one then there is something wrtong so throw an error
                if(!foundIntermediatePredictor) {
                    throw new Error(`Evaluating coefficent for predictor ${predictor.name} but no data found and no intermediate predictor found`)
                }
                //Otherwise all is good.Continue with getting the coefficent for this intermediate predictor
                else {
                    return this.getCoefficentForPredictor(foundIntermediatePredictor, data);
                }
            }
            //Otherwise return the coefficent in this data
            else {
                return foundDatumForCurrentPredictor.coefficent;
            }
        }
        else if (predictor instanceof IntermediatePredictor) {
            return predictor.evaluate(this.getExplanatoryPredictorDataForIntermediatePredictor(predictor, data));
        }
        else {
            throw new Error(`Unknown predictor type`);
        }
    }

    /**
     * Returns the component for the Predictor
     * 
     * @param {ExplanatoryPredictor} predictor
     * @param {Array<Datum>} data
     * @returns {number}
     * 
     * @memberOf Algorithm
     */
    getComponentForPredictor(predictor: ExplanatoryPredictor, data: Array<Datum>): number {
        //If there is a custom function for this predictor then we use that to calculate the component
        if(predictor.customFunction) {
            return this.getComponentForCustomFunction(predictor.customFunction, data, predictor.beta);
        }
        //Otherwise
        else {
            const coefficent = this.getCoefficentForPredictor(predictor, data);
            const component = this.calculateComponent(predictor, coefficent, predictor.beta)

            if(env.isEnvironmentTesting() === true) {
                console.groupEnd()
            }

            return component
        }
    }

    evaluate(data: Array<Datum>): number {
        let calculatorData = data.concat(this.pmmlData);

        if(env.isEnvironmentTesting() === true) {
            console.groupCollapsed(`Predictors`)
        }

        var score = this.explanatoryPredictors.reduce((currentValue, explanatoryPredictor) => {
            if(env.isEnvironmentTesting() === true) {
                console.groupCollapsed(`${explanatoryPredictor.name}`)
            }
            
            let component = this.getComponentForPredictor(explanatoryPredictor, calculatorData);
            return currentValue + component
        }, 0)

        if(env.isEnvironmentTesting() === true) {
            console.groupEnd();
        }

        return 1 - (this.baselineHazard*Math.pow(Math.E, score));
    }
}

export default Algorithm