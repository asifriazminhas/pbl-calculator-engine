"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var data_1 = require("../data");

var lodash_1 = require("lodash");

var life_expectancy_1 = require("../life-expectancy/life-expectancy");

var lodash_2 = require("lodash");

var error_code_1 = require("../data-field/error-code");
/**
 * Used to calculate life expectancy with:
 * 1. An abridged life table
 * 2. A population
 *
 * Do no use if life table is an un-abridged one or for an individual
 *
 * @export
 * @class AbridgedLifeExpectancy
 */


var AbridgedLifeExpectancy =
/*#__PURE__*/
function (_life_expectancy_1$Li) {
  _inherits(AbridgedLifeExpectancy, _life_expectancy_1$Li);

  function AbridgedLifeExpectancy(model, genderedAbridgedLifeTable) {
    var _this;

    _classCallCheck(this, AbridgedLifeExpectancy);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AbridgedLifeExpectancy).call(this, model));
    _this.model = model;
    _this.genderedAbridgedLifeTable = genderedAbridgedLifeTable;
    return _this;
  }
  /**
   * Calculates the average life expectancy for a population. Uses the
   * abridged life table for each gender and then averages them to get the
   * life expectancy for the population
   *
   * @param {Data[]} population
   * @returns
   * @memberof AbridgedLifeExpectancy
   */


  _createClass(AbridgedLifeExpectancy, [{
    key: "calculateForPopulation",
    value: function calculateForPopulation(population) {
      var malePopLifeExpectancy = this.calculateForPopulationForSex(population, 'male');
      var femalePopLifeExpectancy = this.calculateForPopulationForSex(population, 'female');
      return (malePopLifeExpectancy + femalePopLifeExpectancy) / 2;
    }
    /**
     * Returns the life table row where the age arg is between it's age group
     *
     * @protected
     * @param {(Array<ICompleteLifeTableRow & IAbridgedLifeTableRow>)} completeLifeTable
     * @param {number} age
     * @returns
     * @memberof AbridgedLifeExpectancy
     */

  }, {
    key: "getLifeTableRowForAge",
    value: function getLifeTableRowForAge(completeLifeTable, age) {
      var _this2 = this;

      return completeLifeTable.find(function (lifeTableRow) {
        return _this2.isInAgeGroup(lifeTableRow, age);
      });
    }
  }, {
    key: "calculateForPopulationForSex",
    value: function calculateForPopulationForSex(population, sex) {
      var _this3 = this;

      // The name of the age variable
      var AgeDatumName = 'age'; // The name of the sex variable

      var SexDatumName = 'sex';
      var algorithmForCurrentSex = this.model.getAlgorithmForData([{
        name: SexDatumName,
        coefficent: sex
      }]); // Get the abridged life table for the current gender

      var abridgedLifeTable = this.genderedAbridgedLifeTable[sex]; // Get all the individuals who are the current sex

      var populationForCurrentGender = population.filter(function (data) {
        return data_1.findDatumWithName(SexDatumName, data).coefficent === sex;
      }); // Calculate the one year risk for each individual in the population

      var qxValues = populationForCurrentGender.map(function (data) {
        return _this3.getQx(data);
      });
      var WeightDatumName = 'WTS_M';
      var weightDataField = algorithmForCurrentSex.findDataField(WeightDatumName);
      var DefaultWeight = 1; // Calculate the weighted qx value to use for each row in the abridged life table

      var weightedQxForAgeGroups = abridgedLifeTable.map(function (lifeTableRow) {
        // Get all the individual who are in the age group of the current life table row
        var currentAgeGroupPop = populationForCurrentGender.filter(function (data) {
          var age = data_1.findDatumWithName(AgeDatumName, data).coefficent;
          return _this3.isInAgeGroup(lifeTableRow, age);
        }); // Get the array of calculated qx values for each individual in the current age group population

        var qxValuesForCurrentAgeGroup = currentAgeGroupPop.map(function (data) {
          return qxValues[currentAgeGroupPop.indexOf(data)];
        }); // Get the array of weights for each individual in the current age group population

        var weightsForCurrentAgeGroup = currentAgeGroupPop.map(function (data) {
          return weightDataField.validateData(data) === error_code_1.ErrorCode.NoDatumFound ? DefaultWeight : data_1.findDatumWithName(WeightDatumName, data).coefficent;
        }); // Calculate the weighted mean using qxValuesForCurrentAgeGroup and weightsForCurrentAgeGroup

        return qxValuesForCurrentAgeGroup.reduce(function (weightedQxMean, currentQxValue, index) {
          return weightedQxMean + currentQxValue * weightsForCurrentAgeGroup[index];
        }, 0) / lodash_1.sum(weightsForCurrentAgeGroup);
      });
      var ageMaxAllowableValue = algorithmForCurrentSex.findDataField(AgeDatumName).interval.higherMargin.margin; // Make a life table with qx, nx and the fields in the ref life table
      // We will complete this in the next line of code

      var refLifeTableWithQxAndNx = abridgedLifeTable // Add on the qx and nx fields to each life table row
      .map(function (lifeTableRow, index) {
        return Object.assign({}, lifeTableRow, {
          qx: weightedQxForAgeGroups[index],
          nx: _this3.getnx(lifeTableRow)
        });
      }); // Get the index of the life table row after which we need to
      // stop calculating values

      var lastValidLifeTableRowIndex = abridgedLifeTable.findIndex(function (lifeTableRow) {
        return lifeTableRow.age_start > ageMaxAllowableValue;
      });
      var completeLifeTable = this.getCompleteLifeTable(refLifeTableWithQxAndNx, abridgedLifeTable[lastValidLifeTableRowIndex].age_start, [abridgedLifeTable[lastValidLifeTableRowIndex].age_start, abridgedLifeTable[lastValidLifeTableRowIndex - 1].age_start]); // The age of which ex value we will use from the life table to calculate the LE for the population

      var AgeLifeExpectancy = 20;
      return this.getLifeExpectancyForAge(completeLifeTable, AgeLifeExpectancy);
    }
    /**
     * Return the nx value for this life table row which is the range of ages
     * part of this age group
     *
     * @private
     * @param {IAbridgedLifeTableRow} { age_end, age_start }
     * @returns {number}
     * @memberof AbridgedLifeExpectancy
     */

  }, {
    key: "getnx",
    value: function getnx(_ref) {
      var age_end = _ref.age_end,
          age_start = _ref.age_start;
      var FinalRowNx = 1;
      var ageDifference = age_end - age_start;
      return ageDifference === 0 ? 1 : age_end === undefined ? FinalRowNx : ageDifference + 1;
    }
    /**
     * Check if an age is part of the age group for an abridged life table row
     *
     * @private
     * @param {IAbridgedLifeTableRow} { age_end, age_start }
     * @param {number} age
     * @returns {boolean}
     * @memberof AbridgedLifeExpectancy
     */

  }, {
    key: "isInAgeGroup",
    value: function isInAgeGroup(_ref2, age) {
      var age_end = _ref2.age_end,
          age_start = _ref2.age_start;
      // If the end age is not defined then this is the last life table row
      // so check if the age is greater than the start age
      // Otherwise check if it's within the range of the start age and end age
      // inRange fails if age is equal to the end age so check that as the
      // last condition
      return age_end === undefined ? age >= age_start : lodash_2.inRange(age, age_start, age_end) || age === age_end;
    }
  }]);

  return AbridgedLifeExpectancy;
}(life_expectancy_1.LifeExpectancy);

exports.AbridgedLifeExpectancy = AbridgedLifeExpectancy;
//# sourceMappingURL=abridged-life-expectancy.js.map