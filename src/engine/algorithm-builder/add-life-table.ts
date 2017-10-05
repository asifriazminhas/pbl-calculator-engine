import { GetRiskToTime, getGetRiskToTime, GetSurvivalToTime, getGetSurvivalToAge, GetLifeExpectancy, getGetLifeExpectancy, GetLifeYearsLost, getGetLifeYearsLost, GetHealthAge, getGetHealthAge, GetSurvivalToAge, getGetSurvivalToTime, WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction, getWithCauseImpactWithCoxFunctionsAndLifeExpectancyFunctions } from '../algorithm-evaluator';
import { RefLifeTable } from '../life-table';
import { ToJson, getToJson } from './to-json';
import { AddRefPopWithAddLifeTableFunctions, getAddRefPopWithAddLifeTableFunctions } from './add-ref-pop';
import { ReferencePopulation } from '../health-age/reference-population';
import { WithDataAndCoxFunctionsAndLifeTableFunctions, getWithDataAndCoxFunctionsAndLifeTableFunctions, CompleteWithData, getCompleteWithData } from '../algorithm-evaluator';
import { AddAlgorithmWithLifeTableFunctions, getAddAlgorithmWithLifeTableFunctions, AddAlgorithmWithGetHealthAgeAndLifeTableFunctions, getAddAlgorithmWithGetHealthAgeAndLifeTableFunctions } from './add-algorithm';
import { CauseImpactRefTypes } from '../cause-impact';
import { ReplaceCauseImpactRefWithLifeTableFunctions, getReplaceCauseImpactRefWithLifeTableFunctions, FullReplaceCauseImpactRef, getFullReplaceCauseImpactRef } from './replace-cause-impact-ref';
import { ModelTypes, JsonModelTypes } from '../model';

export type AddLifeTableEvaluatorFunctions = GetLifeExpectancy & GetLifeYearsLost & GetSurvivalToAge;

export type AddLifeTableFunction<T extends AddRefPopWithAddLifeTableFunctions | GetHealthAge, U extends WithDataAndCoxFunctionsAndLifeTableFunctions<{}> | CompleteWithData<{}>, V extends AddAlgorithmWithLifeTableFunctions | AddAlgorithmWithGetHealthAgeAndLifeTableFunctions,
W extends ReplaceCauseImpactRefWithLifeTableFunctions | FullReplaceCauseImpactRef> = (lifeTable: RefLifeTable) => GetSurvivalToTime & GetRiskToTime & AddLifeTableEvaluatorFunctions & WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction & ToJson & T & U & V & W;

export interface AddLifeTableWithAddRefPop {
    addLifeTable: AddLifeTableFunction<AddRefPopWithAddLifeTableFunctions, WithDataAndCoxFunctionsAndLifeTableFunctions<{}>, AddAlgorithmWithLifeTableFunctions, ReplaceCauseImpactRefWithLifeTableFunctions>;
}
export interface AddLifeTableWithGetHealthAge {
    addLifeTable: AddLifeTableFunction<GetHealthAge, CompleteWithData<{}>, AddAlgorithmWithGetHealthAgeAndLifeTableFunctions, FullReplaceCauseImpactRef>;
}

export function getAddLifeTableWithAddRefPop(
    model: ModelTypes,
    modelJson: JsonModelTypes,
    causeImpactRef?: CauseImpactRefTypes
): AddLifeTableWithAddRefPop {
    return {
        addLifeTable: (lifeTable) => {
            return Object.assign(
                {},
                getGetRiskToTime(model),
                getGetSurvivalToTime(model),
                getGetSurvivalToAge(model, lifeTable),
                getGetLifeExpectancy(model, lifeTable),
                getGetLifeYearsLost(
                    model, modelJson, lifeTable, causeImpactRef),
                getToJson(modelJson),
                getAddRefPopWithAddLifeTableFunctions(
                    model, modelJson, lifeTable, causeImpactRef
                ),
                getWithDataAndCoxFunctionsAndLifeTableFunctions(
                    {}, 
                    {}, 
                    model,
                    modelJson,
                    lifeTable,
                    causeImpactRef
                ),
                getWithCauseImpactWithCoxFunctionsAndLifeExpectancyFunctions(
                    model, 
                    modelJson,
                    lifeTable,
                    undefined,
                    causeImpactRef
                ),
                getAddAlgorithmWithLifeTableFunctions(
                    model,
                    lifeTable,
                    modelJson,
                    causeImpactRef
                ),
                getReplaceCauseImpactRefWithLifeTableFunctions(
                    model,
                    lifeTable,
                    modelJson
                )
            )
        }
    }
}

export function getAddLifeTableWithGetHealthAge(
    model: ModelTypes,
    modelJson: JsonModelTypes,
    refPop: ReferencePopulation,
    causeImpactRef?: CauseImpactRefTypes
): AddLifeTableWithGetHealthAge {
    return {
        addLifeTable: (lifeTable) => {
            return Object.assign(
                {},
                getGetRiskToTime(model),
                getGetSurvivalToAge(model, lifeTable),
                getGetSurvivalToTime(model),
                getGetHealthAge(refPop, model),
                getGetLifeExpectancy(model, lifeTable),
                getGetLifeYearsLost(
                    model, modelJson, lifeTable, causeImpactRef),
                getToJson(modelJson),
                getCompleteWithData(
                    {}, 
                    {}, 
                    model,
                    modelJson,
                    refPop,
                    lifeTable,
                    causeImpactRef
                ),
                getWithCauseImpactWithCoxFunctionsAndLifeExpectancyFunctions(
                    model,
                    modelJson,
                    lifeTable,
                    undefined,
                    causeImpactRef
                ),
                getAddAlgorithmWithGetHealthAgeAndLifeTableFunctions(
                    model,
                    modelJson,
                    refPop,
                    lifeTable,
                    undefined,
                    causeImpactRef
                ),
                getFullReplaceCauseImpactRef(
                    model,
                    modelJson,
                    lifeTable,
                    refPop
                )
            )
        }
    }
}
 
