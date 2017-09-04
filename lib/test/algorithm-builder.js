"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("source-map-support/register");
const index_1 = require("../index");
const path = require("path");
const assetsFolderPath = path.join(__dirname, '../../assets/test');
function test() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const algorithm = yield index_1.AlgorithmBuilder
            .buildSurvivalAlgorithm()
            .buildFromAssetsFolder(assetsFolderPath);
        const result = algorithm
            .addAlgorithm({})
            .withData([])
            .getRiskToTime()
            .getSurvivalToTime()
            .end();
        result.riskToTime;
        result.survivalToTime;
        const algorithmWithLifeTable = algorithm
            .addLifeTable([])
            .addAlgorithm({});
        const resultTwo = algorithmWithLifeTable
            .withData([])
            .getRiskToTime()
            .getSurvivalToTime()
            .getLifeExpectancy()
            .getLifeYearsLost('Smoking')
            .end();
        resultTwo;
        const algorithmWithLifeTableAndRefPop = algorithmWithLifeTable
            .addRefPop([])
            .addAlgorithm({});
        const resultThree = algorithmWithLifeTableAndRefPop
            .withData([])
            .getHealthAge();
        resultThree;
        console.log(algorithm.getSurvivalToTime([
            {
                name: 'age',
                coefficent: 21
            }
        ]));
    });
}
test()
    .then(() => {
    console.log('done');
    process.exit(0);
})
    .catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=algorithm-builder.js.map