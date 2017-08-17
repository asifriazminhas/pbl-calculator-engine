"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_field_1 = require("./data_field");
const undefined_1 = require("../../common/undefined");
const lodash_1 = require("lodash");
function mergeDataDictionary(dataDictionaryOne, dataDictionaryTwo) {
    const mergedDataFields = data_field_1.mergeDataFields(dataDictionaryOne ? undefined_1.returnEmptyArrayIfUndefined(dataDictionaryOne.DataField) : [], dataDictionaryTwo ? undefined_1.returnEmptyArrayIfUndefined(dataDictionaryTwo.DataField) : []);
    return {
        DataField: mergedDataFields,
        $: {
            numberOfFields: lodash_1.toString(mergedDataFields.length)
        }
    };
}
exports.mergeDataDictionary = mergeDataDictionary;
//# sourceMappingURL=data_dictionary.js.map