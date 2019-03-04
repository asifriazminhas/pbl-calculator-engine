import { Data } from '../data';
import { ModelAlgorithm } from './model-algorithm';
import { CoxSurvivalAlgorithm } from '../algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm';
import { IModelJson } from '../../parsers/json/json-model';
import { BaselineJson } from '../../parsers/json/json-baseline';
export declare type NewBaseline = Array<{
    predicateData: Data;
    newBaseline: BaselineJson;
}>;
export declare class Model {
    name: string;
    algorithms: ModelAlgorithm[];
    constructor(modelJson: IModelJson);
    getAlgorithmForData(data: Data): CoxSurvivalAlgorithm;
    updateBaselineForModel(newBaselines: NewBaseline): Model;
}
