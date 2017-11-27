import * as test from 'tape';
import { getForRiskFactorFunction } from '../engine/cause-effect/cause-effect';
import { SurvivalModelBuilder } from '../engine/survival-model-builder/survival-model-builder';
import * as path from 'path';
import { expect } from 'chai';

test(`Cause Effect`, async t => {
    const MportCauseEffectReference = require('../../assets/test/algorithms/MPoRT/cause-effect.json');

    const mportModel = await SurvivalModelBuilder.buildFromAssetsFolder(
        path.join(__dirname, '../../assets/test/algorithms/MPoRT'),
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
