import { CompleteLifeTable, RefLifeTable } from './life-table';
import { Data } from '../data';
import { Cox } from '../cox';
/**
 * Returns the life expectancy at the age argument using the passed lifeTable argument
 *
 * @param {number} age
 * @param {Array<LifeTableRow>} lifeTable
 * @returns {number}
 */
export declare function getLifeExpectancyForAge(age: number, lifeTable: CompleteLifeTable): number;
export declare function getCompleteLifeTableForDataUsingAlgorithm(refLifeTable: RefLifeTable, data: Data, cox: Cox, useExFromLifeTableFromAge?: number): CompleteLifeTable;
export declare function getLifeExpectancyUsingRefLifeTable(data: Data, refLifeTable: RefLifeTable, coxAlgorithm: Cox, useExFromLifeTableFromAge?: number, completeLifeTable?: CompleteLifeTable): number;
