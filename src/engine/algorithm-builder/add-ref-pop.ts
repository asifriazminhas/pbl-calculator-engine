import { GetSurvivalToTime, getGetSurvivalToTime, GetRiskToTime, getGetRiskToTime, getGetLifeYearsLost, getGetLifeExpectancy, GetHealthAge, getGetHealthAge, getGetSurvivalToAge, WithCauseImpactWithCoxFunctions, getWithCauseImpactWithCoxFunctions, WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction, getWithCauseImpactWithCoxFunctionsAndLifeExpectancyFunctions } from '../algorithm-evaluator';
import { AddLifeTableWithGetHealthAge, getAddLifeTableWithGetHealthAge, AddLifeTableEvaluatorFunctions } from './add-life-table';
import { ToJson, getToJson } from './to-json';
import { ReferencePopulation } from '../health-age/reference-population';
import { RefLifeTable } from '../life-table';
import { WithDataAndCoxFunctionsAndAddRefPopFunctions, getWithDataAndCoxFunctionsAndAddRefPopFunctions, CompleteWithData, getCompleteWithData } from '../algorithm-evaluator';
import { AddAlgorithmReturnsGetHealthAge, getAddAlgorithmReturnsGetHealthAgeFunction, AddAlgorithmWithGetHealthAgeAndLifeTableFunctions,getAddAlgorithmWithGetHealthAgeAndLifeTableFunctions } from './add-algorithm';
import { CauseImpactRefTypes } from '../cause-impact';
import { ReplaceCauseImpactRefWithAddRefPopFunctions, getReplaceCauseImpactRefWithAddRefPopFunctions, FullReplaceCauseImpactRef, getFullReplaceCauseImpactRef} from './replace-cause-impact-ref';
import { ModelTypes, JsonModelTypes } from '../model';

export type AddRefPopFunction<T extends AddLifeTableWithGetHealthAge | AddLifeTableEvaluatorFunctions, U extends WithDataAndCoxFunctionsAndAddRefPopFunctions<{}> | CompleteWithData<{}>, V extends AddAlgorithmReturnsGetHealthAge | AddAlgorithmWithGetHealthAgeAndLifeTableFunctions,
W extends WithCauseImpactWithCoxFunctions | WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction,
X extends ReplaceCauseImpactRefWithAddRefPopFunctions | FullReplaceCauseImpactRef> = (
    refPop: ReferencePopulation
) => GetSurvivalToTime & GetRiskToTime & ToJson & GetHealthAge & T & U & V & W & X;

export interface AddRefPopWithAddLifeTable {
    addRefPop: AddRefPopFunction<AddLifeTableWithGetHealthAge, WithDataAndCoxFunctionsAndAddRefPopFunctions<{}>, AddAlgorithmReturnsGetHealthAge, WithCauseImpactWithCoxFunctions, ReplaceCauseImpactRefWithAddRefPopFunctions>;
}

export interface AddRefPopWithAddLifeTableFunctions {
    addRefPop: AddRefPopFunction<AddLifeTableEvaluatorFunctions, CompleteWithData<{}>, AddAlgorithmWithGetHealthAgeAndLifeTableFunctions, WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction, FullReplaceCauseImpactRef>;
}

export function getAddRefPopWithAddLifeTable(
    model: ModelTypes,
    modelJson: JsonModelTypes,
    causeImpactRef?: CauseImpactRefTypes
): AddRefPopWithAddLifeTable {
    return {
        addRefPop: (refPop) => {
            return Object.assign(
                {},
                getGetRiskToTime(model),
                getGetSurvivalToTime(model),
                getGetHealthAge(refPop, model),
                getToJson(modelJson),
                getAddLifeTableWithGetHealthAge(
                    model, modelJson, refPop, causeImpactRef),
                getWithDataAndCoxFunctionsAndAddRefPopFunctions(
                    {}, 
                    {}, 
                    model,
                    modelJson,
                    refPop,
                    causeImpactRef
                ),
                getWithCauseImpactWithCoxFunctions(
                    model,
                    modelJson,
                    causeImpactRef
                ),
                getAddAlgorithmReturnsGetHealthAgeFunction(
                    model,
                    modelJson,
                    refPop,
                    causeImpactRef
                ),
                getReplaceCauseImpactRefWithAddRefPopFunctions(
                    model,
                    modelJson,
                    refPop
                )
            )
        }
    }
}

export function getAddRefPopWithAddLifeTableFunctions(
    model: ModelTypes,
    modelJson: JsonModelTypes,
    refLifeTable: RefLifeTable,
    causeImpactRef?: CauseImpactRefTypes
): AddRefPopWithAddLifeTableFunctions {
    return {
        addRefPop: (refPop) => {
            return Object.assign(
                {},
                getGetRiskToTime(model),
                getGetSurvivalToTime(model),
                getGetSurvivalToAge(model, refLifeTable),
                getGetHealthAge(refPop, model),
                getGetLifeExpectancy(model, refLifeTable),
                getGetLifeYearsLost(
                    model, modelJson, refLifeTable, causeImpactRef),
                getToJson(modelJson),
                getCompleteWithData(
                    {}, 
                    {}, 
                    model,
                    modelJson,
                    refPop, 
                    refLifeTable,
                    causeImpactRef
                ),
                getWithCauseImpactWithCoxFunctionsAndLifeExpectancyFunctions(
                    model,
                    modelJson,
                    refLifeTable,
                    undefined,
                    causeImpactRef
                ),
                getAddAlgorithmWithGetHealthAgeAndLifeTableFunctions(
                    model,
                    modelJson,
                    refPop,
                    refLifeTable,
                    undefined,
                    causeImpactRef
                ),
                getFullReplaceCauseImpactRef(
                    model,
                    modelJson,
                    refLifeTable,
                    refPop,
                    undefined
                )
            )
        }
    }
}