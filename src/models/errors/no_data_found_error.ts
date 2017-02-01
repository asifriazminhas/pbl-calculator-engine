/**
 * Error to use when there is not enough data to evaluate the component for an ExplanatoryPredictor or the transformation for an IntermediatePredictor 
 * 
 * @export
 * @class NoDataFoundError
 * @extends {Error}
 */
export class NoDataFoundError extends Error {
    static readonly ErrorName = 'NoDataFoundError';

    constructor(predictorName: string) {
        super(`No data found for predictor ${predictorName}`);

        this.name = NoDataFoundError.ErrorName;
    }
}