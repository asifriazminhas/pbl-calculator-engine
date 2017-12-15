"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const covariate_1 = require("../covariate");
const index_1 = require("../data/index");
const lodash_1 = require("lodash");
const index_2 = require("../undefined/index");
const index_3 = require("../errors/index");
const index_4 = require("../field/index");
const index_5 = require("../op-type/index");
function calculateScore(algorithm, data) {
    return algorithm.covariates
        .map(covariate => covariate_1.getComponent(covariate, data, algorithm.userFunctions, algorithm.tables))
        .reduce(lodash_1.add, 0);
}
exports.calculateScore = calculateScore;
function getBaselineForData(algorithm, data) {
    if (typeof algorithm.baseline === 'number') {
        return algorithm.baseline;
    }
    else {
        const ageDatum = index_1.findDatumWithName('age', data);
        return index_2.throwErrorIfUndefined(algorithm.baseline[Number(ageDatum.coefficent)], new index_3.NoBaselineFoundForAge(ageDatum.coefficent));
    }
}
exports.getBaselineForData = getBaselineForData;
function addPredictor(algorithm, predictor) {
    let newCovariate = Object.assign({}, predictor, {
        fieldType: index_4.FieldType.NonInteractionCovariate,
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
            opType: index_5.OpType.Continuous,
            min: predictor.min,
            max: predictor.max,
        });
    }
    else {
        newCovariate = Object.assign({}, newCovariate, {
            opType: index_5.OpType.Categorical,
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
//# sourceMappingURL=regression-algorithm.js.map