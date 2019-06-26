import { AbridgedLifeExpectancy } from '../engine/abridged-life-expectancy/abridged-life-expectancy';
import { CauseDeletedRef } from './cause-deleted-ref';
import { CauseDeletedModel } from './cause-deleted-risk';
import { Data } from '../engine/data';
import { IExternalPredictor } from './external-predictor';
import { CovariateGroup } from '../engine/data-field/covariate/covariate-group';
import { addCauseDeleted as addCauseDeletedToModel } from './cause-deleted-risk';
import * as moment from 'moment';
import { extendObject } from '../util/extend';

export interface CauseDeletedAbridgedLE extends AbridgedLifeExpectancy {
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
 * @returns {CauseDeletedAbridgedLE}
 */
export function addCauseDeleted(
    abridgedLE: AbridgedLifeExpectancy,
    riskFactorRef: CauseDeletedRef,
): CauseDeletedAbridgedLE {
    return extendObject(abridgedLE, {
        model: addCauseDeletedToModel(abridgedLE.model, riskFactorRef),
        calculateCDForIndividual,
        calculateCDForPopulation,
    });
}

function calculateCDForIndividual(
    this: CauseDeletedAbridgedLE,
    externalPredictors: IExternalPredictor[],
    riskFactor: CovariateGroup,
    individual: Data,
): number {
    const oldGetQx = this['getQx'];
    this['getQx'] = getQx.bind(this, externalPredictors, riskFactor);

    const causeDeletedLE = this.calculateForIndividual(individual);

    this['getQx'] = oldGetQx;

    return causeDeletedLE;
}

function calculateCDForPopulation(
    this: CauseDeletedAbridgedLE,
    externalPredictors: IExternalPredictor[],
    riskFactor: CovariateGroup,
    population: Data[],
): number {
    const oldGetQx = this['getQx'];

    this['getQx'] = getQx.bind(this, externalPredictors, riskFactor);

    const causeDeletedLE = this.calculateForPopulation(population);

    this['getQx'] = oldGetQx;

    return causeDeletedLE;
}

function getQx(
    this: CauseDeletedAbridgedLE,
    externalPredictors: IExternalPredictor[],
    riskFactor: CovariateGroup,
    data: Data,
) {
    const OneYearFromToday = moment();
    OneYearFromToday.add(1, 'year');

    return this.model
        .getAlgorithmForData(data)
        .getCauseDeletedRisk(
            externalPredictors,
            riskFactor,
            data,
            OneYearFromToday,
        );
}
