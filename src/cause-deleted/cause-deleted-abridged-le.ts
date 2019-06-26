import { AbridgedLifeExpectancy } from '../engine/abridged-life-expectancy/abridged-life-expectancy';
import { CauseDeletedRef } from './cause-deleted-ref';
import { CauseDeletedModel } from './cause-deleted-risk';
import { Data } from '../engine/data';
import { IExternalPredictor } from './external-predictor';
import { CovariateGroup } from '../engine/data-field/covariate/covariate-group';
import { addCauseDeleted as addCauseDeletedToModel } from './cause-deleted-risk';
import { extendObject } from '../util/extend';
import { getCauseDeletedQx } from './cause-deleted-le';

export interface ICauseDeletedAbridgedLE extends AbridgedLifeExpectancy {
    model: CauseDeletedModel;
    calculateCDForPopulation: typeof calculateCDForPopulation;
    calculateCDForIndividual: typeof calculateCDForIndividual;
}

/**
 * Adds cause deleted methods to the Abridged life expectancy object
 *
 * @export
 * @param {AbridgedLifeExpectancy} abridgedLE Object to extend
 * @param {CauseDeletedRef} riskFactorRef A JSON array containing the
 * reference exposure values to use for each algorithm when calculating
 * cause deleted
 * @returns {ICauseDeletedAbridgedLE}
 */
export function addCauseDeleted(
    abridgedLE: AbridgedLifeExpectancy,
    riskFactorRef: CauseDeletedRef,
): ICauseDeletedAbridgedLE {
    return extendObject(abridgedLE, {
        model: addCauseDeletedToModel(abridgedLE.model, riskFactorRef),
        calculateCDForIndividual,
        calculateCDForPopulation,
    });
}

function calculateCDForIndividual(
    this: ICauseDeletedAbridgedLE,
    externalPredictors: IExternalPredictor[],
    riskFactor: CovariateGroup,
    individual: Data,
): number {
    // Update the current getQx with the cause deleted Qx value so that the
    // LE method uses it in it's call
    const oldGetQx = this['getQx'];
    this['getQx'] = getCauseDeletedQx.bind(
        this,
        externalPredictors,
        riskFactor,
    );

    const causeDeletedLE = this.calculateForIndividual(individual);

    this['getQx'] = oldGetQx;

    return causeDeletedLE;
}

function calculateCDForPopulation(
    this: ICauseDeletedAbridgedLE,
    externalPredictors: IExternalPredictor[],
    riskFactor: CovariateGroup,
    population: Data[],
): number {
    // Update the current getQx with the cause deleted Qx value so that the
    // LE method uses it in it's call
    const oldGetQx = this['getQx'];
    this['getQx'] = getCauseDeletedQx.bind(
        this,
        externalPredictors,
        riskFactor,
    );

    const causeDeletedLE = this.calculateForPopulation(population);

    this['getQx'] = oldGetQx;

    return causeDeletedLE;
}
