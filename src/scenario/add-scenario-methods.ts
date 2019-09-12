import {
    Model,
    Data,
    ModelFactory,
    CoxSurvivalAlgorithm,
} from '../engine/model';
import { cloneDeep } from 'lodash';
import { findDatumWithName } from '../engine/data';
import { IScenarioConfig, ISexScenarioConfig, IScenarioVariables } from './scenario-config';
import moment = require('moment');

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
    // consider adding variables to model
    const sexVariable = 'DHH_SEX';
    let totalRisk = 0;

    // Create list of data that have been modified to calculate mean risk only on modified data
    population.forEach(individual => {
        const sex = Number(findDatumWithName(sexVariable, individual).coefficent);
        const algorithm = this.getAlgorithmForData(individual);

        let sexConfig: ISexScenarioConfig;
        if (sex === 1) sexConfig = scenarioConfig.male;
        else sexConfig = scenarioConfig.female;

        // Get list of variables that will be modified to ensure that we only clone individuals and
        // if the individuals will be modified
        const variablesToModify = filterVariables(individual, sexConfig.variables);

        totalRisk += calculateRiskForIndividual(individual, variablesToModify, algorithm, time);
    });

    return totalRisk / population.length;
}

function filterVariables(
    individual: Data,
    variables: IScenarioVariables[],
): IScenarioVariables[] {
    return variables.filter(variable => {
        let [min, max] = variable.targetPop;
        if (min === null) min = -Infinity;
        if (max === null) max = Infinity;
        const variableValue = Number(findDatumWithName(variable.variableName, individual).coefficent);

        return variableValue > min && variableValue < max;
    });
}

function calculateRiskForIndividual(
    individual: Data,
    variablesToModify: IScenarioVariables[],
    algorithm: CoxSurvivalAlgorithm,
    time?: Date | moment.Moment,
): number {
    if (variablesToModify.length > 0) {
        // Clone datum because we'll be modifying it for processing scenario risk
        const clonedDatum = cloneDeep(individual);

        variablesToModify.forEach(variable => {
            const matchingDatumVariable = clonedDatum.find(datumVariable =>
                datumVariable.name === variable.variableName
            );

            if (matchingDatumVariable) matchingDatumVariable.coefficent = variable.scenarioValue;
        });

        return algorithm.getRiskToTime(clonedDatum, time);
    } else {
        return algorithm.getRiskToTime(individual, time);
    }
}
