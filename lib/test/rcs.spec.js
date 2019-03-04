"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test = require("tape");
const test_utils_1 = require("./test-utils");
const data_1 = require("../engine/data");
const chai_1 = require("chai");
function testRcsForAlgorithm(algorithm, data, index) {
    const notFirstVariableRcsCovariate = algorithm.covariates.filter(currentCovariate => {
        return currentCovariate.customFunction !== undefined;
    });
    const dataWithoutSecondVariableCovariates = data.filter(datum => {
        return notFirstVariableRcsCovariate.find(covariate => {
            return covariate.name === datum.name;
        })
            ? false
            : true;
    });
    notFirstVariableRcsCovariate.forEach(currentNotFirstVaribleRcsCovariate => {
        const actualCoefficient = currentNotFirstVaribleRcsCovariate.calculateCoefficient(dataWithoutSecondVariableCovariates, algorithm.userFunctions, algorithm.tables);
        const expectedCoefficient = data_1.findDatumWithName(currentNotFirstVaribleRcsCovariate.name, data).coefficent;
        chai_1.expect(test_utils_1.getRelativeDifference(expectedCoefficient, actualCoefficient), `
                Name: ${currentNotFirstVaribleRcsCovariate.name}
                Expected: ${expectedCoefficient}
                Actual: ${actualCoefficient}
                index: ${index}
            `).to.be.lessThan(10);
    });
}
test(`RCS Function`, async (t) => {
    await test_utils_1.runIntegrationTest('score-data', 'score-data', 'RCS Function', ['RESPECT', 'MPoRT', 'SPoRT', 'MPoRTv2'], testRcsForAlgorithm, t);
});
//# sourceMappingURL=rcs.spec.js.map