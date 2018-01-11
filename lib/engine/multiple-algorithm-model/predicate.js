"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=predicate.js.map