import Datum from '../data/datum';

export interface ICustomFunction {
    type: string;
}

/**
 * Base CustomFunction class
 * 
 * @export
 * @abstract
 * @class CustomFunction
 * @implements {ICustomFunction}
 */
export abstract class CustomFunction implements ICustomFunction {
    /**
     * The type of this custom function. Used in the deserialization process to set the right prototype
     * 
     * @type {string}
     * @memberOf CustomFunction
     */
    type: string;

    /**
     * Returns the data to be used in the calculate coefficent method
     * 
     * @abstract
     * @param {Array<Datum>} data Data to filter from to get only the ones needed to calculate the coefficent from
     * @returns {Array<Datum>} 
     * 
     * @memberOf CustomFunction
     */
    abstract calculateDataToCalculateCoefficent(data: Array<Datum>): Array<Datum>;

    /**
     * Calculates the coefficent to be used for the predictor which this custom function belongs to
     * 
     * @abstract
     * @param {Array<Datum>} data 
     * @returns {number} 
     * 
     * @memberOf CustomFunction
     */
    abstract calculateCoefficent(data: Array<Datum>): number;
}