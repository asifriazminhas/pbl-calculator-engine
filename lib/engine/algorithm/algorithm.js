"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("../data");
const covariate_1 = require("../covariate");
const lodash_1 = require("lodash");
const field_1 = require("../field");
const op_type_1 = require("../op-type");
const undefined_1 = require("../undefined");
const errors_1 = require("../errors");
function calculateScore(algorithm, data) {
    return algorithm.covariates
        .map(covariate => covariate_1.getComponent(covariate, data, algorithm.userFunctions))
        .reduce(lodash_1.add);
}
exports.calculateScore = calculateScore;
function getBaselineForData(algorithm, data) {
    if (typeof algorithm.baseline === 'number') {
        return algorithm.baseline;
    }
    else {
        const ageDatum = data_1.findDatumWithName('age', data);
        return undefined_1.throwErrorIfUndefined(algorithm.baseline[Number(ageDatum.coefficent)], new errors_1.NoBaselineFoundForAge(ageDatum.coefficent));
    }
}
exports.getBaselineForData = getBaselineForData;
function addPredictor(algorithm, predictor) {
    let newCovariate = Object.assign({}, predictor, {
        fieldType: field_1.FieldType.NonInteractionCovariate,
        beta: predictor.betaCoefficent,
        referencePoint: predictor.referencePoint ? predictor.referencePoint : 0,
        customFunction: undefined,
        name: predictor.name,
        displayName: '',
        extensions: {},
        derivedField: undefined,
    });
    if (predictor.type === 'continuous') {
        newCovariate = Object.assign({}, newCovariate, {
            opType: op_type_1.OpType.Continuous,
            min: predictor.min,
            max: predictor.max,
        });
    }
    else {
        newCovariate = Object.assign({}, newCovariate, {
            opType: op_type_1.OpType.Categorical,
            categories: predictor.categories,
        });
    }
    return Object.assign({}, algorithm, {
        covariates: algorithm.covariates.concat([newCovariate]),
    });
}
exports.addPredictor = addPredictor;
function updateBaseline(algorithm, newBaseline) {
    return Object.assign({}, algorithm, {
        baseline: newBaseline,
    });
}
exports.updateBaseline = updateBaseline;
//# sourceMappingURL=algorithm.js.map