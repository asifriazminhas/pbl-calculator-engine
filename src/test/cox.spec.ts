import * as test from 'tape';
import { expect } from 'chai';

import { AlgorithmType } from '../engine/algorithm';
import { TimeMetric } from '../engine/cox/time-metric';
import { FieldType } from '../engine/field';
import { NonInteractionCovariate } from '../engine/covariate';
import { OpType } from '../engine/op-type';
import { Data } from '../engine/data';
import { ICoxWithBins, getSurvivalToTimeWithBins } from '../engine/cox/cox';
import * as moment from 'moment';

test(`getSurvivalToTimeForCoxWithBins function`, t => {
    const covariate: NonInteractionCovariate = {
        fieldType: FieldType.NonInteractionCovariate,
        beta: 10,
        referencePoint: undefined,
        customFunction: undefined,
        name: 'covariateOne',
        displayName: '',
        extensions: {},
        opType: OpType.Continuous,
        min: -Infinity,
        max: Infinity,
        derivedField: undefined,
    };

    const maximumTime = 1800;

    const coxWithBins: ICoxWithBins = {
        algorithmType: AlgorithmType.Cox,
        timeMetric: TimeMetric.Days,
        maximumTime: 1800,
        name: '',
        version: '',
        description: '',
        userFunctions: {},
        tables: {},
        covariates: [covariate],
        baseline: 1,
        binsData: {
            5: [
                {
                    survivalPercent: 100,
                    time: 0,
                },
                {
                    survivalPercent: 50,
                    time: maximumTime / 2,
                },
                {
                    survivalPercent: 49,
                    time: maximumTime / 2,
                },
                {
                    survivalPercent: 5,
                    time: maximumTime,
                },
            ],
        },
        binsLookup: [
            {
                minScore: 0,
                maxScore: 20,
                binNumber: 5,
            },
        ],
    };

    const data: Data = [
        {
            name: covariate.name,
            coefficent: 1,
        },
    ];

    const time = moment();
    time.add('days', maximumTime / 2);

    expect(
        getSurvivalToTimeWithBins(coxWithBins, data, time),
        `Invalid survival value returned`,
    ).to.equal(0.49);

    t.pass(`Survival correctly calculated`);
    t.end();
});
