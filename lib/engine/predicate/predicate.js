"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const undefined_1 = require("../../util/undefined/undefined");
const predicate_errors_1 = require("./predicate-errors");
class Predicate {
    constructor(equation, variables) {
        this.equation = equation;
        this.variables = variables;
    }
    // tslint:disable-next-line:member-ordering
    static getFirstTruePredicateObject(predicateObjs, data) {
        return undefined_1.throwErrorIfUndefined(predicateObjs.find(predicateObj => {
            return predicateObj.predicate.getPredicateResult(data);
        }), new predicate_errors_1.NoPredicateObjectFoundError(data));
    }
    getPredicateResult(data) {
        const obj = data
            .filter(datum => this.variables.indexOf(datum.name) > -1)
            .reduce((currentObj, currentDatum) => {
            return Object.assign({}, currentObj, {
                [currentDatum.name]: currentDatum.coefficent,
            });
        }, {});
        // tslint:disable-next-line
        obj;
        // tslint:disable-next-line
        let predicateResult = false;
        eval(this.equation);
        return predicateResult;
    }
}
exports.Predicate = Predicate;
//# sourceMappingURL=predicate.js.map