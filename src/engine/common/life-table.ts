export interface RefLifeTableRow {
    age: number;
    ax: number;
    ex: number;
}

export type RefLifeTable = Array<RefLifeTableRow>;

export interface CompleteLifeTableRow extends RefLifeTableRow {
    lx: number;
    dx: number;
    Lx: number;
    Tx: number;
    qx: number;
}

export type CompleteLifeTable = Array<CompleteLifeTableRow>;

export type GetPredictedRiskForAge = (age: number) => number;

/**
 * Returns lx for the passed life table row
 * 
 * @param {(LifeTableRow | undefined)} lifeTableRow If undefined then it means the function should return the lx for the first life table row which is by default 100000
 * @returns {number}
 */
function getlxForLifeTableRow(
    lifeTableRow: CompleteLifeTableRow | undefined
): number {
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
function getTx(
    lifeTableRow: CompleteLifeTableRow, 
    nextLifeTableRow: CompleteLifeTableRow | undefined
): number {
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
function getex(
    lifeTableRow: CompleteLifeTableRow, 
    nextLifeTableRow: CompleteLifeTableRow | undefined
): number {
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
export function getCompleteLifeTableWithStartAge(
    refLifeTable: RefLifeTable,
    getPredictedRiskForAge: GetPredictedRiskForAge,
    startAge: number,
    useLifeTableForExFromAge: number = 99
): CompleteLifeTable {
    let lifeTable: CompleteLifeTable = [];

    let refLifeTableWithQx: Array<RefLifeTableRow & {
        qx: number
    }> = [];

    let refLifeTableFromStartAge = refLifeTable
        .filter(refLifeTable => refLifeTable.age >= startAge);
    
    refLifeTableFromStartAge.forEach((refLifeTableRow) => {
        refLifeTableWithQx.push(Object.assign({}, refLifeTableRow, {
            qx: 1 - getPredictedRiskForAge(refLifeTableRow.age)
        }))
    });

    refLifeTableWithQx.forEach((baseLifeTableRow, index) => {
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

    const reversedLifeTable = refLifeTable.reverse();

    //Reverse the lifetable since for Tx and ex we need the current row and next row
    lifeTable.reverse().forEach((lifeTableRow, index) => {
        lifeTableRow.Tx = getTx(lifeTableRow, lifeTable[index-1]);
        lifeTableRow.ex = Number(lifeTableRow.age) < useLifeTableForExFromAge ? (
            getex(lifeTableRow, lifeTable[index - 1])
        ) : (
            reversedLifeTable[index].ex
        );
    });

    refLifeTable.reverse();
    //Reverse the life table again since reverse is a mutable operation
    lifeTable.reverse();

    return lifeTable;
}