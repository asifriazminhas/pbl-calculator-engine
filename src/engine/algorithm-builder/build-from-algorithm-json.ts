import { GetRiskToTime, getGetRiskToTime, GetSurvivalToTime, getGetSurvivalToTime, WithCauseImpactWithCoxFunctions, getWithCauseImpactWithCoxFunctions } from '../algorithm-evaluator';
import { AddLifeTableWithAddRefPop, getAddLifeTableWithAddRefPop } from './add-life-table';
import { AddRefPopWithAddLifeTable, getAddRefPopWithAddLifeTable} from './add-ref-pop';
import { CoxJson } from '../common/json-types';
import { parseCoxJsonToCox } from '../json-parser/cox';
import { ToJson, getToJson } from './to-json';
import { WithDataAndCoxFunctions, getWithDataAndCoxFunctions } from '../algorithm-evaluator';
import { BaseAddAlgorithm, curryBaseAddAlgorithmFunction } from './add-algorithm';

export type BuildFromAlgorithJsonFunction = (
    algorithmJson: CoxJson
) => GetSurvivalToTime & GetRiskToTime & AddLifeTableWithAddRefPop & ToJson & AddRefPopWithAddLifeTable & WithDataAndCoxFunctions<{}> & BaseAddAlgorithm & WithCauseImpactWithCoxFunctions;

export interface BuildFromAlgorithmJson {
    buildFromAlgorithmJson: BuildFromAlgorithJsonFunction
}

export function curryBuildFromAlgorithmJsonFunction(

): BuildFromAlgorithJsonFunction {
    return (algorithmJson) => {
        const cox = parseCoxJsonToCox(algorithmJson);

        return Object.assign(
            {},
            getGetRiskToTime(cox),
            getGetSurvivalToTime(cox), 
            getToJson(algorithmJson),
            getAddRefPopWithAddLifeTable(cox, algorithmJson),
            getWithDataAndCoxFunctions({}),
            getWithCauseImpactWithCoxFunctions(
                algorithmJson,
                cox
            ),
            {
                addLifeTable: getAddLifeTableWithAddRefPop(
                    cox,
                    algorithmJson
                ),
                addAlgorithm: curryBaseAddAlgorithmFunction(
                    cox,
                    algorithmJson
                )
            }
        )
    }
}