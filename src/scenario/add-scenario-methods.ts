import {
    Model,
    Data,
    ModelFactory,
    CoxSurvivalAlgorithm,
} from '../engine/model';
import { cloneDeep } from 'lodash';
import { findDatumWithName, IDatum } from '../engine/data';
import moment = require('moment');
import { IScenarioConfig } from './scenario-config';
import { ISexScenarioConfig } from './sex-scenario-config';
import { IScenarioVariable, ScenarioMethods, ICategoricalScenarioVariable } from './scenario-variable';

export interface IScenarioModel extends Model {
    runScenarioForPopulation: typeof runScenarioForPopulation;
}

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
    // consider adding variables to model
    const sexVariable = 'DHH_SEX';
    let totalRisk = 0;

    // Iterate over population and calculate individual risks
    clonedPopulation.forEach(individual => {
        const sex = Number(findDatumWithName(sexVariable, individual).coefficent);
        const algorithm = this.getAlgorithmForData(individual);

        let sexConfig: ISexScenarioConfig;
        if (sex === 1) sexConfig = scenarioConfig.male;
        else sexConfig = scenarioConfig.female;

        const variablesToModify = filterVariables(individual, sexConfig.variables);
        totalRisk += calculateRiskForIndividual(individual, variablesToModify, algorithm, time);
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
    return scenarioVariables.filter(variable => {
        let [min, max] = variable.targetPop;
        if (min === null) min = -Infinity;
        if (max === null) max = Infinity;
        const variableValue = Number(findDatumWithName(variable.variableName, individual).coefficent);

        return variableValue > min && variableValue < max;
    });
}

function calculateRiskForIndividual(
    individual: Data,
    variablesToModify: IScenarioVariable[],
    algorithm: CoxSurvivalAlgorithm,
    time?: Date | moment.Moment,
): number {
    variablesToModify.forEach(variable => {
        /**
         * If variable specifies an absorbing variable to be changed, select that variable to be modified.
         * Otherwise, modify matching `variableName` variable
         */
        let targetIndividualVariable: IDatum | undefined;
        if (isCategoricalMethod(variable)) {
            targetIndividualVariable = individual.find(datumVariable =>
                datumVariable.name === variable.absorbingVariable
            );
        } else {
            targetIndividualVariable = individual.find(datumVariable =>
                datumVariable.name === variable.variableName
            );
        }

        if (targetIndividualVariable) runVariableMethod(variable, targetIndividualVariable);
    });

    return algorithm.getRiskToTime(individual, time);
}

/**
 * @description Update individual's variable value according to the variable method
 * @param variable Scenario variable
 * @param individualVariable Individual's variable to be modified
 */
function runVariableMethod(
    variable: IScenarioVariable,
    individualVariable: IDatum,
): void {
    let updatedIndividualValue = individualVariable.coefficent as number;

    // Modify new value based on variable method
    switch (variable.method) {
        case ScenarioMethods.AbsoluteScenario:
        case ScenarioMethods.AbsoluteScenarioCat: {
            updatedIndividualValue += variable.scenarioValue;
            break;
        }
        case ScenarioMethods.AttributionScenario:
        case ScenarioMethods.TargetScenarioCat: {
            updatedIndividualValue = variable.scenarioValue;
            break;
        }
        case ScenarioMethods.RelativeScenario:
        case ScenarioMethods.RelativeScenarioCat: {
            updatedIndividualValue *= variable.scenarioValue / 100;
            break;
        }
    }

    if (isCategoricalMethod(variable)) {
        if (variable.postScenarioRange) {
            // Ensure new value is limited to be within scenario min/max range
            const [min, max] = variable.postScenarioRange;
            if (variable.method === ScenarioMethods.AbsoluteScenarioCat) {
                variable.absorbingVariable.toString();
            }

            if (updatedIndividualValue < min) updatedIndividualValue = min;
            else if (updatedIndividualValue > max) updatedIndividualValue = max;
        }
    }

    individualVariable.coefficent = updatedIndividualValue;
}

function isCategoricalMethod(
    scenarioVariable: IScenarioVariable
): scenarioVariable is ICategoricalScenarioVariable {
    switch (scenarioVariable.method) {
        case ScenarioMethods.RelativeScenarioCat:
        case ScenarioMethods.TargetScenarioCat:
        case ScenarioMethods.AbsoluteScenarioCat: return true;
    }
    return false;
}
