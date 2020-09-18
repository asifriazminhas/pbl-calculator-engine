"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findLifeTableRow = findLifeTableRow;
exports.LifeExpectancy = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _undefined = require("../../util/undefined");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Base class for Life Expectancy and related calculations
 *
 * @export
 * @abstract
 * @class LifeExpectancy
 * @template T An interface which defines the row in the reference life table
 * used by the implementation class
 */
var LifeExpectancy = /*#__PURE__*/function () {
  function LifeExpectancy(model) {
    _classCallCheck(this, LifeExpectancy);

    this.model = model;
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
   * @param {number} knotAges Age values to be used in the formula
   * for calculating the second knot. Should be the age value in the last
   * row of the life table followed by the age value in the row before
   * @returns {(Array<ICompleteLifeTableRow & T>)}
   * @memberof LifeExpectancy
   */


  _createClass(LifeExpectancy, [{
    key: "getCompleteLifeTable",
    value: function getCompleteLifeTable(refLifeTableWithQxAndNx, maxAge) {
      var _this = this;

      // The complete life table we will return at the end
      // Extend each row of the life table and set the lx, dx, Lx, Tx and
      // ex fields to -1. They will be filled in later
      var completeLifeTable = refLifeTableWithQxAndNx.map(function (lifeTableRow) {
        return Object.assign({}, lifeTableRow, {
          lx: -1,
          dx: -1,
          Lx: -1,
          Tx: -1,
          ex: -1
        });
      }); // Get the index of the life table row for the maxAge arg

      var indexOfLifeTableRowForMaxAge = completeLifeTable.indexOf((0, _undefined.throwErrorIfUndefined)(this.getLifeTableRowForAge(completeLifeTable, maxAge), new Error("No life table row found for age ".concat(maxAge)))); // We only need the first row and row which is applicable for the
      // maxAge arg since all the qx values after that will not be
      // valid

      completeLifeTable = completeLifeTable.slice(0, indexOfLifeTableRowForMaxAge + 1);
      var lxForFirstRow = 100000; // Populate the lx, dx and Lx values in the life table

      completeLifeTable.forEach(function (lifeTableRow, index, abridgedLifeTable) {
        // For the first lx value set it to lxForFirstRow
        // Otherwise previousRowlx  - dx
        lifeTableRow.lx = index === 0 ? lxForFirstRow : abridgedLifeTable[index - 1].lx - abridgedLifeTable[index - 1].dx;
        lifeTableRow.dx = lifeTableRow.lx * lifeTableRow.qx; // Lx = nx*(lx-dx) + ax*dx

        lifeTableRow.Lx = lifeTableRow.nx * (lifeTableRow.lx - lifeTableRow.dx) + lifeTableRow.ax * lifeTableRow.dx;
      }); // Reverse the life table since we need to start from the end to calculate Tx

      completeLifeTable.reverse().forEach(function (lifeTableRow, index) {
        // If this is the last value (since we reversed it, last value is index==0)
        // then use the spline formula to calculate it
        // Otherwise previousLifeTableTx+ Lx
        lifeTableRow.Tx = index === 0 ? _this.getFirstTxValue(completeLifeTable, maxAge) : completeLifeTable[index - 1].Tx + lifeTableRow.Lx; // ex = Tx/lx

        lifeTableRow.ex = lifeTableRow.Tx / lifeTableRow.lx;
      }); // Reverse it again

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

  }, {
    key: "getQx",
    value: function getQx(data) {
      var OneYearFromToday = (0, _moment.default)();
      OneYearFromToday.add(1, 'year');
      return this.model.getAlgorithmForData(data).getRiskToTime(data, OneYearFromToday);
    }
  }, {
    key: "getLifeExpectancyForAge",
    value: function getLifeExpectancyForAge(completeLifeTable, age) {
      return (0, _undefined.throwErrorIfUndefined)(this.getLifeTableRowForAge(completeLifeTable, age), new Error("Life Expectancy Calculation Error: No life table row found for age ".concat(age))).ex + age;
    }
  }]);

  return LifeExpectancy;
}();

exports.LifeExpectancy = LifeExpectancy;

function findLifeTableRow(lifeTable, age) {
  var foundLifeTableRow = lifeTable.find(function (lifeTableRow) {
    return lifeTableRow.age === age;
  });

  if (!foundLifeTableRow) {
    throw new Error("No life table row found for age ".concat(age));
  }

  return foundLifeTableRow;
}
//# sourceMappingURL=life-expectancy.js.map