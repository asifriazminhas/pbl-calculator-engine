import { Model } from '../model';
import * as moment from 'moment';
import { Data } from '../data';
import { throwErrorIfUndefined } from '../../util/undefined';

/**
 * Base class for Life Expectancy and related calculations
 *
 * @export
 * @abstract
 * @class LifeExpectancy
 * @template T An interface which defines the row in the reference life table
 * used by the implementation class
 */
export abstract class LifeExpectancy<T extends IBaseRefLifeTableRow> {
    model: Model;
    knots: [number, number];

    constructor(model: Model, knots: [number, number]) {
        this.model = model;
        this.knots = knots;
    }

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
     * @returns {(Array<ICompleteLifeTableRow & T>)}
     * @memberof LifeExpectancy
     */
    protected getCompleteLifeTable(
        refLifeTableWithQxAndNx: Array<T & { qx: number; nx: number }>,
        maxAge: number,
    ): Array<ICompleteLifeTableRow & T> {
        const indexOfLifeTableRowForMaxAge = refLifeTableWithQxAndNx.indexOf(
            throwErrorIfUndefined(
                this.getLifeTableRowForAge(refLifeTableWithQxAndNx, maxAge),
                new Error(`No life table row found for age ${maxAge}`),
            ),
        );
        // The complete life table we will return at the end
        const completeLifeTable = refLifeTableWithQxAndNx
            // We only need the first row and row which is applicable for the
            // maxAge arg
            .slice(0, indexOfLifeTableRowForMaxAge + 1)
            // Extend each row of the life table and set the lx, dx, Lx, Tx and
            // ex fields to -1. They will be filled in later
            .map(lifeTableRow => {
                return Object.assign({}, lifeTableRow, {
                    lx: -1,
                    dx: -1,
                    Lx: -1,
                    Tx: -1,
                    ex: -1,
                });
            });

        const lxForFirstRow = 100000;
        // Populate the lx, dx and Lx values in the life table
        completeLifeTable.forEach((lifeTableRow, index, abridgedLifeTable) => {
            // For the first lx value set it to lxForFirstRow
            // Otherwise previousRowlx  - dx
            lifeTableRow.lx =
                index === 0
                    ? lxForFirstRow
                    : abridgedLifeTable[index - 1].lx -
                      abridgedLifeTable[index - 1].dx;
            lifeTableRow.dx = lifeTableRow.lx * lifeTableRow.qx;
            // Lx = nx*(lx-dx) + ax*dx*nx
            lifeTableRow.Lx =
                lifeTableRow.nx * (lifeTableRow.lx - lifeTableRow.dx) +
                lifeTableRow.ax * lifeTableRow.dx * lifeTableRow.nx;
        });
        // Reverse the life table since we need to start from the end to calculate Tx
        completeLifeTable.reverse().forEach((lifeTableRow, index) => {
            // If this is the last value (since we reversed it, last value is index==0)
            // then use the spline formula to calculate it
            // Otherwise previousLifeTableTx+ Lx
            lifeTableRow.Tx =
                index === 0
                    ? this.knots[0] * maxAge ** 3 / 3 -
                      this.knots[1] * maxAge ** 2 / 2 -
                      this.knots[1] ** 2 * maxAge / (4 * this.knots[0]) -
                      this.knots[1] ** 3 / (24 * this.knots[0 ** 2])
                    : completeLifeTable[index - 1].Tx + lifeTableRow.Lx;
            // ex = Tx/lx
            lifeTableRow.ex = lifeTableRow.Tx / lifeTableRow.lx;
        });
        // Reverse it again
        completeLifeTable.reverse();

        return completeLifeTable;
    }

    /**
     * Returns the qx value to use in the life table represented by the data
     * argument
     *
     * @protected
     * @param {Data} data
     * @returns
     * @memberof LifeExpectancy
     */
    protected getQx(data: Data) {
        const OneYearFromToday = moment();
        OneYearFromToday.add(1, 'year');

        return this.model
            .getAlgorithmForData(data)
            .getRiskToTime(data, OneYearFromToday);
    }

    protected getLifeExpectancyForAge(
        completeLifeTable: Array<T & ICompleteLifeTableRow>,
        age: number,
    ) {
        return (
            throwErrorIfUndefined(
                this.getLifeTableRowForAge(completeLifeTable, age),
                new Error(
                    `Life Expectancy Calculation Error: No life table row found for age ${age}`,
                ),
            ).ex + age
        );
    }

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
    protected abstract getLifeTableRowForAge<U = T & ICompleteLifeTableRow>(
        completeLifeTable: U[],
        age: number,
    ): U | undefined;
}

export interface IBaseRefLifeTableRow {
    ax: number;
}

interface ICompleteLifeTableRow extends IBaseRefLifeTableRow {
    ex: number;
    qx: number;
    lx: number;
    dx: number;
    Lx: number;
    Tx: number;
    nx: number;
}
