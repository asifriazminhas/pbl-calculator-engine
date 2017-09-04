import { GetRisk } from './get-risk';
import { GetSurvivalToTime } from './get-survival-to-time';
import { AddLifeTableWithAddRefPop } from './add-life-table';
import { AddRefPopWithAddLifeTable } from './add-ref-pop';
import { CoxJson } from '../common/json-types';
import { ToJson } from './to-json';
import { BaseWithData } from '../algorithm-evaluator';
import { BaseAddAlgorithm } from './add-algorithm';
export declare type BuildFromAlgorithJsonFunction = (algorithmJson: CoxJson) => GetSurvivalToTime & GetRisk & AddLifeTableWithAddRefPop & ToJson & AddRefPopWithAddLifeTable & BaseWithData<{}> & BaseAddAlgorithm;
export interface BuildFromAlgorithmJson {
    buildFromAlgorithmJson: BuildFromAlgorithJsonFunction;
}
export declare function curryBuildFromAlgorithmJsonFunction(): BuildFromAlgorithJsonFunction;
