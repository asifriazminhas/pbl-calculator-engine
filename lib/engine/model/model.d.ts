import { Data } from '../data';
import { ModelAlgorithm } from './model-algorithm';
import { CoxSurvivalAlgorithm } from '../algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm';
import { IModelJson } from '../../parsers/json/json-model';
import { BaselineJson } from '../../parsers/json/json-baseline';
import { DataField } from '../data-field/data-field';
import { Algorithm } from '../algorithm/algorithm';
import { JsonAlgorithms } from '../../parsers/json/json-algorithms';
export declare type NewBaseline = Array<{
    predicateData: Data;
    newBaseline: BaselineJson;
}>;
export declare class Model<T extends Algorithm> {
    name: string;
    algorithms: Array<ModelAlgorithm<T>>;
    modelFields: DataField[];
    constructor(modelJson: IModelJson<JsonAlgorithms>);
    getAlgorithmForData(data: Data): T;
    updateBaselineForModel(this: Model<CoxSurvivalAlgorithm>, newBaselines: NewBaseline): Model<CoxSurvivalAlgorithm>;
    /**
     * Returns all the fields used in the model and all it's algorithms
     *
     * @returns {DataField[]}
     * @memberof Model
     */
    getAllFields(): DataField[];
    getModelRequiredFields(): DataField[];
    getModelRecommendedFields(): DataField[];
}
