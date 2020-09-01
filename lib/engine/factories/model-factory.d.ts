import { Model } from '../model/model';
import { CoxSurvivalAlgorithm } from '../algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm';
export declare abstract class ModelFactory {
    /**
     * Used to extend a model object at runtime for eg. to add new methods and
     * properties to it
     *
     * @static
     * @template U
     * @param {Model} model The Model object to extend
     * @param {U[]} newCoxProperties properties that will be added to the
     * algorithms within the model. Each entry in the array will be used to
     * extend the algorithm at the same entry in the model
     * @returns {(Model<U & CoxSurvivalAlgorithm>)}
     * @memberof ModelFactory
     */
    static extendModel<T extends object, U extends object>(model: Model<CoxSurvivalAlgorithm>, newModelProperties: T, newCoxProperties?: U[]): Model<U & CoxSurvivalAlgorithm> & T;
}
