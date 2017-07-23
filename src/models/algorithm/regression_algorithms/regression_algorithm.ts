import { Algorithm } from '../algorithm';
import { Datum } from '../../data/datum';
import { env } from '../../env/env';
import { flatten, add } from 'lodash';

export abstract class RegressionAlgorithm extends Algorithm {
    calculateScore(data: Array<Datum>): number {
        return this.covariates
            .map(covariate => covariate.getComponent(data))
            .reduce(add)
    }
}