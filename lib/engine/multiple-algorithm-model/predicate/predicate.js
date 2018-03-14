"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const undefined_1 = require("../../undefined");
const predicate_errors_1 = require("./predicate-errors");
function getPredicateResult(data, predicate) {
    const obj = data
        .filter(datum => predicate.variables.indexOf(datum.name) > -1)
        .reduce((currentObj, currentDatum) => {
        return Object.assign({}, currentObj, {
            [currentDatum.name]: currentDatum.coefficent,
        });
    }, {});
    // tslint:disable-next-line
    obj;
    // tslint:disable-next-line
    let predicateResult = false;
    eval(predicate.equation);
    return predicateResult;
}
exports.getPredicateResult = getPredicateResult;
function getFirstTruePredicateObject(objsWithPredicate, data) {
    return undefined_1.throwErrorIfUndefined(objsWithPredicate.find(currentObjWithPredicate => {
        return getPredicateResult(data, currentObjWithPredicate.predicate);
    }), new predicate_errors_1.NoPredicateObjectFoundError(data));
}
exports.getFirstTruePredicateObject = getFirstTruePredicateObject;
//# sourceMappingURL=predicate.js.map