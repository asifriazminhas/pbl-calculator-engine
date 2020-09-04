import { Model, CoxSurvivalAlgorithm } from '../model';
import { Data } from '../data';
/**
 * Base class for Life Expectancy and related calculations
 *
 * @export
 * @abstract
 * @class LifeExpectancy
 * @template T An interface which defines the row in the reference life table
 * used by the implementation class
 */
export declare abstract class LifeExpectancy<T extends IBaseRefLifeTableRow> {
    model: Model<CoxSurvivalAlgorithm>;
    constructor(model: Model<CoxSurvivalAlgorithm>);
    /**
     *
     *
     * @protected
     * @param {(Array<T & { qx: number; nx: number }>)} refLifeTableWithQxAndNx
     * The life table this method will complete. Each row of
     * this life table should have the fields:
     * 2. qx
     * 3. nx
     * along with the fields defined in the T generic of this class
     * @param {number} maxAge The age value we should use in the spline formula
     * to get the value of Tx for the last life table row. This is the age
     * of the life table row immediately following the last one whose qx value
     * is valid
     * @param {number} knotAges Age values to be used in the formula
     * for calculating the second knot. Should be the age value in the last
     * row of the life table followed by the age value in the row before
     * @returns {(Array<ICompleteLifeTableRow & T>)}
     * @memberof LifeExpectancy
     */
    protected getCompleteLifeTable(refLifeTableWithQxAndNx: Array<T & {
        qx: number;
        nx: number;
    }>, maxAge: number): Array<ICompleteLifeTableRow & T>;
    /**
     * Returns the qx value to use in the life table represented by the data
     * argument
     *
     * @protected
     * @param {Data} data
     * @returns
     * @memberof LifeExpectancy
     */
    protected getQx(data: Data): number;
    protected getLifeExpectancyForAge(completeLifeTable: Array<T & ICompleteLifeTableRow>, age: number): number;
    /**
     * Returns the life table row found in the completeLifeTable arg for the
     * age arg or undefined if no row was found
     *
     * @protected
     * @abstract
     * @template U An interface representing a complete life table row along
     * with the fields in the row of the reference life table used by the
     * implementation class
     * @param {U[]} completeLifeTable
     * @param {number} age
     * @returns {(U | undefined)}
     * @memberof LifeExpectancy
     */
    protected abstract getLifeTableRowForAge(completeLifeTable: Array<T & ICompleteLifeTableRow>, age: number): (T & ICompleteLifeTableRow) | undefined;
    protected abstract getFirstTxValue(lifeTable: Array<T & {
        Lx: number;
        lx: number;
    }>, maxAge: number): number;
}
export interface IBaseRefLifeTableRow {
    ax: number;
}
export interface ICompleteLifeTableRow extends IBaseRefLifeTableRow {
    ex: number;
    qx: number;
    lx: number;
    dx: number;
    Lx: number;
    Tx: number;
    nx: number;
}
