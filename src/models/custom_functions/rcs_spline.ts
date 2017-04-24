import { ICustomFunction, CustomFunction } from './custom_function';
import ExplanatoryPredictor from '../predictors/explanatory_predictor';
import Datum from '../data/datum';
import { NoDataFoundForPredictorError } from '../errors';

export interface GenericRcsCustomFunction<T> extends ICustomFunction {
    knots: Array<number>;
    firstVariablePredictor: T;
    variableNumber: number;
}

/**
 * A CustomFunction which handles splines
 * 
 * @class Spline
 * @extends {CustomFunction<EvaluateArgs>}
 */
class RCSSpline extends CustomFunction implements GenericRcsCustomFunction<ExplanatoryPredictor> { 
    type: string;
    /**
     * 
     * 
     * @type {Array<number>}
     * @memberOf Spline
     */
    knots: Array<number>;
    /**
     * The name of the predictor which represents the first rcs variable
     * 
     * @type {string}
     * @memberOf Spline
     */
    firstVariablePredictor: ExplanatoryPredictor;
    /**
     * The variable number of the spline. eg. age_rcs2 it would be 2
     * 
     * @type {number}
     * @memberOf Spline
     */
    variableNumber: number;

    constructor() {
        super();
        
        this.type = 'RcsCustomFunction';
    }

    get numberOfKnots(): number {
        return this.knots.length;
    }

    //Calculates the first term in the spline equation
    private getFirstTerm(firstVariableValue: number): number {
        const numerator = firstVariableValue - this.knots[this.variableNumber - 2];
        const denominator = Math.pow(this.knots[this.numberOfKnots - 1] - this.knots[0], (2/3));

        return Math.pow(Math.max(numerator/denominator, 0), 3);
    }
    
    //Calculates the second term in the spline equation
    private getSecondTerm(firstVariableValue: number): number {
        const coefficentNumerator = this.knots[this.numberOfKnots - 1] - this.knots[this.variableNumber - 2];
        const coefficentDenominator = this.knots[this.numberOfKnots - 1] - this.knots[this.numberOfKnots - 2];
        const coefficent = coefficentNumerator/coefficentDenominator;

        const numerator = firstVariableValue - this.knots[this.numberOfKnots - 2];
        const denominator = Math.pow(this.knots[this.numberOfKnots - 1] - this.knots[0], (2/3));

        return coefficent*Math.pow(Math.max(numerator/denominator, 0), 3);
    }

    //Calculates the third term inthe spline equation
    private getThirdTerm(firstVariableValue: number): number {
        const coefficentNumerator = this.knots[this.numberOfKnots - 2] - this.knots[this.variableNumber - 2];
        const coefficentDenominator = this.knots[this.numberOfKnots - 1] - this.knots[this.numberOfKnots - 2];
        const coefficent = coefficentNumerator/coefficentDenominator;

        const numerator = firstVariableValue - this.knots[this.numberOfKnots - 1];
        const denominator = Math.pow(this.knots[this.numberOfKnots - 1] - this.knots[0], (2/3));
        
        return coefficent*Math.pow(Math.max(numerator/denominator, 0), 3);
    }

    /**
     * Evaluates this custom function
     * 
     * @param {EvaluateArgs} args
     * @returns {number}
     * 
     * @memberOf Spline
     */
    calculateCoefficent(data: Array<Datum>): number {
        const datumValue = this.getDataToCalculateCoefficent(data).coefficent as number;

        return this.getFirstTerm(datumValue) - this.getSecondTerm(datumValue) + 
        this.getThirdTerm(datumValue);
    }

    /**
     * Returns the Datum object which is used in coefficent calculation
     * 
     * @param {Array<Datum>} data 
     * @returns {Datum} 
     * 
     * @memberOf RCSSpline
     */
    private getDataToCalculateCoefficent(data: Array<Datum>): Datum {
        //get the datum object for the first variable predictor
        const datumFound = data
            .find(datum => this.firstVariablePredictor.isPredictorWithName(datum.name));
        
        //if we found one then we are good otherwise throw an error
        if(datumFound) {
            return datumFound;
        }
        else {
            throw NoDataFoundForPredictorError(this.firstVariablePredictor.name, this.firstVariablePredictor.getErrorLabel());
        }
    }

    /**
     * Calculates the data array which is passed into the calculateCoefficent for this instance of the RcsCustomFunction
     * 
     * @param {Array<Datum>} data 
     * @returns {Array<Datum>} 
     * 
     * @memberOf RCSSpline
     */
    calculateDataToCalculateCoefficent(data: Array<Datum>): Array<Datum> {
        const datum = new Datum().constructorForNewDatum(this.firstVariablePredictor.name, this.firstVariablePredictor.calculateCoefficent(data));

        return [datum];
    }

    toJSON() {
        return Object.assign({}, this, {
            type: 'RCSSpline'
        });
    }
}

export default RCSSpline;

