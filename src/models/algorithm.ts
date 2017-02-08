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
import * as _ from 'lodash';

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
        if(env.shouldLogWarnings()) {
            this.logWarningsForUnusedDatumInData(userData);
        }

        let dataToUserInAlgorithm = this.getDataToUseInAlgorithm(userData);

        if(env.shouldLogDebugInfo() === true) {
            console.groupCollapsed(`Predictors`)
        }

        var score = this.explanatoryPredictors.reduce((currentValue, explanatoryPredictor) => {
            if(env.shouldLogDebugInfo() === true) {
                console.groupCollapsed(`${explanatoryPredictor.name}`)
            }
            
            let component = this.getComponentForPredictor(explanatoryPredictor, dataToUserInAlgorithm);
            return currentValue + component
        }, 0)

        if(env.shouldLogDebugInfo() === true) {
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

        if(env.shouldLogDebugInfo()) {
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
        if(env.shouldLogWarnings()) {
            console.warn(`Logging predictors being set to reference\n`);
        }

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
            
        if(env.shouldLogWarnings()) {
            console.warn(`\n`);
        }

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

        if(env.shouldLogDebugInfo() === true) {
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
            return false;
        }
    }
    
    /**
     * Returns the explanatory predictors which depend on this intermediatePredictors for it's complete calculation
     * 
     * @private
     * @param {IntermediatePredictor} intermediatePredictor
     * @returns {Array<ExplanatoryPredictor>}
     * 
     * @memberOf Algorithm
     */
    private getExplanatoryPredictorsForIntermediatePredictor(intermediatePredictor: IntermediatePredictor): Array<ExplanatoryPredictor> {
        //Find an explanatpry predictor with the same name as the intermediate predictor
        const explanatoryPredictorForIntermediatePredictor = this.explanatoryPredictors
            .find((explanatoryPredictor) => {
                return explanatoryPredictor.name === intermediatePredictor.name;
            });
        
        //if we did not find one continue
        if(!explanatoryPredictorForIntermediatePredictor) {
            return _.flatten(
                //Go through all the algorithm's intermediate predictors
                this.getExplanatoryIntermediatePredictorsForIntermediatePredictor       (intermediatePredictor)
                //map each one to it's explanatory predictor
                    .map((currentIntermediatePredictor)=> {
                        return this.getExplanatoryPredictorsForIntermediatePredictor(currentIntermediatePredictor);
                    })
                )
                //Remove duplicates
                .reduce((currentExplanatoryPredictors: Array<ExplanatoryPredictor>, explanatoryPredictor) => {
                    const isExplanatoryPredictorAlreadyAdded = currentExplanatoryPredictors
                        .find((currentExplanatoryPredictor) => {
                            return currentExplanatoryPredictor.name === explanatoryPredictor.name
                        }) !== undefined;

                    if(!isExplanatoryPredictorAlreadyAdded) {
                        currentExplanatoryPredictors.push(explanatoryPredictor);
                    }

                    return currentExplanatoryPredictors;
                }, []);
        }
        //Otherwise thereis only one explanatory predictor this intermediate predictor is used for
        else {
            return [
                explanatoryPredictorForIntermediatePredictor
            ];
        }
    }
    
    /**
     * Goes through the data arg and logs any datums which are not going to be used in the algorithm either because we could not find anything associated with it or because it does not have the other datum that goes along with it for a certain calculation
     * 
     * @private
     * @param {Array<Datum>} data
     * 
     * @memberOf Algorithm
     */
    private logWarningsForUnusedDatumInData(data: Array<Datum>): void {
        console.warn(`Logging unused coefficents\n`);

        data.forEach((datum) => {
            //get explanatory predictor for this dtum
            const explanatoryPredictorForCurrentDatum = this.explanatoryPredictors
                .find((explanatoryPredictor) => {
                    return explanatoryPredictor.name === datum.name;
                });
            
            //if we did not find one then there may be a problem so continue
            if(!explanatoryPredictorForCurrentDatum) {
                //get all the intermediate predictor which has the same name as this datum or depends on this datum
                let intermediatePredictorsForCurrentDatum = this.intermediatePredictors
                    .filter((intermediatePredictor) => {
                        return intermediatePredictor.name === datum.name || intermediatePredictor.explanatoryPredictors.indexOf(datum.name) > -1;
                    });
                
                //If we could not find one then nothing is associated with this datum so log the warning
                if(intermediatePredictorsForCurrentDatum.length === 0) {
                    console.warn(`${datum.name} - No coefficient identified. Not used for risk calculation.`);
                }
                else {
                    //Whether we could find at least one explanatory predcitor from all the found intermediate predictors associated with this datum wih the full set of data required to calculate it fully
                    const usedToCalculateAtLeastOneExplanatoryPredictor = _.flatten(
                        //get all the explanatory predictors which depend on all the intermediate predictor associated with this datum
                        intermediatePredictorsForCurrentDatum
                            .map((intermediatePredictor) => {
                                return this.getExplanatoryPredictorsForIntermediatePredictor(intermediatePredictor);
                            })
                        )
                        //Remove duplicates
                        .reduce((currentExplanatoryPredictors: Array<ExplanatoryPredictor>, explanatoryPredictor) => {
                            const isExplanatoryPredictorAlreadyAdded = currentExplanatoryPredictors
                                .find((currentExplanatoryPredictor) => {
                                    return currentExplanatoryPredictor.name === explanatoryPredictor.name
                                }) !== undefined;

                            if(!isExplanatoryPredictorAlreadyAdded) {
                                currentExplanatoryPredictors.push(explanatoryPredictor);
                            }

                            return currentExplanatoryPredictors;
                        }, [])
                        //Find at least one which has the full set of data
                        .find((explanatoryPredictor) => {
                            return !this.isDataMissingForExplanatoryPredictor(data, explanatoryPredictor);
                        }) !== undefined;
                    
                    //If we did not find at least one the log the warning
                    if(!usedToCalculateAtLeastOneExplanatoryPredictor) {
                        console.warn(`${datum.name} - Coefficent identified but cannot be used due to missing other data fields.`);
                    }
                }
            }
        });

        console.log('\n')
    }
    
    /**
     * gets the top level intermediate predictors for the entire algorithm
     * 
     * @returns {Array<IntermediatePredictor>}
     * 
     * @memberOf Algorithm
     */
    getTopLevelIntermediatePredictors(): Array<IntermediatePredictor> {
        return _.flatten(this.intermediatePredictors
            .map((intermediatePredictor) => {
                return this.getTopLevelIntermediatePredictorsForIntermediatePredictor(intermediatePredictor);
            }))
            //Remove duplicates
            .reduce((currentIntermediatePredictors: Array<IntermediatePredictor>, intermediatePredictor) => {
                const hasAddedCurrentIntermediatePredictor = currentIntermediatePredictors
                    .find((currentIntermediatePredictor) => {
                        return currentIntermediatePredictor.name === intermediatePredictor.name;
                    }) !== undefined;

                if(!hasAddedCurrentIntermediatePredictor) {
                    currentIntermediatePredictors.push(intermediatePredictor);
                }

                return currentIntermediatePredictors;
            }, []);
    }
    
    /**
     * Returns intermediate predictors that are at the top of the chain for the passed intermediatePredictor arg
     * 
     * @private
     * @param {IntermediatePredictor} intermediatePredictor
     * @returns {Array<IntermediatePredictor>}
     * 
     * @memberOf Algorithm
     */
    private getTopLevelIntermediatePredictorsForIntermediatePredictor(intermediatePredictor: IntermediatePredictor): Array<IntermediatePredictor> {
        //What will be returned from this function
        let topLevelIntermediatePredictors: Array<IntermediatePredictor> = [];
        //Keeps track of the intermediate predictors in the current iteration
        let currentTopLevelIntermediatePredictors = this.getExplanatoryIntermediatePredictorsForIntermediatePredictor(intermediatePredictor);

        //Do this loop until we no longer have any intermediate predictors to iterate over
        while(currentTopLevelIntermediatePredictors.length !== 0) {
            currentTopLevelIntermediatePredictors = _.flatten(
                //Go through each intermediate predictor
                currentTopLevelIntermediatePredictors
                    .map((intermediatePredictor) => {
                        //get all the intermediate predictors one step above this one
                        let currentTopLevelIntermediatePredictors = this.getExplanatoryIntermediatePredictorsForIntermediatePredictor(intermediatePredictor);

                        //If there are none then this is the top most intermediate predictor so add it to the topLevelIntermediatePredictors
                        if(currentTopLevelIntermediatePredictors.length === 0) {
                            topLevelIntermediatePredictors.push(intermediatePredictor)
                        }

                        return currentTopLevelIntermediatePredictors;
                    })
            );
        }

        //If this is empty then the inermediate predictor arg is itself a top level intermediate predictor
        if(topLevelIntermediatePredictors.length === 0) {
            return [
                intermediatePredictor
            ];
        }
        else {
            return topLevelIntermediatePredictors;
        }
    }
    
    /**
     * Returns all the intermediate predcitors which are derived from the passed intermediatePredictor arg
     * 
     * @private
     * @param {IntermediatePredictor} intermediatePredictor
     * @returns {Array<IntermediatePredictor>}
     * 
     * @memberOf Algorithm
     */
    private getExplanatoryIntermediatePredictorsForIntermediatePredictor(intermediatePredictor: IntermediatePredictor): Array<IntermediatePredictor> {
        return this.intermediatePredictors
            .filter((currentIntermediatePredictor) => {
                return currentIntermediatePredictor.explanatoryPredictors.indexOf(intermediatePredictor.name) > -1;
            });
    }
}

export default Algorithm