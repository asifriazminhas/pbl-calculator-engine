/**
 * Returns an error when the coefficent for a Predictor cannot be parsed into a number
 * 
 * @export
 * @param {string} predictorName 
 * @returns {Error} 
 */
export function CoefficentIsNotANumber(predictorName: string): Error {
    return new Error(`Coefficent is not a number when evaluating predictor ${predictorName}`);
}

/**
 * Returns an error when we cannot find the data required for coefficent calculation for a predictor
 * 
 * @export
 * @param {string} predictorName 
 * @param {string} predictorLabel 
 * @returns {Error} 
 */
export function NoDataFoundForPredictorError(predictorName: string, predictorLabel: string): Error {
    return new Error(`No datum found for ${predictorLabel} with name ${predictorName}`);
}

/**
 * Returns an error when there was a problem in the JSON parser module
 * 
 * @export
 * @param {string} message 
 * @returns {Error} 
 */
export function JsonParseError(message: string): Error {
    return new Error(message);
}