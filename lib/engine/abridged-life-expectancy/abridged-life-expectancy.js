"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbridgedLifeExpectancy = void 0;

var _inRange2 = _interopRequireDefault(require("lodash/inRange"));

var _sum2 = _interopRequireDefault(require("lodash/sum"));

var _data = require("../data");

var _lifeExpectancy = require("../life-expectancy/life-expectancy");

var _debugLe = require("../../debug/debug-le");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

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
var AbridgedLifeExpectancy = /*#__PURE__*/function (_LifeExpectancy) {
  _inherits(AbridgedLifeExpectancy, _LifeExpectancy);

  var _super = _createSuper(AbridgedLifeExpectancy);

  function AbridgedLifeExpectancy(model, genderedAbridgedLifeTable) {
    var _this;

    _classCallCheck(this, AbridgedLifeExpectancy);

    _this = _super.call(this, model);
    _this.SexVariable = 'DHH_SEX';
    _this.ContAgeField = 'DHHGAGE_cont';
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
   * @param {boolean} useWeights Whether the final value LE value should be weighted. Defaults to true.
   * @returns
   * @memberof AbridgedLifeExpectancy
   */


  _createClass(AbridgedLifeExpectancy, [{
    key: "calculateForPopulation",
    value: function calculateForPopulation(population) {
      var useWeights = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      _debugLe.debugLe.startNewCalculation(false);

      var malePopLifeExpectancy = this.calculateForPopulationForSex(population, 'male', useWeights);
      var femalePopLifeExpectancy = this.calculateForPopulationForSex(population, 'female', useWeights);
      var le = (malePopLifeExpectancy + femalePopLifeExpectancy) / 2;

      _debugLe.debugLe.addEndDebugInfoPopulation(le);

      return le;
    }
    /**
     * Returns the life years left for an individual
     *
     * @param {Data} individual
     * @returns
     * @memberof AbridgedLifeExpectancy
     */

  }, {
    key: "calculateForIndividual",
    value: function calculateForIndividual(individual) {
      var _this2 = this;

      // Variable initialization
      // Algorithm selected by the individual's sex
      var algorithm = this.model.getAlgorithmForData(individual); // The continuous age field in the algorithm. This value will be varied going from one life table row to another

      var ageContField = algorithm.findDataField(this.ContAgeField); // Calculate the age of the individual

      var ageContValue = ageContField.calculateCoefficent(ageContField.calculateDataToCalculateCoefficent(individual, algorithm.userFunctions, algorithm.tables), algorithm.userFunctions, algorithm.tables); // Get the life table to use for the individual based on their sex
      // Get the entered sex of the individual

      var sex = (0, _data.findDatumWithName)(this.SexVariable, individual).coefficent; // Go through the categories for the sex field and find the one for the current value of sex. It's displayValue should be male or female and we use that to get the life table

      var maleOrFemaleString = this.model.modelFields.find(function (_ref) {
        var name = _ref.name;
        return name === _this2.SexVariable;
      }).categories.find(function (category) {
        return category.value === sex;
      }).displayValue.toLowerCase();
      var lifeTableForIndividual = this.genderedAbridgedLifeTable[maleOrFemaleString];

      _debugLe.debugLe.startNewCalculation(true); // Add qx to the base life table for this individual


      var AgeField = 'DHHGAGE'; // We want to the populate the age value for this individual with the value from each life table row. So remove the age field from the data for this individual

      var individualWithoutAgeDatum = individual.filter(function (datum) {
        return datum.name !== AgeField;
      });
      var lifeTableWithQx = lifeTableForIndividual // Remove all life table rows whose age group is younger than this individual
      .filter(function (lifeTableRow) {
        return _this2.isInAgeGroup(lifeTableRow, ageContValue) || lifeTableRow.age_start > ageContValue;
      }).map(function (lifeTableRow) {
        return Object.assign({}, lifeTableRow, {
          qx: _this2.getQx( // Add the age value to be the median for this age group or the age start for the last row since age_end will be undefined
          individualWithoutAgeDatum.concat({
            name: _this2.ContAgeField,
            coefficent: lifeTableRow.age_end ? (lifeTableRow.age_end - lifeTableRow.age_start) / 2 : lifeTableRow.age_start
          })),
          nx: _this2.getnx(lifeTableRow)
        });
      });
      var ageMaxAllowableValue = this.getMaxAge(ageContField);
      var completeLifeTable = this.getCompleteLifeTable(lifeTableWithQx, ageMaxAllowableValue);
      var lifeYearsRemaining = completeLifeTable[0].ex;

      _debugLe.debugLe.addEndDebugInfoForIndividual(completeLifeTable, lifeTableWithQx.length, lifeYearsRemaining);

      return lifeYearsRemaining;
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
      var _this3 = this;

      return completeLifeTable.find(function (lifeTableRow) {
        return _this3.isInAgeGroup(lifeTableRow, age);
      });
    }
  }, {
    key: "getFirstTxValue",
    value: function getFirstTxValue(lifeTable, maxAge) {
      // Get the index of the life table row after which we need to
      // stop calculating values
      var lastValidLifeTableRowIndex = this.getLastValidLifeTableRowIndex(lifeTable, maxAge);
      var knots = this.getKnots(lifeTable, [lifeTable[lastValidLifeTableRowIndex].age_start, lifeTable[lastValidLifeTableRowIndex - 1].age_start]);
      return -(knots[0] * Math.pow(maxAge, 3)) / 3 - knots[1] * Math.pow(maxAge, 2) / 2 - Math.pow(knots[1], 2) * maxAge / (4 * knots[0]) - Math.pow(knots[1], 3) / (24 * Math.pow(knots[0], 2));
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
  }, {
    key: "calculateForPopulationForSex",
    value: function calculateForPopulationForSex(population, sex, useWeights) {
      var _this4 = this;

      var sexDataField = this.model.modelFields.find(function (_ref2) {
        var name = _ref2.name;
        return name === _this4.SexVariable;
      }); // Get the value of the category in this model for the sex argument

      var sexCategory = sexDataField.categories.find(function (_ref3) {
        var displayValue = _ref3.displayValue;
        return displayValue.toLocaleLowerCase().trim() === sex;
      }).value;
      var algorithmForCurrentSex = this.model.getAlgorithmForData([{
        name: this.SexVariable,
        coefficent: sexCategory
      }]);
      var ageDerivedField = algorithmForCurrentSex.findDataField(this.ContAgeField); // Get the abridged life table for the current gender

      var abridgedLifeTable = this.genderedAbridgedLifeTable[sex]; // Get all the individuals who are the current sex

      var populationForCurrentGender = population.filter(function (data) {
        return (0, _data.findDatumWithName)(_this4.SexVariable, data).coefficent === sexCategory;
      }); // Calculate the one year risk for each individual in the population

      var qxValues = populationForCurrentGender.map(function (data) {
        return _this4.getQx(data);
      });
      var WeightDatumName = 'WTS_M';
      var weightDataField = this.model.modelFields.find(function (_ref4) {
        var name = _ref4.name;
        return name === WeightDatumName;
      });
      var DefaultWeight = 1; // Calculate the weighted qx value to use for each row in the abridged life table

      var weightedQxForAgeGroups = abridgedLifeTable.map(function (lifeTableRow) {
        // Get all the individual who are in the age group of the current life table row
        var currentAgeGroupPop = populationForCurrentGender.filter(function (data) {
          // Calculate the age of this individual using the ageDataField variable
          var age = Number(ageDerivedField.calculateCoefficent(ageDerivedField.calculateDataToCalculateCoefficent(data, algorithmForCurrentSex.userFunctions, algorithmForCurrentSex.tables), algorithmForCurrentSex.userFunctions, algorithmForCurrentSex.tables));
          return _this4.isInAgeGroup(lifeTableRow, age);
        }); // Get the array of calculated qx values for each individual in the current age group population

        var qxValuesForCurrentAgeGroup = currentAgeGroupPop.map(function (data) {
          return qxValues[currentAgeGroupPop.indexOf(data)];
        }); // Get the array of weights for each individual in the current age group population

        var weightsForCurrentAgeGroup = currentAgeGroupPop.map(function (data) {
          var weightValidation = weightDataField.validateData(data);
          return weightValidation !== true || useWeights === false ? DefaultWeight : Number((0, _data.findDatumWithName)(WeightDatumName, data).coefficent);
        }); // Calculate the weighted mean using qxValuesForCurrentAgeGroup and weightsForCurrentAgeGroup

        var weightedQx = qxValuesForCurrentAgeGroup.reduce(function (weightedQxMean, currentQxValue, index) {
          return weightedQxMean + currentQxValue * weightsForCurrentAgeGroup[index];
        }, 0) / (0, _sum2.default)(weightsForCurrentAgeGroup); // If the qx value is not a number then return the value of the qx in the life table row

        return isNaN(weightedQx) ? lifeTableRow.qx : weightedQx;
      });
      var ageMaxAllowableValue = this.getMaxAge(ageDerivedField); // Make a life table with qx, nx and the fields in the ref life table
      // We will complete this in the next line of code

      var refLifeTableWithQxAndNx = abridgedLifeTable // Add on the qx and nx fields to each life table row
      .map(function (lifeTableRow, index) {
        return Object.assign({}, lifeTableRow, {
          qx: weightedQxForAgeGroups[index],
          nx: _this4.getnx(lifeTableRow)
        });
      }); // Get the index of the life table row after which we need to
      // stop calculating values

      var lastValidLifeTableRowIndex = this.getLastValidLifeTableRowIndex(refLifeTableWithQxAndNx, ageMaxAllowableValue);
      var completeLifeTable = this.getCompleteLifeTable(refLifeTableWithQxAndNx, abridgedLifeTable[lastValidLifeTableRowIndex].age_start); // The age of which ex value we will use from the life table to calculate the LE for the population

      var AgeLifeExpectancy = 20;
      var le = this.getLifeExpectancyForAge(completeLifeTable, AgeLifeExpectancy);

      _debugLe.debugLe.addSexDebugInfoForPopulation({
        completeLifeTable: completeLifeTable,
        sex: sex,
        le: le,
        qxs: qxValues
      });

      return le;
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
    value: function getnx(_ref5) {
      var age_end = _ref5.age_end,
          age_start = _ref5.age_start;
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
    value: function isInAgeGroup(_ref6, age) {
      var age_end = _ref6.age_end,
          age_start = _ref6.age_start;
      // If the end age is not defined then this is the last life table row
      // so check if the age is greater than the start age
      // Otherwise check if it's within the range of the start age and end age
      // inRange fails if age is equal to the end age so check that as the
      // last condition
      return age_end === undefined ? age >= age_start : (0, _inRange2.default)(age, age_start, age_end) || age === age_end;
    }
  }, {
    key: "getMaxAge",
    value: function getMaxAge(ageContField) {
      return ageContField.intervals[0].higherMargin.margin;
    }
  }, {
    key: "getLastValidLifeTableRowIndex",
    value: function getLastValidLifeTableRowIndex(lifeTable, maxAge) {
      return lifeTable.findIndex(function (lifeTableRow) {
        return lifeTableRow.age_start > maxAge;
      });
    }
  }]);

  return AbridgedLifeExpectancy;
}(_lifeExpectancy.LifeExpectancy);

exports.AbridgedLifeExpectancy = AbridgedLifeExpectancy;
//# sourceMappingURL=abridged-life-expectancy.js.map