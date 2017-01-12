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
class Spline extends CustomFunction<EvaluateArgs> { 
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

    constructor() {
        super();

        this.knots = [];
        this.firstVariableName = ''; 
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
    constructFromPmml(knots: Array<number>, firstVariableName: string) {
        this.knots = knots;
        this.firstVariableName = firstVariableName;

        return this;
    }

    //Calculates the first term in the spline equation
    private getFirstTerm(firstVariableValue: number): number {
        return Math.max(Math.pow(firstVariableValue - this.knots[0], 3), 0);
    }
    
    //Calculates the second term in the spline equation
    private getSecondTerm(firstVariableValue: number): number {
        return ((this.knots[2] - this.knots[0])/(this.knots[2] - this.knots[1]))*Math.max(Math.pow(firstVariableValue - this.knots[1], 3), 0)
    }

    //Calculates the third term inthe spline equation
    private getThirdTerm(firstVariableValue: number): number {
        return ((this.knots[1] - this.knots[0])/(this.knots[2] - this.knots[1]))*Math.max(Math.pow(firstVariableValue - this.knots[2], 3), 0)
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

export default Spline;

