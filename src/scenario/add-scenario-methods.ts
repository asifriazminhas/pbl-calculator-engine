import {
    Model,
    Data,
    ModelFactory,
} from '../engine/model';
import { cloneDeep } from 'lodash';
import { findDatumWithName, IDatum } from '../engine/data';
import moment = require('moment');
import { IScenarioConfig } from './scenario-config';
import { ISexScenarioConfig } from './sex-scenario-config';
import { IScenarioVariable, ScenarioMethods, ICategoricalScenarioVariable } from './scenario-variable';
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
export function addScenarioMethods(
    model: Model,
): IScenarioModel {
    return ModelFactory.extendModel(
        model,
        { runScenarioForPopulation },
    );
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
        const sexConfig = getIndividualsSexConfig(individual, scenarioConfig);

        sexConfig.variables.forEach(variable => {
            const { variableName } = variable;

            /* Try to find datum. If it doesn't exist, the field must be a derived field, and
            should be added to the individual. Do this with the absorbing variable too */
            try {
                findDatumWithName(variableName, individual);
            } catch (e) {
                const derivedVariable = algorithm.findDataField(variableName) as DerivedField;
                individual.push({
                    name: variableName,
                    coefficent: derivedVariable.calculateCoefficent(individual, {}, {}),
                });
            }

            // Increment the prevalence of this variable if individual is exposed
            if (isVariableWithinRange(individual, variable)) {
                const prevalence = variablePrevalenceMap[variableName] || 0;
                variablePrevalenceMap[variableName] = prevalence + 1;

                if (isCategoricalMethod(variable)) {
                    const { absorbingVariable } = variable;

                    try {
                        findDatumWithName(absorbingVariable, individual);
                    } catch (e) {
                        const derivedAbsorbingVariable = algorithm
                            .findDataField(absorbingVariable) as DerivedField;
                        individual.push({
                            name: absorbingVariable,
                            coefficent: derivedAbsorbingVariable.calculateCoefficent(individual, {}, {}),
                        });

                        const absorbingPrevalence = variablePrevalenceMap[absorbingVariable] || 0;
                        variablePrevalenceMap[absorbingVariable] = absorbingPrevalence + 1;
                    }
                }
            }
        });
    });

    // Update prevalences to percentages
    Object.keys(variablePrevalenceMap).forEach(variable =>
        variablePrevalenceMap[variable] /= clonedPopulation.length
    );

    // Iterate over population and calculate individual risks
    clonedPopulation.forEach(individual => {
        const algorithm = this.getAlgorithmForData(individual);
        const sexConfig = getIndividualsSexConfig(individual, scenarioConfig);

        const variablesToModify = filterVariables(individual, sexConfig.variables);

        variablesToModify.forEach(variable => {
            if (isVariableWithinRange(individual, variable)) {
                const targetVariable = findDatumWithName(variable.variableName, individual);
                const targetVariablePrevalence = variablePrevalenceMap[variable.variableName];

                runTargetVariableMethod(variable, targetVariable, targetVariablePrevalence);

                if (isCategoricalMethod(variable)) {
                    const absorbingVariable = findDatumWithName(variable.absorbingVariable, individual);

                    const absorbingPrevalence = variablePrevalenceMap[absorbingVariable.name];

                    runAbsorbingVariableMethod(variable, absorbingVariable, absorbingPrevalence);
                }
            }
        });

        totalRisk += algorithm.getRiskToTime(individual, time);
    });

    return totalRisk / clonedPopulation.length;
}

/**
 * @description Build list of variables that should be modified for the individual
 * @param individual Individual
 * @param scenarioVariables Scenario variables
 */
function filterVariables(
    individual: Data,
    scenarioVariables: IScenarioVariable[],
): IScenarioVariable[] {
    return scenarioVariables.filter(variable => isVariableWithinRange(individual, variable));
}

function isVariableWithinRange(
    individual: Data,
    variable: IScenarioVariable,
): boolean {
    let [min, max] = variable.targetPop;
    if (min === null) min = -Infinity;
    if (max === null) max = Infinity;
    const variableValue = Number(findDatumWithName(variable.variableName, individual).coefficent);

    return variableValue >= min && variableValue <= max;
}

/**
 * @description Update individual's variable value according to the variable method
 * @param variable Scenario variable
 * @param targetVariable Individual's variable to be modified
 * @param targetVariablePrevalence Variables prevalence
 */
function runTargetVariableMethod(
    variable: IScenarioVariable,
    targetVariable: IDatum,
    targetVariablePrevalence: number,
): void {
    let updatedTargetValue = Number(targetVariable.coefficent);

    // Modify new values based on variable method
    switch (variable.method) {
        case ScenarioMethods.AbsoluteScenario: {
            updatedTargetValue += variable.scenarioValue;
            break;
        }
        case ScenarioMethods.AttributionScenario: {
            updatedTargetValue = variable.scenarioValue;
            break;
        }
        case ScenarioMethods.RelativeScenario: {
            updatedTargetValue *= variable.scenarioValue;
            break;
        }
        case ScenarioMethods.AbsoluteScenarioCat: {
            const updatedPrevalence = variable.scenarioValue / targetVariablePrevalence;
            const relativeChange = updatedTargetValue - (updatedTargetValue * updatedPrevalence);
            updatedTargetValue = updatedTargetValue * (1 - relativeChange);
            break;
        }
        case ScenarioMethods.TargetScenarioCat: {
            const relativeChange = updatedTargetValue * (variable.scenarioValue / targetVariablePrevalence);
            updatedTargetValue = updatedTargetValue * (1 - relativeChange);
            break;
        }
        case ScenarioMethods.RelativeScenarioCat: {
            const relativeChange = updatedTargetValue - (updatedTargetValue * variable.scenarioValue);
            updatedTargetValue = updatedTargetValue * (1 - relativeChange);
            break;
        }
    }

    if (isCategoricalMethod(variable)) {
        if (variable.postScenarioRange) {
            // Ensure new value is limited to be within scenario min/max range
            const [min, max] = variable.postScenarioRange;

            if (updatedTargetValue < min) updatedTargetValue = min;
            else if (updatedTargetValue > max) updatedTargetValue = max;
        }
    }

    targetVariable.coefficent = updatedTargetValue;
}

/**
 * @description Update individual's variable value according to the variable method
 * @param variable Scenario variable
 * @param absorbingVariable Absorbing variable to be modified
 * @param absorbingVariablePrevalence Absorbing variable prevalence
 */
function runAbsorbingVariableMethod(
    variable: IScenarioVariable,
    absorbingVariable: IDatum,
    absorbingVariablePrevalence: number,
): void {
    let updatedAbsorbingValue = Number(absorbingVariable.coefficent);

    // Modify new values based on variable method
    switch (variable.method) {
        case ScenarioMethods.AbsoluteScenario: {
            updatedAbsorbingValue += variable.scenarioValue;
            break;
        }
        case ScenarioMethods.AttributionScenario: {
            updatedAbsorbingValue = variable.scenarioValue;
            break;
        }
        case ScenarioMethods.RelativeScenario: {
            updatedAbsorbingValue *= variable.scenarioValue / 100;
            break;
        }
        case ScenarioMethods.AbsoluteScenarioCat: {
            const updatedPrevalence = variable.scenarioValue / absorbingVariablePrevalence;
            const relativeChange = updatedAbsorbingValue - (updatedAbsorbingValue * updatedPrevalence);
            updatedAbsorbingValue = updatedAbsorbingValue + relativeChange;
            break;
        }
        case ScenarioMethods.TargetScenarioCat: {
            const relativeChange = updatedAbsorbingValue * (variable.scenarioValue / absorbingVariablePrevalence);
            updatedAbsorbingValue = updatedAbsorbingValue + relativeChange;
            break;
        }
        case ScenarioMethods.RelativeScenarioCat: {
            const relativeChange = updatedAbsorbingValue - (updatedAbsorbingValue * variable.scenarioValue);
            updatedAbsorbingValue = updatedAbsorbingValue + relativeChange;
            break;
        }
    }

    absorbingVariable.coefficent = updatedAbsorbingValue;
}

function isCategoricalMethod(
    scenarioVariable: IScenarioVariable,
): scenarioVariable is ICategoricalScenarioVariable {
    switch (scenarioVariable.method) {
        case ScenarioMethods.RelativeScenarioCat:
        case ScenarioMethods.TargetScenarioCat:
        case ScenarioMethods.AbsoluteScenarioCat: return true;
    }
    return false;
}

function getIndividualsSexConfig(
    individual: Data,
    scenarioConfig: IScenarioConfig
): ISexScenarioConfig {
    const sex = Number(findDatumWithName(sexVariable, individual).coefficent);
    if (sex === Sexes.male) return scenarioConfig.male;
    else return scenarioConfig.female;
}
