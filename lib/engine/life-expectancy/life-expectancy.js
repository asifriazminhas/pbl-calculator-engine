"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var moment = require("moment");

var undefined_1 = require("../../util/undefined");
/**
 * Base class for Life Expectancy and related calculations
 *
 * @export
 * @abstract
 * @class LifeExpectancy
 * @template T An interface which defines the row in the reference life table
 * used by the implementation class
 */


var LifeExpectancy =
/*#__PURE__*/
function () {
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
    value: function getCompleteLifeTable(refLifeTableWithQxAndNx, maxAge, knotAges) {
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

      var indexOfLifeTableRowForMaxAge = completeLifeTable.indexOf(undefined_1.throwErrorIfUndefined(this.getLifeTableRowForAge(completeLifeTable, maxAge), new Error("No life table row found for age ".concat(maxAge)))); // We only need the first row and row which is applicable for the
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
      });
      var knots = this.getKnots(completeLifeTable, knotAges); // Reverse the life table since we need to start from the end to calculate Tx

      completeLifeTable.reverse().forEach(function (lifeTableRow, index) {
        // If this is the last value (since we reversed it, last value is index==0)
        // then use the spline formula to calculate it
        // Otherwise previousLifeTableTx+ Lx
        lifeTableRow.Tx = index === 0 ? -(knots[0] * Math.pow(maxAge, 3)) / 3 - knots[1] * Math.pow(maxAge, 2) / 2 - Math.pow(knots[1], 2) * maxAge / (4 * knots[0]) - Math.pow(knots[1], 3) / (24 * Math.pow(knots[0], 2)) : completeLifeTable[index - 1].Tx + lifeTableRow.Lx; // ex = Tx/lx

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
      var OneYearFromToday = moment();
      OneYearFromToday.add(1, 'year');
      return this.model.getAlgorithmForData(data).getRiskToTime(data, OneYearFromToday);
    }
  }, {
    key: "getLifeExpectancyForAge",
    value: function getLifeExpectancyForAge(completeLifeTable, age) {
      return undefined_1.throwErrorIfUndefined(this.getLifeTableRowForAge(completeLifeTable, age), new Error("Life Expectancy Calculation Error: No life table row found for age ".concat(age))).ex + age;
    }
    /**
     * Calculates the knots used in the calculation of Tx for the last
     * row in the life table
     *
     * Hsieh J. A general theory of life table construction and a precise
     * abridged life table method. Biom J 1991;2:143-62.
     *
     * @private
     * @param {ICompleteLifeTableRow[]} lifeTable A life table whose lx values
     * are properly populated. The life table should end at the row whose Tx
     * value needs to be calculated using splines
     * @param {[number, number]} ages Age values to be used in the formula
     * for calculating the second knot. Should be the age value in the last
     * row of the life table followed by the age value in the row before
     * @returns {[number, number]}
     * @memberof LifeExpectancy
     */

  }, {
    key: "getKnots",
    value: function getKnots(lifeTable, ages) {
      var knotOne = Math.pow(Math.pow(lifeTable[lifeTable.length - 2].lx, 0.5) - Math.pow(lifeTable[lifeTable.length - 1].lx * 0.97, 0.5), 2) / 25;
      var knotTwo = (lifeTable[lifeTable.length - 1].lx - lifeTable[lifeTable.length - 2].lx) / 5 - knotOne * (ages[0] + ages[1]);
      return [knotOne, knotTwo];
    }
  }]);

  return LifeExpectancy;
}();

exports.LifeExpectancy = LifeExpectancy;
//# sourceMappingURL=life-expectancy.js.map