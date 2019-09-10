import {
    Model,
    Data,
    ModelFactory,
} from '../engine/model';
import { cloneDeep } from 'lodash';
import { findDatumWithName } from '../engine/data';
import { IScenarioConfig, ISexScenarioConfig } from './scenario-config';
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
    this: Model,
    data: Data[],
    scenarioConfig: IScenarioConfig,
    time?: Date | moment.Moment,
): number {
    // consider adding to model
    const sexVariable = 'DHH_SEX';
    const weightVariable = 'WTS_M';
    let totalRisk = 0;

    // Create list of data that have been modified to calculate mean risk only on modified data
    const modifiedData = data.filter(datum => {
        const sex = Number(findDatumWithName(sexVariable, datum).coefficent);

        let sexConfig: ISexScenarioConfig;
        if (sex === 1) sexConfig = scenarioConfig.male;
        else sexConfig = scenarioConfig.female;

        // Get list of variables that will be modified to ensure that we only clone datum and
        // calculate original risk if the datum will be modified
        const variablesToModify = sexConfig.variables.filter(variable => {
            let [min, max] = variable.targetPopulation;
            if (min === null) min = -Infinity;
            if (max === null) max = Infinity;
            const variableValue = Number(findDatumWithName(variable.variableName, datum).coefficent);

            return variableValue > min && variableValue < max;
        });

        if (variablesToModify.length > 0) {
            // Clone datum because we'll be modifying it for processing scenario risk
            const clonedDatum = cloneDeep(datum);
            const weight = Number(findDatumWithName(weightVariable, datum).coefficent);

            variablesToModify.forEach(variable => {
                const matchingDatumVariable = clonedDatum.find(datumVariable =>
                    datumVariable.name === variable.variableName
                );

                if (matchingDatumVariable) matchingDatumVariable.coefficent = variable.setValue;
            });

            const originalRisk = this.getAlgorithmForData(datum).getRiskToTime(datum, time) * weight;
            const scenarioRisk = this.getAlgorithmForData(datum).getRiskToTime(clonedDatum, time) * weight;
            totalRisk += scenarioRisk - originalRisk;
            return true;
        }

        return false;
    });

    // Prevent returning NaN if no data was modified
    if (modifiedData.length === 0) return 0;
    return totalRisk / modifiedData.length;
}
