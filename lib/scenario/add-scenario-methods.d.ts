import { Model, Data, CoxSurvivalAlgorithm } from '../engine/model';
import moment from 'moment';
import { IScenario } from './scenario';
export interface IScenarioModel extends Model<CoxSurvivalAlgorithm> {
    runScenarioForPopulation: typeof runScenarioForPopulation;
    runScenariosForPopulation: typeof runScenariosForPopulation;
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
export declare function addScenarioMethods(model: Model<CoxSurvivalAlgorithm>): IScenarioModel;
declare function runScenarioForPopulation(this: IScenarioModel, population: Data[], scenario: IScenario, time?: Date | moment.Moment): number;
declare function runScenariosForPopulation(this: IScenarioModel, population: Data[], scenarios: IScenario[], time?: Date | moment.Moment): number;
export {};
