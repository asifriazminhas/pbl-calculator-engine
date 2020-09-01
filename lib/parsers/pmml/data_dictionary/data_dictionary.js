"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeDataDictionary = mergeDataDictionary;

var _toString2 = _interopRequireDefault(require("lodash/toString"));

var _data_field = require("./data_field");

var _undefined = require("../../../util/undefined");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mergeDataDictionary(dataDictionaryOne, dataDictionaryTwo) {
  var mergedDataFields = (0, _data_field.mergeDataFields)(dataDictionaryOne ? (0, _undefined.returnEmptyArrayIfUndefined)(dataDictionaryOne.DataField) : [], dataDictionaryTwo ? (0, _undefined.returnEmptyArrayIfUndefined)(dataDictionaryTwo.DataField) : []);
  return {
    DataField: mergedDataFields,
    $: {
      numberOfFields: (0, _toString2.default)(mergedDataFields.length)
    }
  };
}
//# sourceMappingURL=data_dictionary.js.map