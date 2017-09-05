export interface RefLifeTableRow {
    age: number;
    ax: number;
    ex: number;
}

export type RefLifeTable = Array<RefLifeTableRow>;

export interface RefLifeTableRowWithQx extends RefLifeTableRow {
    age: number;
    ax: number;
    qx: number
}

export interface CompleteLifeTableRow extends RefLifeTableRowWithQx {
    lx: number;
    dx: number;
    Lx: number;
    Tx: number;
}

export type CompleteLifeTable = Array<CompleteLifeTableRow>;