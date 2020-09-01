"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseTaxonomy = parseTaxonomy;

var _isEmpty2 = _interopRequireDefault(require("lodash/isEmpty"));

var _isUndefined2 = _interopRequireDefault(require("lodash/isUndefined"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
  if ((0, _isUndefined2.default)(taxonomy) || (0, _isEmpty2.default)(taxonomy)) {
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
//# sourceMappingURL=taxonomy.js.map