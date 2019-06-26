import { UnAbridgedLifeExpectancy } from '../engine/unabridged-life-expectancy';
import { CauseDeletedModel } from './cause-deleted-risk';
import { IExternalPredictor } from './external-predictor';
import { CovariateGroup } from '../engine/data-field/covariate/covariate-group';
import { Data } from '../engine/data';
import { CauseDeletedRef } from './cause-deleted-ref';
import { addCauseDeleted as addCauseDeletedToModel } from './cause-deleted-risk';
import { extendObject } from '../util/extend';

export interface ICauseDeletedUnAbridgedLE extends UnAbridgedLifeExpectancy {
    model: CauseDeletedModel;
    calculateCDForIndividual: typeof calculateCDForIndividual;
}

export function addCauseDeleted(
    abridgedLE: UnAbridgedLifeExpectancy,
    riskFactorRef: CauseDeletedRef,
): ICauseDeletedUnAbridgedLE {
    return extendObject(abridgedLE, {
        model: addCauseDeletedToModel(abridgedLE.model, riskFactorRef),
        calculateCDForIndividual,
    });
}

function calculateCDForIndividual(
    this: ICauseDeletedUnAbridgedLE,
    externalPredictors: IExternalPredictor[],
    riskFactor: CovariateGroup,
    individual: Data,
): number {
    const oldQx = this['getQx'];
    this['getQx'] = getQx.bind(this, externalPredictors, riskFactor);

    const individualCD = this.calculateForIndividual(individual);

    this['getQx'] = oldQx;

    return individualCD;
}

function getQx(
    this: ICauseDeletedUnAbridgedLE,
    externalPredictors: IExternalPredictor[],
    riskFactor: CovariateGroup,
    individual: Data,
): number {
    return this.model
        .getAlgorithmForData(individual)
        .getCauseDeletedRisk(externalPredictors, riskFactor, individual);
}
