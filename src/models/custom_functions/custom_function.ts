/**
 * A CustomFunction represents a non-PMML way (meaning that PMML currently does not support it) to do certain things like evaluating a Spline function
 * 
 * @abstract
 * @class CustomFunction
 * @template T The arguments object for the evaluate function
 */
abstract class CustomFunction<T> { 
    /**
     * Returns the result of this CustomFunction
     * 
     * @abstract
     * @param {T} args The object which holds all the arguments required for the evaluation of this CustomFunction
     * @returns {number}
     * 
     * @memberOf CustomFunction
     */
    abstract evaluate(args: T): number; 
}

export default CustomFunction;