import { UnAbridgedLifeExpectancy } from '../engine/unabridged-life-expectancy';
import { ICauseDeletedModel } from './cause-deleted-risk';
import { IExternalPredictor } from './external-predictor';
import { Data } from '../engine/data';
import { CauseDeletedRef } from './cause-deleted-ref';
import { addCauseDeleted as addCauseDeletedToModel } from './cause-deleted-risk';
import { extendObject } from '../util/extend';
import { getCauseDeletedQx } from './cause-deleted-le';
import { RiskFactor } from '../risk-factors';

export interface ICauseDeletedUnAbridgedLE extends UnAbridgedLifeExpectancy {
    model: ICauseDeletedModel;
    calculateCDForIndividual: typeof calculateCDForIndividual;
}

export function addCauseDeleted(
    unAbridgedLE: UnAbridgedLifeExpectancy,
    riskFactorRef: CauseDeletedRef,
): ICauseDeletedUnAbridgedLE {
    return extendObject(unAbridgedLE, {
        model: addCauseDeletedToModel(unAbridgedLE.model, riskFactorRef),
        calculateCDForIndividual,
    });
}

function calculateCDForIndividual(
    this: ICauseDeletedUnAbridgedLE,
    externalPredictors: IExternalPredictor[],
    riskFactor: RiskFactor,
    individual: Data,
): number {
    // Update the current getQx with the cause deleted Qx value so that the
    // LE method uses it in it's call
    const oldQx = this['getQx'];
    this['getQx'] = getCauseDeletedQx.bind(
        this,
        externalPredictors,
        riskFactor,
    );

    const individualCD = this.calculateForIndividual(individual);

    this['getQx'] = oldQx;

    return individualCD;
}
