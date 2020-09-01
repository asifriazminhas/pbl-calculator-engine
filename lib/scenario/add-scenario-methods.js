"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addScenarioMethods = addScenarioMethods;

var _cloneDeep2 = _interopRequireDefault(require("lodash/cloneDeep"));

var _model = require("../engine/model");

var _data = require("../engine/data");

var _scenarioVariable = require("./scenario-variable");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Sexes;

(function (Sexes) {
  Sexes[Sexes["male"] = 1] = "male";
  Sexes[Sexes["female"] = 2] = "female";
})(Sexes || (Sexes = {}));

var sexVariable = 'DHH_SEX';
/**
 * Adds scenario methods to the model argument
 *
 * @export
 * @param {Model} model The Model argument to augment. Each algorithm
 * object within the model will be extended to add scenario methods
 * to it
 * @returns {IScenarioModel}
 */

function addScenarioMethods(model) {
  return _model.ModelFactory.extendModel(model, {
    runScenarioForPopulation: runScenarioForPopulation,
    runScenariosForPopulation: runScenariosForPopulation
  });
}

function runScenarioForPopulation(population, scenario, time) {
  return this.runScenariosForPopulation(population, [scenario], time);
}

function runScenariosForPopulation(population, scenarios, time) {
  var _this = this;

  // Clone population because we'll be modifying it for processing
  var clonedPopulation = (0, _cloneDeep2.default)(population);
  var variablePrevalenceMap = {};
  var totalRisk = 0; // Iterate over population to calculate prevalences

  clonedPopulation.forEach(function (individual) {
    var algorithm = _this.getAlgorithmForData(individual);

    scenarios.forEach(function (scenario) {
      var sexConfig = getScenarioConfigForSex(individual, scenario);
      sexConfig.variables.forEach(function (variable) {
        var variableName = variable.variableName;
        /* Try to find datum. If it doesn't exist, the field must be a derived field, and
        should be added to the individual. Do this with the absorbing variable too */

        try {
          (0, _data.findDatumWithName)(variableName, individual);
        } catch (e) {
          var derivedVariable = algorithm.findDataField(variableName);
          individual.push({
            name: variableName,
            coefficent: derivedVariable.calculateCoefficent(individual, algorithm.userFunctions, algorithm.tables)
          });
        } // Increment the prevalence of this variable if individual is exposed and variable is categorical


        if (isVariableWithinRange(individual, variable) && isCategoricalMethod(variable)) {
          var absorbingVariable = variable.absorbingVariable;
          var prevalence = variablePrevalenceMap[variableName] || 0;
          variablePrevalenceMap[variableName] = prevalence + 1;

          try {
            (0, _data.findDatumWithName)(absorbingVariable, individual);
          } catch (e) {
            var derivedAbsorbingVariable = algorithm.findDataField(absorbingVariable);
            individual.push({
              name: absorbingVariable,
              coefficent: derivedAbsorbingVariable.calculateCoefficent(individual, algorithm.userFunctions, algorithm.tables)
            });
          }
        }
      });
    });
  }); // Update prevalences to percentages

  Object.keys(variablePrevalenceMap).forEach(function (variable) {
    return variablePrevalenceMap[variable] = variablePrevalenceMap[variable] / clonedPopulation.length;
  }); // Iterate over population and calculate individual risks

  clonedPopulation.forEach(function (individual) {
    scenarios.forEach(function (scenario) {
      var sexConfig = getScenarioConfigForSex(individual, scenario);
      var scenarioVariablesToModify = sexConfig.variables.filter(function (variable) {
        return isVariableWithinRange(individual, variable);
      });
      scenarioVariablesToModify.forEach(function (scenarioVariable) {
        var targetVariable = (0, _data.findDatumWithName)(scenarioVariable.variableName, individual);

        if (isCategoricalMethod(scenarioVariable)) {
          var targetVariablePrevalence = variablePrevalenceMap[scenarioVariable.variableName];
          var relativeChange = calculateRelativeChange(scenarioVariable, targetVariablePrevalence);
          var absorbingVariable = (0, _data.findDatumWithName)(scenarioVariable.absorbingVariable, individual);
          targetVariable.coefficent = String(Number(targetVariable.coefficent) * (1 - relativeChange));
          absorbingVariable.coefficent = String(Number(absorbingVariable.coefficent) + relativeChange);
        } else {
          runTargetVariableMethodContinuous(scenarioVariable, targetVariable);
        }

        applyPostScenarioRange(targetVariable, scenarioVariable);
      });
    });
    totalRisk += _this.getAlgorithmForData(individual).getRiskToTime(individual, time);
  });
  return totalRisk / clonedPopulation.length;
}

function isVariableWithinRange(individual, scenarioVariable) {
  var _scenarioVariable$tar = _slicedToArray(scenarioVariable.targetPop, 2),
      min = _scenarioVariable$tar[0],
      max = _scenarioVariable$tar[1];

  if (min === null) min = -Infinity;
  if (max === null) max = Infinity;
  var variableValue = Number((0, _data.findDatumWithName)(scenarioVariable.variableName, individual).coefficent);
  return variableValue >= min && variableValue <= max;
}
/**
 * @description Update individual's variable value according to the variable method
 * @param scenarioVariable Scenario variable
 * @param targetVariable Individual's variable to be modified
 * @param targetVariablePrevalence Variables prevalence
 */


function runTargetVariableMethodContinuous(scenarioVariable, targetVariable) {
  var coefficient = Number(targetVariable.coefficent);

  switch (scenarioVariable.method) {
    case _scenarioVariable.ScenarioMethods.AbsoluteScenario:
      {
        targetVariable.coefficent = coefficient + scenarioVariable.scenarioValue;
        break;
      }

    case _scenarioVariable.ScenarioMethods.AttributionScenario:
      {
        targetVariable.coefficent = scenarioVariable.scenarioValue;
        break;
      }

    case _scenarioVariable.ScenarioMethods.RelativeScenario:
      {
        targetVariable.coefficent = coefficient * (1 + scenarioVariable.scenarioValue);
      }
  }

  targetVariable.coefficent = targetVariable.coefficent.toString();
}

function isCategoricalMethod(scenarioVariable) {
  switch (scenarioVariable.method) {
    case _scenarioVariable.ScenarioMethods.RelativeScenarioCat:
    case _scenarioVariable.ScenarioMethods.TargetScenarioCat:
    case _scenarioVariable.ScenarioMethods.AbsoluteScenarioCat:
      return true;
  }

  return false;
}

function getScenarioConfigForSex(individual, scenario) {
  var sex = Number((0, _data.findDatumWithName)(sexVariable, individual).coefficent);
  if (sex === Sexes.male) return scenario.male;else return scenario.female;
}
/**
 * @description Limit a variable to ensure it's new value is within the scenario post-calculation range
 * @param targetVariable Target variable
 * @param scenarioVariable Scenario variable
 */


function applyPostScenarioRange(targetVariable, scenarioVariable) {
  if (scenarioVariable.postScenarioRange) {
    var updatedTargetValue = scenarioVariable.scenarioValue; // Ensure new value is limited to be within scenario min/max range

    var _scenarioVariable$pos = _slicedToArray(scenarioVariable.postScenarioRange, 2),
        min = _scenarioVariable$pos[0],
        max = _scenarioVariable$pos[1];

    if (min === null) min = -Infinity;
    if (max === null) max = Infinity;
    if (updatedTargetValue < min) updatedTargetValue = min;else if (updatedTargetValue > max) updatedTargetValue = max;
    targetVariable.coefficent = updatedTargetValue.toString();
  }
}

function calculateRelativeChange(scenarioVariable, targetVariablePrevalence) {
  switch (scenarioVariable.method) {
    case _scenarioVariable.ScenarioMethods.AbsoluteScenarioCat:
      {
        return scenarioVariable.scenarioValue / targetVariablePrevalence;
      }

    case _scenarioVariable.ScenarioMethods.TargetScenarioCat:
      {
        return (scenarioVariable.scenarioValue - targetVariablePrevalence) / targetVariablePrevalence;
      }

    case _scenarioVariable.ScenarioMethods.RelativeScenarioCat:
      {
        return scenarioVariable.scenarioValue;
      }
  }
}
//# sourceMappingURL=add-scenario-methods.js.map