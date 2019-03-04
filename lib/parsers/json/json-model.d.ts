import { Model } from '../../engine/model/model';
import { JsonSerializable } from '../../util/types';
import { Omit } from 'utility-types';
import { ICoxSurvivalAlgorithmJson } from './json-cox-survival-algorithm';
import { PredicateJson } from './json-predicate';
import { Data } from '../../engine/data';
export interface IModelJson extends Omit<JsonSerializable<Model>, 'algorithms'> {
    algorithms: Array<{
        algorithm: ICoxSurvivalAlgorithmJson;
        predicate: PredicateJson;
    }>;
}
export declare function getAlgorithmJsonForPredicateData(modelJson: IModelJson, predicateData: Data): ICoxSurvivalAlgorithmJson;
