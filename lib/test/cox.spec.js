"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test = require("tape");
const chai_1 = require("chai");
const algorithm_1 = require("../engine/algorithm");
const time_metric_1 = require("../engine/cox/time-metric");
const field_1 = require("../engine/field");
const op_type_1 = require("../engine/op-type");
const cox_1 = require("../engine/cox/cox");
const moment = require("moment");
test(`getSurvivalToTimeForCoxWithBins function`, t => {
    const covariate = {
        fieldType: field_1.FieldType.NonInteractionCovariate,
        beta: 10,
        referencePoint: undefined,
        customFunction: undefined,
        name: 'covariateOne',
        displayName: '',
        extensions: {},
        opType: op_type_1.OpType.Continuous,
        min: -Infinity,
        max: Infinity,
        derivedField: undefined,
    };
    const maximumTime = 1800;
    const coxWithBins = {
        algorithmType: algorithm_1.AlgorithmType.Cox,
        timeMetric: time_metric_1.TimeMetric.Days,
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
    const data = [
        {
            name: covariate.name,
            coefficent: 1,
        },
    ];
    const time = moment();
    time.add('days', maximumTime / 2);
    chai_1.expect(cox_1.getSurvivalToTimeWithBins(coxWithBins, data, time), `Invalid survival value returned`).to.equal(0.49);
    t.pass(`Survival correctly calculated`);
    t.end();
});
//# sourceMappingURL=cox.spec.js.map