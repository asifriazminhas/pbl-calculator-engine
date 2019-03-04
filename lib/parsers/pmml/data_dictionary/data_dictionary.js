"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var data_field_1 = require("./data_field");

var undefined_1 = require("../../../util/undefined");

var lodash_1 = require("lodash");

function mergeDataDictionary(dataDictionaryOne, dataDictionaryTwo) {
  var mergedDataFields = data_field_1.mergeDataFields(dataDictionaryOne ? undefined_1.returnEmptyArrayIfUndefined(dataDictionaryOne.DataField) : [], dataDictionaryTwo ? undefined_1.returnEmptyArrayIfUndefined(dataDictionaryTwo.DataField) : []);
  return {
    DataField: mergedDataFields,
    $: {
      numberOfFields: lodash_1.toString(mergedDataFields.length)
    }
  };
}

exports.mergeDataDictionary = mergeDataDictionary;
//# sourceMappingURL=data_dictionary.js.map