export interface BaseLifeTableRow {
    age: number;
    ax: number;
    ex: number;
}
export declare type GetPredictedRiskForAge = (age: number) => number;
/**
 * Returns the life expectancy at the age argument using the getPredictedRiskForAge argument to generate the lifetable from the baseLifeTable
 *
 * @export
 * @param {number} age
 * @param {GetPredictedRiskForAge} getPredictedRiskForAge Function which takes age and returns the calculated risk. Used to set the qx field in the generated life table
 * @param {Array<BaseLifeTableRow>} baseLifeTable
 * @returns {number}
 */
export declare function getLifeExpectancy(age: number, getPredictedRiskForAge: GetPredictedRiskForAge, baseLifeTable: Array<BaseLifeTableRow>, useExFromLifeTableFromAge: number): number;
