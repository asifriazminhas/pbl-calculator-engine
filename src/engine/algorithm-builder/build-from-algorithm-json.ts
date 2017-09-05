import { GetRiskToTime, addGetRiskToTime, GetSurvivalToTime, curryGetSurvivalToTimeFunction } from '../algorithm-evaluator';
import { AddLifeTableWithAddRefPop, curryAddLifeTableFunctionWithAddRefPop } from './add-life-table';
import { AddRefPopWithAddLifeTable, curryAddRefPopWithAddLifeTable} from './add-ref-pop';
import { CoxJson } from '../common/json-types';
import { parseCoxJsonToCox } from '../json-parser/cox';
import { ToJson, curryToJsonFunction } from './to-json';
import { BaseWithData, curryBaseWithDataFunction } from '../algorithm-evaluator';
import { BaseAddAlgorithm, curryBaseAddAlgorithmFunction } from './add-algorithm';

export type BuildFromAlgorithJsonFunction = (
    algorithmJson: CoxJson
) => GetSurvivalToTime & GetRiskToTime & AddLifeTableWithAddRefPop & ToJson & AddRefPopWithAddLifeTable & BaseWithData<{}> & BaseAddAlgorithm;

export interface BuildFromAlgorithmJson {
    buildFromAlgorithmJson: BuildFromAlgorithJsonFunction
}

export function curryBuildFromAlgorithmJsonFunction(

): BuildFromAlgorithJsonFunction {
    return (algorithmJson) => {
        const cox = parseCoxJsonToCox(algorithmJson);

        return addGetRiskToTime({
            getSurvivalToTime: curryGetSurvivalToTimeFunction(cox),
            addLifeTable: curryAddLifeTableFunctionWithAddRefPop(
                cox,
                algorithmJson
            ),
            addRefPop: curryAddRefPopWithAddLifeTable(
                cox,
                algorithmJson
            ),
            withData: curryBaseWithDataFunction({}),
            toJson: curryToJsonFunction(algorithmJson),
            addAlgorithm: curryBaseAddAlgorithmFunction(
                cox,
                algorithmJson
            )
        }, cox)
    }
}