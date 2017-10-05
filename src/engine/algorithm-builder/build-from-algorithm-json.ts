import { GetRiskToTime, getGetRiskToTime, GetSurvivalToTime, getGetSurvivalToTime, WithCauseImpactWithCoxFunctions, getWithCauseImpactWithCoxFunctions } from '../algorithm-evaluator';
import { AddLifeTableWithAddRefPop, getAddLifeTableWithAddRefPop } from './add-life-table';
import { AddRefPopWithAddLifeTable, getAddRefPopWithAddLifeTable} from './add-ref-pop';
import { parseModelJsonToModel } from '../json-parser';
import { ToJson, getToJson } from './to-json';
import { WithDataAndCoxFunctions, getWithDataAndCoxFunctions } from '../algorithm-evaluator';
import { BaseAddAlgorithm, getBaseAddAlgorithmFunction } from './add-algorithm';
import { BaseReplaceCauseImpactRef, getBaseReplaceCauseImpactRef } from './replace-cause-impact-ref';
import { JsonModelTypes } from '../model';

export type BuildFromAlgorithJsonFunction = (
    modelJson: JsonModelTypes
) => GetSurvivalToTime & GetRiskToTime & AddLifeTableWithAddRefPop & ToJson & AddRefPopWithAddLifeTable & WithDataAndCoxFunctions<{}> & BaseAddAlgorithm & WithCauseImpactWithCoxFunctions & BaseReplaceCauseImpactRef;

export interface BuildFromAlgorithmJson {
    buildFromAlgorithmJson: BuildFromAlgorithJsonFunction
}

export function curryBuildFromAlgorithmJsonFunction(

): BuildFromAlgorithJsonFunction {
    return (modelJson) => {
        const model = parseModelJsonToModel(modelJson);

        return Object.assign(
            {},
            getGetRiskToTime(model),
            getGetSurvivalToTime(model), 
            getToJson(modelJson),
            getAddRefPopWithAddLifeTable(model, modelJson),
            getWithDataAndCoxFunctions(
                {},
                {}, 
                model, 
                modelJson
            ),
            getWithCauseImpactWithCoxFunctions(
                model, modelJson
            ),
            getBaseAddAlgorithmFunction(
                model, modelJson
            ),
            getAddLifeTableWithAddRefPop(
                model, modelJson
            ),
            getBaseReplaceCauseImpactRef(model, modelJson)
        )
    }
}