"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const derived_field_1 = require("../derived-field");
const algorithm_json_1 = require("../algorithm/algorithm-json");
const undefined_1 = require("../undefined");
const errors_1 = require("../errors");
function parseSimpleAlgorithmJsonToSimpleAlgorithm(simpleAlgorithmJson) {
    const { derivedFields } = simpleAlgorithmJson, simpleAlgorithmJsonWithoutDerivedFields = tslib_1.__rest(simpleAlgorithmJson, ["derivedFields"]);
    const derivedFieldForOutput = undefined_1.throwErrorIfUndefined(derivedFields.find(derivedField => derivedField.name ===
        simpleAlgorithmJsonWithoutDerivedFields.output), new errors_1.NoDerivedFieldFoundError(simpleAlgorithmJson.output));
    return Object.assign({}, simpleAlgorithmJsonWithoutDerivedFields, {
        output: derived_field_1.parseDerivedFieldJsonToDerivedField(derivedFieldForOutput, derivedFields, []),
        userFunctions: algorithm_json_1.parseUserFunctions(simpleAlgorithmJson.userFunctions),
    });
}
exports.parseSimpleAlgorithmJsonToSimpleAlgorithm = parseSimpleAlgorithmJsonToSimpleAlgorithm;
//# sourceMappingURL=simple-algorithm-json.js.map