import { ITables } from '../algorithm';
import { ICustomPmml } from '../pmml';
import { ITaxonomy } from '../pmml/taxonomy';

function reduceRowToTableRow(
    tableRow: { [index: string]: string },
    currentColumn: {
        _: string;
        '#name': string;
    },
): { [index: string]: string } {
    tableRow = Object.assign({}, tableRow, {
        [currentColumn['#name']]: currentColumn._,
    });

    return tableRow;
}

function reduceInlineTableToTable(
    inlineTable: ITaxonomy['InlineTable'],
): Array<{
    [index: string]: string;
}> {
    return inlineTable.row instanceof Array
        ? inlineTable.row.map(currentRow => {
              return currentRow.$$.reduce(reduceRowToTableRow, {});
          })
        : [inlineTable.row.$$.reduce(reduceRowToTableRow, {})];
}

export function parseTaxonomy(taxonomy: ICustomPmml['Taxonomy']): ITables {
    if (taxonomy instanceof Array) {
        return taxonomy.reduce(
            (tables, currentTaxonomy) => {
                tables[currentTaxonomy.$.name] = reduceInlineTableToTable(
                    currentTaxonomy.InlineTable,
                );

                return tables;
            },
            {} as ITables,
        );
    } else {
        return {
            [taxonomy.$.name]: reduceInlineTableToTable(taxonomy.InlineTable),
        };
    }
}
