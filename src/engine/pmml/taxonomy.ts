export interface IRow {
    $$: Array<{
        _: string;
        '#name': string;
    }>;
}

export interface IInlineTable {
    row: IRow | IRow[];
}

export interface ITaxonomy {
    $: {
        name: string;
    };
    InlineTable: IInlineTable;
}
