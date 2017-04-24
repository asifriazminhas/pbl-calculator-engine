//models
import Predictor, {
    IPredictor
} from './predictor'
import HelperFunctions from './helper_functions'
import Datum from '../data/datum'
import { env } from '../env/env';
import ExplanatoryPredictor from './explanatory_predictor';
import { NoDataFoundForPredictorError } from '../errors';
import * as moment from 'moment';
import * as _ from 'lodash';

export interface GenericIntermediatePredictor<T> extends IPredictor {
    equation: string
    explanatoryPredictors: Array<T>
}

class IntermediatePredictor extends Predictor implements GenericIntermediatePredictor<string | Predictor> {
    equation: string
    explanatoryPredictors: Array<Predictor>

    evaluateEquation(obj: {
        [index: string]: any
    }): any {
        obj;

        let derived: any = undefined;
        let func = HelperFunctions;
        func;

        eval(this.equation);

        return derived;
    }

    /**
     *  
     * 
     * @param {Array<Datum>} data 
     * @returns {(number | string | moment.Moment)} 
     * 
     * @memberOf IntermediatePredictor
     */
    calculateCoefficent(data: Array<Datum>): number | string | moment.Moment {
        //Check if there is a datum for this intermediate predictor. If there is then we don't need to go further
        const datumForCurrentIntermediatePredictor = this
            .getDatumForPredictor(data);

        if(datumForCurrentIntermediatePredictor) {
            return datumForCurrentIntermediatePredictor.coefficent;
        }
        else {
            //Filter out all the datum which are not needed for the equation evaluation
            let dataForEvaluation = data
                .filter(datum => this.explanatoryPredictors
                    .find(explanatoryPredictor => explanatoryPredictor.name === datum.name) ? true : false);
            
            //If we don't have all the data for evaluation when calculate it
            if(dataForEvaluation.length !== this.explanatoryPredictors.length) {
                dataForEvaluation = this.calculateDataToCalculateCoefficent(data);
            }

            if (env.shouldLogDebugInfo() === true) {
                console.groupCollapsed(`Intermediate Predictor: ${this.name}`)
                console.log(`Name: ${this.name}`)
                console.log(`Intermediate Predictor Equation: ${this.equation}`)
                console.log(`Intermediate Predictor Data`)
                console.table(dataForEvaluation)
            }

            //make the object with the all the data needed for the equation evaluation
            const obj: {
                [index: string]: any
            } = {};
            dataForEvaluation.forEach(datum => obj[datum.name] = datum.coefficent);

            const evaluatedValue = this.evaluateEquation(obj);
            if(env.shouldLogDebugInfo()) {
                console.log(`Evaluated value: ${evaluatedValue}`);
                console.groupEnd();
            }
            return evaluatedValue;
        }
    }

    /**
     * 
     * 
     * @param {Array<Datum>} data 
     * @returns {Array<Datum>} 
     * 
     * @memberOf IntermediatePredictor
     */
    calculateDataToCalculateCoefficent(data: Array<Datum>): Array<Datum> {
        //Go through each explanatory predictor and calculate the coefficent for each which will be used for the evaluation
        return _.flatten(this.explanatoryPredictors
            .map((explanatoryPredictor) => {
                const predictorName = explanatoryPredictor.name;
                
                if(explanatoryPredictor instanceof ExplanatoryPredictor) {
                    return new Datum().constructorForNewDatum(predictorName, explanatoryPredictor.calculateCoefficent(data));
                }
                else if(explanatoryPredictor instanceof IntermediatePredictor) {
                    return new Datum().constructorForNewDatum(predictorName, explanatoryPredictor.calculateCoefficent(data));
                }
                else if(explanatoryPredictor instanceof Predictor) {
                    const datumFound = explanatoryPredictor.getDatumForPredictor(data);
                    if(!datumFound) {
                        throw NoDataFoundForPredictorError(explanatoryPredictor.name, explanatoryPredictor.getErrorLabel());
                    }
                    else {
                        return datumFound;
                    }
                }
                else {
                    throw new Error(`Unhandled predictor type`);
                }
            }));
    }
}

export default IntermediatePredictor