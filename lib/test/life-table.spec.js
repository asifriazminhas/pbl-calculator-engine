"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _lifeTable = require("../engine/life-table/life-table");

var path = _interopRequireWildcard(require("path"));

var fs = _interopRequireWildcard(require("fs"));

var _chai = require("chai");

var _tape = _interopRequireDefault(require("tape"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// tslint:disable-next-line
var csvParse = require('csv-parse/lib/sync');

(0, _tape.default)("LifeTable.getCompleteLifeTableWithStartAge", function (t) {
  var testLifeTable = csvParse(fs.readFileSync(path.join(__dirname, '../../assets/test/life-table/life_table.csv'), 'utf8'), {
    columns: true
  });
  var calculatedLifeTable = (0, _lifeTable.getCompleteLifeTableWithStartAge)(testLifeTable, function (age) {
    var ageRowFromTestLifeTable = testLifeTable.find(function (testLifeTableRow) {
      return testLifeTableRow.age === age;
    });

    if (!ageRowFromTestLifeTable) {
      throw new Error();
    }

    return 1 - Number(ageRowFromTestLifeTable.qx);
  }, testLifeTable[0].age);
  testLifeTable.forEach(function (testLifeTableRow, index) {
    var fields = ['ex'];
    /*fs.writeFileSync(
        path.join(__dirname, '../../assets/calculated-life-table.json'),
        JSON.stringify(this.calculatedLifeTable)
    );*/

    fields.forEach(function (field) {
      var diff = calculatedLifeTable[index][field] - Number(testLifeTableRow[field]);
      var errorPercentage = diff / Number(testLifeTableRow[field]);
      var allowedErrorPercentage = 0.01;
      (0, _chai.expect)(errorPercentage).to.be.lessThan(allowedErrorPercentage, "Row ".concat(index, " and field ").concat(field));
    });
  });
  t.pass("should properly calculate the life table fields");
  t.end();
});
//# sourceMappingURL=life-table.spec.js.map