"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var lodash_1 = require("lodash");

function reduceRowToTableRow(tableRow, currentColumn) {
  tableRow = Object.assign({}, tableRow, _defineProperty({}, currentColumn['#name'], currentColumn._));
  return tableRow;
}

function reduceInlineTableToTable(inlineTable) {
  return inlineTable.row instanceof Array ? inlineTable.row.map(function (currentRow) {
    return currentRow.$$.reduce(reduceRowToTableRow, {});
  }) : [inlineTable.row.$$.reduce(reduceRowToTableRow, {})];
}

function parseTaxonomy(taxonomy) {
  if (lodash_1.isUndefined(taxonomy) || lodash_1.isEmpty(taxonomy)) {
    return {};
  } else if (taxonomy instanceof Array) {
    return taxonomy.reduce(function (tables, currentTaxonomy) {
      tables[currentTaxonomy.$.name] = reduceInlineTableToTable(currentTaxonomy.InlineTable);
      return tables;
    }, {});
  } else {
    return _defineProperty({}, taxonomy.$.name, reduceInlineTableToTable(taxonomy.InlineTable));
  }
}

exports.parseTaxonomy = parseTaxonomy;
//# sourceMappingURL=taxonomy.js.map