import { NoDataFoundError } from './errors/no_data_found_error';
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
import { env } from './env/env';

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

    static readonly PmmlData = [
        new Datum().constructorForNewDatum('StartDate', moment())
    ];

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


    evaluate(userData: Array<Datum>): number {
        let dataToUserInAlgorithm = this.getDataToUseInAlgorithm(userData);

        if(env.isEnvironmentDebugging() === true) {
            console.groupCollapsed(`Predictors`)
        }

        var score = this.explanatoryPredictors.reduce((currentValue, explanatoryPredictor) => {
            if(env.isEnvironmentDebugging() === true) {
                console.groupCollapsed(`${explanatoryPredictor.name}`)
            }
            
            let component = this.getComponentForPredictor(explanatoryPredictor, dataToUserInAlgorithm);
            return currentValue + component
        }, 0)

        if(env.isEnvironmentDebugging() === true) {
            console.groupEnd();
        }

        return 1 - (this.baselineHazard*Math.pow(Math.E, score));
    }

    /**
     * Returns the data needed to compute the transformation for the IntermediatePredictor
     * 
     * @private
     * @param {IntermediatePredictor} intermediatePredictor
     * @param {Array<Datum>} data
     * @returns {Array<Datum>}
     * 
     * @memberOf Algorithm
     */
    private getDataForIntermediatePredictor(intermediatePredictor: IntermediatePredictor, data: Array<Datum>): Array<Datum> {
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
                    throw new NoDataFoundError(explanatoryPredictor);
                }
                //Otherwise create a new Datum object using the name field as the identifier and evaluating this value for this intermediate predictor
                else {
                    return new Datum().constructorForNewDatum(intermediatePredictorForExplanatoryPredictor.name, intermediatePredictorForExplanatoryPredictor.evaluate(this.getDataForIntermediatePredictor(intermediatePredictorForExplanatoryPredictor, data)))
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

        if(env.isEnvironmentDebugging()) {
            console.log(`Explanatory Predictor ${explanatoryPredictor.name}`)
            console.log(`Input ${formattedCoefficient} ${formattedCoefficient === explanatoryPredictor.referencePoint ? 'Set to Reference Point' : ''}`)
            console.log(`PMML Beta ${explanatoryPredictor.beta}`)
            console.log(`Component ${beta}`)
        }

        return beta
    } 
    
    /**
     * 
     * 
     * @private
     * @param {Array<Datum>} userData
     * @returns {Array<Datum>}
     * 
     * @memberOf Algorithm
     */
    private getDataToUseInAlgorithm(userData: Array<Datum>): Array<Datum> {
        const missingData =  this.explanatoryPredictors
            .map((explanatoryPredictor) => {
                if(this.isDataMissingForExplanatoryPredictor(userData, explanatoryPredictor) === true) {
                    if(explanatoryPredictor.customFunction !== null) {
                        return null;
                    }
                    else {
                        console.warn(`Setting data for ${explanatoryPredictor.name} to reference point due to missing data`);
                        return new Datum().constructorForNewDatum(explanatoryPredictor.name, explanatoryPredictor.referencePoint);
                    }
                }
                else {
                    return null;
                }
            })
            .filter((datum) => {
                return datum !== null;
            });
        
        return (missingData as Array<Datum>).concat(Algorithm.PmmlData).concat(userData);
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
    private getCoefficientForCustomFunction(customFunction: CustomFunction<any>, data: Array<Datum>): number {
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

                if(firstVariableValue === 'NA') {
                    if(firstVariablePredictor instanceof ExplanatoryPredictor) {
                        return customFunction.evaluate({
                            firstVariableValue: firstVariablePredictor.referencePoint
                        });
                    }
                    else {
                        throw new Error(`firstVariableValue is NA but predictor does not have a reference point`);
                    }
                }

                if(firstVariableValue instanceof moment) {
                    throw new Error(`firstVariableValue is not a number when evluating spline function`); 
                }
                else if(isNaN(firstVariableValue as number)) {
                    throw new Error(`firstVariableValue is not a number when evluating spline function`);
                }
                else {
                    return customFunction.evaluate({
                        firstVariableValue: Number(firstVariableValue)
                    });
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
                if(predictor.customFunction) {
                    return this.getCoefficientForCustomFunction(predictor.customFunction, data);
                }

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
            return predictor.evaluate(this.getDataForIntermediatePredictor(predictor, data));
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
    private getComponentForPredictor(predictor: ExplanatoryPredictor, data: Array<Datum>): number {
        const coefficent = this.getCoefficentForPredictor(predictor, data);
        const component = this.calculateComponent(predictor, coefficent, predictor.beta)

        if(env.isEnvironmentDebugging() === true) {
            console.groupEnd()
        }

        return component
    }
    
    /**
     * Checks if we have all the data necessary to compute the transformation for the passed IntermediatePredictor
     * 
     * @private
     * @param {Array<Datum>} data
     * @param {IntermediatePredictor} intermediatePredictor
     * @returns {boolean}
     * 
     * @memberOf Algorithm
     */
    private isDataMissingForIntermediatePredictor(data: Array<Datum>, intermediatePredictor: IntermediatePredictor): boolean {
        try {
            //Try to get all the data needed to do the transformation for this intermediate predictor
            this.getDataForIntermediatePredictor(intermediatePredictor, data);
        }
        catch(err) {
            //If we got an NoDataFoundError then data is missing so return true
            if(err.name === NoDataFoundError.ErrorName) {
                return true;
            }
            //Unknown error so throw it
            else {
                throw err;
            }
        }

        //No errors thrown so all data is present
        return false;
    }
    
    /**
     * Checks if we have all the data needed to compute the component for the passed ExplanatoryPredictor
     * 
     * @param {Array<Datum>} data
     * @param {ExplanatoryPredictor} predictor
     * @returns {boolean}
     * 
     * @memberOf Algorithm
     */
    private isDataMissingForExplanatoryPredictor(data: Array<Datum>, predictor: ExplanatoryPredictor): boolean {
        //get the data associated with this predictor from the data arg
        const datumForCurrentPredictor = data.find((datum) => {
            return datum.name === predictor.name;
        });

        //If there isn't any data
        if(datumForCurrentPredictor === undefined) {
            //If this predictor has a custom function then it doesn't need any data so return false 
            if(predictor.customFunction) {
                return false;
            }
            //If there isn't a custom function.
            else {
                //Then get the intermediate predictor if any associated with this explanatory predictor
                const intermediatePredictorForCurrentPredictor = this.intermediatePredictors
                .find((intermediatePredictor) => {
                    return intermediatePredictor.name === predictor.name;
                });

                //if there isn't one then return true since data is missing for this explanatory predictor
                if(intermediatePredictorForCurrentPredictor === undefined) {
                    return true;
                }
                //Otherwise check if we have all the data for the intermediate predictor
                else {
                    return this.isDataMissingForIntermediatePredictor(data, intermediatePredictorForCurrentPredictor);
                }
            }
        }
        //if there is data then it isn't missing so return true
        else {
            return true;
        }
    }
}

export default Algorithm