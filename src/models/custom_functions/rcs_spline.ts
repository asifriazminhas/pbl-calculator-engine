import CustomFunction from './custom_function';

/**
 * The args object for the evaluate function in the Spline CustomFunction
 * 
 * @export
 * @interface EvaluateArgs
 */
export interface EvaluateArgs { 
    /**
     * The value of the first rcs variable. When evaluating rcs2, rcs3 etc. for a certain variable we need rcs1 which is this field.
     * 
     * @type {number}
     * @memberOf EvaluateArgs
     */
    firstVariableValue: number;
}

/**
 * A CustomFunction which handles splines
 * 
 * @class Spline
 * @extends {CustomFunction<EvaluateArgs>}
 */
class RCSSpline extends CustomFunction<EvaluateArgs> { 
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
    firstVariableName: string;
    /**
     * The variable number of the spline. eg. age_rcs2 it would be 2
     * 
     * @type {number}
     * @memberOf Spline
     */
    variableNumber: number;

    constructor() {
        super();

        this.knots = [];
        this.firstVariableName = ''; 
        this.variableNumber = 1;
    }
    
    /**
     * 
     * 
     * @param {Array<number>} knots
     * @param {string} firstVariableName
     * @returns
     * 
     * @memberOf Spline
     */
    constructFromPmml(knots: Array<number>, firstVariableName: string, variableNumber: number) {
        this.knots = knots;
        this.firstVariableName = firstVariableName;
        this.variableNumber = variableNumber;

        return this;
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
    evaluate(args: EvaluateArgs): number {
        return this.getFirstTerm(args.firstVariableValue) - this.getSecondTerm(args.firstVariableValue) + this.getThirdTerm(args.firstVariableValue);
    }
}

export default RCSSpline;

