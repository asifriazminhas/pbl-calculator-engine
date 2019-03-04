import { Data } from '../data';
import { CoxSurvivalAlgorithm } from '../algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm';
export interface IRefLifeTableRow {
    age: number;
    ax: number;
    ex: number;
    qx: number;
}
export declare type RefLifeTable = IRefLifeTableRow[];
export interface IGenderSpecificRefLifeTable {
    male: RefLifeTable;
    female: RefLifeTable;
}
export interface ICompleteLifeTableRow extends IRefLifeTableRow {
    lx: number;
    dx: number;
    Lx: number;
    Tx: number;
    qx: number;
}
export declare type CompleteLifeTable = ICompleteLifeTableRow[];
export declare type GetPredictedRiskForAge = (age: number) => number;
/**
 * Creates a new life table from the baseLifeTableWithQx which has only age, qx
 * and ax terms and completes it by adding lx, dx, Lx, Tx and ex terms
 *
 * @param {Array<BaseLifeTableWithQxRow>} baseLifeTableWithQx
 * @returns {Array<LifeTableRow>}
 */
export declare function getCompleteLifeTableWithStartAge(refLifeTable: RefLifeTable, getPredictedRiskForAge: GetPredictedRiskForAge, startAge: number, useLifeTableForExFromAge?: number): CompleteLifeTable;
export declare function getCompleteLifeTableForDataUsingAlgorithm(refLifeTable: RefLifeTable, data: Data, cox: CoxSurvivalAlgorithm, useExFromLifeTableFromAge?: number, getPredictedRiskForAge?: (age: number) => number): CompleteLifeTable;
