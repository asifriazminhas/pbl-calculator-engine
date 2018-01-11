"use strict";
/* tslint:disable no-shadowed-variable */
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const test = require("tape");
const chai_1 = require("chai");
// tslint:disable-next-line
const common_tags_1 = require("common-tags");
const data_1 = require("../engine/data");
const moment = require("moment");
test(`Coefficent.formatCoefficent`, t => {
    const covariate = {
        name: '',
        displayName: '',
        extensions: {},
        fieldType: 0,
        derivedField: undefined,
        customFunction: undefined,
        beta: 0,
        referencePoint: 0,
    };
    const coefficentsForReferenceTest = [null, undefined, 'NA', 'a'];
    coefficentsForReferenceTest.forEach(coefficent => {
        chai_1.expect(data_1.formatCoefficentForComponent(coefficent, covariate)).to.eql(covariate.referencePoint);
    });
    t.pass(`Correctly returns reference point`);
    const coefficentsForErrorTest = [moment(), new Date()];
    coefficentsForErrorTest.forEach(coefficent => {
        chai_1.expect(() => {
            data_1.formatCoefficentForComponent(coefficent, covariate);
        }).to.throw();
    });
    t.pass(common_tags_1.oneLine `Correctly throws an error`);
    const coefficentsForNumberTest = [1, '23'];
    coefficentsForNumberTest.forEach(coefficent => {
        chai_1.expect(data_1.formatCoefficentForComponent(coefficent, covariate)).to.equal(Number(coefficent));
    });
    t.pass(`Correctly returns a number`);
    t.end();
});
//# sourceMappingURL=coefficent.spec.js.map