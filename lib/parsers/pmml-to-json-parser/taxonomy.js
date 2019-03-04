"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
function reduceRowToTableRow(tableRow, currentColumn) {
    tableRow = Object.assign({}, tableRow, {
        [currentColumn['#name']]: currentColumn._,
    });
    return tableRow;
}
function reduceInlineTableToTable(inlineTable) {
    return inlineTable.row instanceof Array
        ? inlineTable.row.map(currentRow => {
            return currentRow.$$.reduce(reduceRowToTableRow, {});
        })
        : [inlineTable.row.$$.reduce(reduceRowToTableRow, {})];
}
function parseTaxonomy(taxonomy) {
    if (lodash_1.isUndefined(taxonomy) || lodash_1.isEmpty(taxonomy)) {
        return {};
    }
    else if (taxonomy instanceof Array) {
        return taxonomy.reduce((tables, currentTaxonomy) => {
            tables[currentTaxonomy.$.name] = reduceInlineTableToTable(currentTaxonomy.InlineTable);
            return tables;
        }, {});
    }
    else {
        return {
            [taxonomy.$.name]: reduceInlineTableToTable(taxonomy.InlineTable),
        };
    }
}
exports.parseTaxonomy = parseTaxonomy;
//# sourceMappingURL=taxonomy.js.map