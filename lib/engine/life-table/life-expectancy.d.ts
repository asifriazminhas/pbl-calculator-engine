import { CompleteLifeTable, RefLifeTable } from './life-table';
import { Data } from '../data';
import { CoxSurvivalAlgorithm } from '../algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm';
/**
 * Returns the life expectancy at the age argument using the passed lifeTable argument
 *
 * @param {number} age
 * @param {Array<LifeTableRow>} lifeTable
 * @returns {number}
 */
export declare function getLifeExpectancyForAge(age: number, lifeTable: CompleteLifeTable): number;
export declare function getLifeExpectancyUsingRefLifeTable(data: Data, refLifeTable: RefLifeTable, coxAlgorithm: CoxSurvivalAlgorithm, useExFromLifeTableFromAge?: number, completeLifeTable?: CompleteLifeTable): number;
