"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const test = require("tape");
const cause_effect_1 = require("../engine/cause-effect/cause-effect");
const survival_model_builder_1 = require("../engine/survival-model-builder/survival-model-builder");
const path = require("path");
const chai_1 = require("chai");
test(`Cause Effect`, (t) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    const MportCauseEffectReference = require('../../assets/test/algorithms/MPoRT/cause-effect.json');
    const mportModel = yield survival_model_builder_1.SurvivalModelBuilder.buildFromAssetsFolder(path.join(__dirname, '../../assets/test/algorithms/MPoRT'));
    const withMportRiskFactor = cause_effect_1.getForRiskFactorFunction(MportCauseEffectReference);
    const data = [
        {
            name: 'age',
            coefficent: 21,
        },
        {
            name: 'sex',
            coefficent: 'male',
        },
    ];
    const expectedRiskToTime = mportModel.getRiskToTime(data.concat(MportCauseEffectReference.male.Smoking));
    const causeEffectRiskToTime = withMportRiskFactor
        .withRiskFactor('Smoking')
        .getCauseEffect(mportModel.getRiskToTime)
        .withData(data);
    chai_1.expect(expectedRiskToTime).to.equal(causeEffectRiskToTime);
    t.pass(`Cause effect with risk to time`);
    t.end();
}));
//# sourceMappingURL=cause-effect.spec.js.map