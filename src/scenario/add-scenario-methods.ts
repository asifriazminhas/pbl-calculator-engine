import { Model, Data, ModelFactory } from '../engine/model';
import { cloneDeep } from 'lodash';
import { findDatumWithName, IDatum } from '../engine/data';
import moment = require('moment');
import { IScenarioConfig } from './scenario-config';
import { ISexScenarioConfig } from './sex-scenario-config';
import {
    IScenarioVariable,
    ScenarioMethods,
    ICategoricalScenarioVariable,
} from './scenario-variable';
import { DerivedField } from '../engine/data-field/derived-field/derived-field';

export interface IScenarioModel extends Model {
    runScenarioForPopulation: typeof runScenarioForPopulation;
}

interface IVariablePrevalenceMap {
    [variableName: string]: number;
}

enum Sexes {
    male = 1,
    female = 2,
}

const sexVariable = 'DHH_SEX';

/**
 * Adds scenario methods to the model argument
 *
 * @export
 * @param {Model} model The Model argument to augment. Each algorithm
 * object within the model will be extended to add scenario methods
 * to it
 * @returns {IScenarioModel}
 */
export function addScenarioMethods(model: Model): IScenarioModel {
    return ModelFactory.extendModel(model, { runScenarioForPopulation });
}

function runScenarioForPopulation(
    this: IScenarioModel,
    population: Data[],
    scenarioConfig: IScenarioConfig,
    time?: Date | moment.Moment,
): number {
    // Clone population because we'll be modifying it for processing
    const clonedPopulation = cloneDeep(population);
    let totalRisk = 0;
    const variablePrevalenceMap: IVariablePrevalenceMap = {};

    // Iterate over population to calculate prevalences
    clonedPopulation.forEach(individual => {
        const algorithm = this.getAlgorithmForData(individual);
        const sexConfig = getScenarioConfigForSex(individual, scenarioConfig);

        sexConfig.variables.forEach(variable => {
            const { variableName } = variable;

            /* Try to find datum. If it doesn't exist, the field must be a derived field, and
            should be added to the individual. Do this with the absorbing variable too */
            try {
                findDatumWithName(variableName, individual);
            } catch (e) {
                const derivedVariable = algorithm.findDataField(
                    variableName,
                ) as DerivedField;
                individual.push({
                    name: variableName,
                    coefficent: derivedVariable.calculateCoefficent(
                        individual,
                        algorithm.userFunctions,
                        algorithm.tables,
                    ),
                });
            }

            // Increment the prevalence of this variable if individual is exposed. Only necessary for categorical vars
            if (
                isVariableWithinRange(individual, variable) &&
                isCategoricalMethod(variable)
            ) {
                const { absorbingVariable } = variable;
                const prevalence = variablePrevalenceMap[variableName] || 0;
                variablePrevalenceMap[variableName] = prevalence + 1;

                try {
                    findDatumWithName(absorbingVariable, individual);
                } catch (e) {
                    const derivedAbsorbingVariable = algorithm.findDataField(
                        absorbingVariable,
                    ) as DerivedField;
                    individual.push({
                        name: absorbingVariable,
                        coefficent: derivedAbsorbingVariable.calculateCoefficent(
                            individual,
                            algorithm.userFunctions,
                            algorithm.tables,
                        ),
                    });
                }
            }
        });
    });

    // Update prevalences to percentages
    Object.keys(variablePrevalenceMap).forEach(
        variable =>
            (variablePrevalenceMap[variable] =
                variablePrevalenceMap[variable] / clonedPopulation.length),
    );

    // Iterate over population and calculate individual risks
    clonedPopulation.forEach(individual => {
        const algorithm = this.getAlgorithmForData(individual);
        const sexConfig = getScenarioConfigForSex(individual, scenarioConfig);

        const scenarioVariablesToModify = sexConfig.variables.filter(variable =>
            isVariableWithinRange(individual, variable),
        );

        scenarioVariablesToModify.forEach(scenarioVariable => {
            const targetVariable = findDatumWithName(
                scenarioVariable.variableName,
                individual,
            );
            const targetVariablePrevalence =
                variablePrevalenceMap[scenarioVariable.variableName];

            const targetVariableCoefficient = Number(targetVariable.coefficent);
            const relativeChange = calculateRelativeChange(
                scenarioVariable,
                targetVariableCoefficient,
                targetVariablePrevalence,
            );

            runTargetVariableMethod(
                scenarioVariable,
                targetVariable,
                relativeChange,
            );

            if (isCategoricalMethod(scenarioVariable)) {
                const absorbingVariable = findDatumWithName(
                    scenarioVariable.absorbingVariable,
                    individual,
                );
                absorbingVariable.coefficent =
                    Number(absorbingVariable.coefficent) + relativeChange;
            }
        });

        totalRisk += algorithm.getRiskToTime(individual, time);
    });

    return totalRisk / clonedPopulation.length;
}

function isVariableWithinRange(
    individual: Data,
    scenarioVariable: IScenarioVariable,
): boolean {
    let [min, max] = scenarioVariable.targetPop;
    if (min === null) min = -Infinity;
    if (max === null) max = Infinity;
    const variableValue = Number(
        findDatumWithName(scenarioVariable.variableName, individual).coefficent,
    );

    return variableValue >= min && variableValue <= max;
}

/**
 * @description Update individual's variable value according to the variable method
 * @param scenarioVariable Scenario variable
 * @param targetVariable Individual's variable to be modified
 * @param targetVariablePrevalence Variables prevalence
 */
function runTargetVariableMethod(
    scenarioVariable: IScenarioVariable,
    targetVariable: IDatum,
    relativeChange: number,
): void {
    let updatedTargetValue = Number(targetVariable.coefficent);

    // Modify new values based on variable method
    switch (scenarioVariable.method) {
        case ScenarioMethods.AbsoluteScenario: {
            updatedTargetValue =
                updatedTargetValue + scenarioVariable.scenarioValue;
            break;
        }
        case ScenarioMethods.AttributionScenario: {
            updatedTargetValue = scenarioVariable.scenarioValue;
            break;
        }
        case ScenarioMethods.RelativeScenario: {
            updatedTargetValue =
                updatedTargetValue * scenarioVariable.scenarioValue;
            break;
        }
        case ScenarioMethods.AbsoluteScenarioCat:
        case ScenarioMethods.TargetScenarioCat: {
            updatedTargetValue = updatedTargetValue * (1 - relativeChange);
            break;
        }
        case ScenarioMethods.RelativeScenarioCat: {
            updatedTargetValue =
                updatedTargetValue * (1 - scenarioVariable.scenarioValue);
            break;
        }
    }

    if (scenarioVariable.postScenarioRange) {
        // Ensure new value is limited to be within scenario min/max range
        const [min, max] = scenarioVariable.postScenarioRange;

        if (updatedTargetValue < min) updatedTargetValue = min;
        else if (updatedTargetValue > max) updatedTargetValue = max;
    }

    targetVariable.coefficent = updatedTargetValue;
}

function isCategoricalMethod(
    scenarioVariable: IScenarioVariable,
): scenarioVariable is ICategoricalScenarioVariable {
    switch (scenarioVariable.method) {
        case ScenarioMethods.RelativeScenarioCat:
        case ScenarioMethods.TargetScenarioCat:
        case ScenarioMethods.AbsoluteScenarioCat:
            return true;
    }
    return false;
}

function getScenarioConfigForSex(
    individual: Data,
    scenarioConfig: IScenarioConfig,
): ISexScenarioConfig {
    const sex = Number(findDatumWithName(sexVariable, individual).coefficent);
    if (sex === Sexes.male) return scenarioConfig.male;
    else return scenarioConfig.female;
}

function calculateRelativeChange(
    scenarioVariable: IScenarioVariable,
    targetVariableCoefficient: number,
    targetVariablePrevalence: number,
): number {
    switch (scenarioVariable.method) {
        case ScenarioMethods.AbsoluteScenarioCat: {
            const updatedPrevalence =
                targetVariableCoefficient + scenarioVariable.scenarioValue;
            return (
                (updatedPrevalence - targetVariablePrevalence) /
                targetVariablePrevalence
            );
        }
        case ScenarioMethods.TargetScenarioCat: {
            return (
                (targetVariableCoefficient - targetVariablePrevalence) /
                targetVariablePrevalence
            );
        }
        default:
            return 0;
    }
}
