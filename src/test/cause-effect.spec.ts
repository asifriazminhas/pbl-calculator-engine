import * as test from 'tape';
import { getForRiskFactorFunction } from '../engine/cause-effect/cause-effect';
import { SurvivalModelBuilder } from '../engine/survival-model-builder/survival-model-builder';
import { expect } from 'chai';

test(`Cause Effect`, async t => {
    // tslint:disable-next-line
    const MportCauseEffectReference = require('@ottawamhealth/pbl-calculator-engine-assets/MPoRT/cause-effect-ref.json');
    const MportModelJson = require('@ottawamhealth/pbl-calculator-engine-assets/MPoRT/model.json');

    const mportModel = await SurvivalModelBuilder.buildFromModelJson(
        MportModelJson,
    );

    const withMportRiskFactor = getForRiskFactorFunction(
        MportCauseEffectReference,
    );

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

    const expectedRiskToTime = mportModel.getRiskToTime(
        data.concat(MportCauseEffectReference.male.Smoking),
    );
    const causeEffectRiskToTime = withMportRiskFactor
        .withRiskFactor('Smoking')
        .getCauseEffect(mportModel.getRiskToTime)
        .withData(data);

    expect(expectedRiskToTime).to.equal(causeEffectRiskToTime);

    t.pass(`Cause effect with risk to time`);
    t.end();
});
