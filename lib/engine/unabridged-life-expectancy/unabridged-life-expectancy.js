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

var life_expectancy_1 = require("../life-expectancy/life-expectancy");

var interaction_covariate_1 = require("../data-field/covariate/interaction-covariate/interaction-covariate");

var non_interaction_covariate_1 = require("../data-field/covariate/non-interaction-covariats/non-interaction-covariate");

var data_field_1 = require("../data-field/data-field");

var lodash_1 = require("lodash");

var data_1 = require("../data/data");

var data_2 = require("../data");

var UnAbridgedLifeExpectancy =
/*#__PURE__*/
function (_life_expectancy_1$Li) {
  _inherits(UnAbridgedLifeExpectancy, _life_expectancy_1$Li);

  function UnAbridgedLifeExpectancy(model, genderedUnAbridgedLifeTable) {
    var _this;

    _classCallCheck(this, UnAbridgedLifeExpectancy);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UnAbridgedLifeExpectancy).call(this, model));
    _this.model = model;
    _this.genderedUnAbridgedLifeTable = genderedUnAbridgedLifeTable;
    return _this;
  }
  /**
   * Calculates the life expectancy for an individual using a un-abridged
   * life table
   *
   * @param {Data} data The variables and their values for this individual
   * @returns {number}
   * @memberof UnABridgedLifeExpectancy
   */


  _createClass(UnAbridgedLifeExpectancy, [{
    key: "calculateForIndividual",
    value: function calculateForIndividual(data) {
      var _this2 = this;

      var algorithm = this.model.getAlgorithmForData(data); // For an algorithm which has binning data we don't need to use the
      // life table

      if ('bins' in algorithm && algorithm.bins !== undefined) {
        // Ge the bin data for the bin this individual is in
        var binData = algorithm.bins.getBinDataForScore(algorithm.calculateScore(data)); // Get the survival time for the median survival value (50) for
        // this bin

        var MedianSurvival = 50;
        return binData.find(function (binDatum) {
          return binDatum.survivalPercent === MedianSurvival;
        }).time;
      } else {
        var AgeDatumName = 'age';
        var ageDatum = data_2.findDatumWithName(AgeDatumName, data);
        var ageInteractionCovariates = algorithm.covariates.filter(function (covariate) {
          return covariate instanceof interaction_covariate_1.InteractionCovariate && covariate.isPartOfGroup('AGE');
        });
        var ageNonInteractionCovariates = algorithm.covariates.filter(function (covariate) {
          return covariate instanceof non_interaction_covariate_1.NonInteractionCovariate && covariate.isPartOfGroup('AGE');
        });
        var allAgeFields = data_field_1.DataField.getUniqueDataFields(lodash_1.flatten(ageNonInteractionCovariates.map(function (covariate) {
          return covariate.getDescendantFields();
        }).concat(ageInteractionCovariates).concat(ageNonInteractionCovariates)));
        var dataWithoutAgeFields = data_1.filterDataForFields(data, allAgeFields);
        /* When we go through each row of the life table and calculate ex, the only
        coefficient that changes going from one covariate to the next are the ones
        belonging to the age covariate since we increment the age value from one
        row of the life table to the next. As an optimization we precalculate the
        coefficients for all covariates that are not part of the age group and use it as the base data for
        calculating qx for each life table row*/

        var lifeTableDataWithoutAge = data_1.filterDataForFields(algorithm.getCovariatesWithoutGroup('AGE')
        /* Goes through all non-age covariates and calculates the data
        required to calculate the coefficient for each one. Then uses the
        data to calculate the actual coefficient and finally adds it all
        to the currentData argument to be used by the next covariate */
        .reduce(function (currentData, covariate) {
          var currentCoefficientData = covariate.calculateDataToCalculateCoefficent(currentData, algorithm.userFunctions, algorithm.tables);
          var covariateCoefficient = {
            name: covariate.name,
            coefficent: covariate.calculateCoefficient(currentCoefficientData, algorithm.userFunctions, algorithm.tables)
          };
          return currentData.concat(currentCoefficientData).concat([covariateCoefficient]);
        }, dataWithoutAgeFields.concat(ageDatum)), allAgeFields);
        var SexDatumName = 'sex';
        var unAbridgedLifeTable = this.genderedUnAbridgedLifeTable[data_2.findDatumWithName(SexDatumName, data).coefficent]; // The partial life table we will

        var refLifeTableWithQxAndNx = unAbridgedLifeTable.map(function (lifeTableRow) {
          return Object.assign({}, lifeTableRow, {
            qx: _this2.getQx(lifeTableDataWithoutAge.concat({
              name: AgeDatumName,
              coefficent: lifeTableRow.age
            })),
            nx: 1
          });
        });
        var ageMaxAllowableValue = algorithm.findDataField(AgeDatumName).interval.higherMargin.margin; // Get the index of the life table row after which we need to
        // stop calculating values

        var lastValidLifeTableRowIndex = unAbridgedLifeTable.findIndex(function (lifeTableRow) {
          return lifeTableRow.age > ageMaxAllowableValue;
        });
        var completeLifeTable = this.getCompleteLifeTable(refLifeTableWithQxAndNx, unAbridgedLifeTable[lastValidLifeTableRowIndex].age, [unAbridgedLifeTable[lastValidLifeTableRowIndex].age, unAbridgedLifeTable[lastValidLifeTableRowIndex - 1].age]);
        return this.getLifeExpectancyForAge(completeLifeTable, ageDatum.coefficent);
      }
    }
  }, {
    key: "getLifeTableRowForAge",
    value: function getLifeTableRowForAge(completeLifeTable, age) {
      return completeLifeTable.find(function (lifeTableRow) {
        return lifeTableRow.age === age;
      });
    }
  }]);

  return UnAbridgedLifeExpectancy;
}(life_expectancy_1.LifeExpectancy);

exports.UnAbridgedLifeExpectancy = UnAbridgedLifeExpectancy;
//# sourceMappingURL=unabridged-life-expectancy.js.map