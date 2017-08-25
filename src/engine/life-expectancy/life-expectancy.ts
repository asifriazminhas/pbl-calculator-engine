export interface BaseLifeTableRow {
    age: number;
    ax: number;
    ex: number;
}

export type RefLifeTable = Array<BaseLifeTableRow>;

interface BaseLifeTableWithQxRow extends BaseLifeTableRow {
    age: number;
    ax: number;
    qx: number
}

interface LifeTableRow extends BaseLifeTableWithQxRow {
    lx: number;
    dx: number;
    Lx: number;
    Tx: number;
}

export type GetPredictedRiskForAge = (age: number) => number;

/**
 * Returns a new array of life table rows whose qx is filled with it's right value
 * 
 * @param {Array<BaseLifeTableRow>} baseLifeTable
 * @param {GetPredictedRiskForAge} getPredictedRiskForAge 
 * @returns {Array<BaseLifeTableWithQxRow>}
 */
function getBaseLifeTableWithQx(baseLifeTable: Array<BaseLifeTableRow>, getPredictedRiskForAge: GetPredictedRiskForAge): Array<BaseLifeTableWithQxRow> {
    let baseLifeTableWithQx: Array<BaseLifeTableWithQxRow> = [];

    baseLifeTable.forEach((baseLifeTableRow) => {
        baseLifeTableWithQx.push(Object.assign({}, baseLifeTableRow, {
            qx: 1 - getPredictedRiskForAge(baseLifeTableRow.age)
        }))
    });

    return baseLifeTableWithQx;
}

/**
 * Returns lx for the passed life table row
 * 
 * @param {(LifeTableRow | undefined)} lifeTableRow If undefined then it means the function should return the lx for the first life table row which is by default 100000
 * @returns {number}
 */
function getlxForLifeTableRow(lifeTableRow: LifeTableRow | undefined): number {
    if(lifeTableRow === undefined) {
        return 100000;
    }
    else {
        return lifeTableRow.lx - lifeTableRow.dx;
    }
}

/**
 * Returns calculated value for dx from passed lx and qx arguments
 * 
 * @param {number} lx
 * @param {number} qx
 * @returns {number}
 */
function getdx(lx: number, qx: number): number {
    return lx*qx;
}

/**
 * Returns calculated value for Lx from passed lx, dx and ax arguments
 * 
 * @param {number} lx
 * @param {number} dx
 * @param {number} ax
 * @returns
 */
function getLx(lx: number, dx: number, ax: number) {
    return (lx-dx) + (dx*ax);
}

/**
 * Returns calculated value of Tx
 * 
 * @param {LifeTableRow} lifeTableRow The row for which we need to calculate Tx
 * @param {(LifeTableRow | undefined)} nextLifeTableRow The next row after the lifeTableRow argument.
 * @returns {number}
 */
function getTx(lifeTableRow: LifeTableRow, nextLifeTableRow: LifeTableRow | undefined): number {
    if(nextLifeTableRow === undefined) {
        return lifeTableRow.Lx;
    }
    else {
        return nextLifeTableRow.Tx + lifeTableRow.Lx;
    }
}

/**
 * Returns calculated value for ex
 * 
 * @param {LifeTableRow} lifeTableRow The row for which we need to calculate ex
 * @param {(LifeTableRow | undefined)} nextLifeTableRow The next row after the lifeTableRow argument
 * @returns {number}
 */
function getex(lifeTableRow: LifeTableRow, nextLifeTableRow: LifeTableRow | undefined): number {
    if(nextLifeTableRow === undefined) {
        return lifeTableRow.ax;
    }
    else {
        //Do this to avoid returning NaN
        if(lifeTableRow.lx === 0) {
            return 0;
        }
        else {
            return lifeTableRow.Tx/lifeTableRow.lx;
        }
    }
}

/**
 * Creates a new life table from the baseLifeTableWithQx which has only age, qx and ax terms and completes it by adding lx, dx, Lx, Tx and ex terms
 * 
 * @param {Array<BaseLifeTableWithQxRow>} baseLifeTableWithQx
 * @returns {Array<LifeTableRow>}
 */
function getCompleteLifeTable(
    baseLifeTableWithQx: Array<BaseLifeTableWithQxRow>,
    useLifeTableForExFromAge: number
): Array<LifeTableRow> {
    let lifeTable: Array<LifeTableRow> = [];

    baseLifeTableWithQx.forEach((baseLifeTableRow, index) => {
        const lx = getlxForLifeTableRow(lifeTable[index - 1]);
        const dx = getdx(lx, baseLifeTableRow.qx);
        const Lx = getLx(lx, dx, baseLifeTableRow.ax);

        lifeTable.push(Object.assign({}, baseLifeTableRow, {
            lx,
            dx,
            Lx,
            Tx: 0,
            ex: 0
        }));
    });

    //Reverse the lifetable since for Tx and ex we need the current row and next row
    lifeTable.reverse().forEach((lifeTableRow, index) => {
        lifeTableRow.Tx = getTx(lifeTableRow, lifeTable[index-1]);
        lifeTableRow.ex = lifeTableRow.age < useLifeTableForExFromAge ? (
            getex(lifeTableRow, lifeTable[index - 1])
        ) : (
            lifeTableRow.ex
        );
    });
    //Reverse the life table again since reverse is a mutable operation
    lifeTable.reverse();

    return lifeTable;
}

/**
 * Returns the life expectancy at the age argument using the passed lifeTable argument
 * 
 * @param {number} age
 * @param {Array<LifeTableRow>} lifeTable
 * @returns {number}
 */
function getLifeExpectancyForAge(age: number, lifeTable: Array<LifeTableRow>): number {
    const lifeTableRowForPassedAge = lifeTable.find((lifeTableRow) => {
        return lifeTableRow.age === age;
    });

    if(!lifeTableRowForPassedAge) {
        throw new Error(`No life table row found for age ${age}`);
    }
    else {
        return lifeTableRowForPassedAge.ex + age;
    }
}

/**
 * Returns the life expectancy at the age argument using the getPredictedRiskForAge argument to generate the lifetable from the baseLifeTable 
 * 
 * @export
 * @param {number} age
 * @param {GetPredictedRiskForAge} getPredictedRiskForAge Function which takes age and returns the calculated risk. Used to set the qx field in the generated life table
 * @param {Array<BaseLifeTableRow>} baseLifeTable
 * @returns {number}
 */
export function getLifeExpectancy(
    age: number,
    getPredictedRiskForAge: GetPredictedRiskForAge,
    baseLifeTable: Array<BaseLifeTableRow>,
    useExFromLifeTableFromAge: number
): number {
    const baseLifeTableWithQx = getBaseLifeTableWithQx(baseLifeTable, getPredictedRiskForAge);
    const lifeTable = getCompleteLifeTable(
        baseLifeTableWithQx,
        useExFromLifeTableFromAge
    );

    return getLifeExpectancyForAge(age, lifeTable);
}