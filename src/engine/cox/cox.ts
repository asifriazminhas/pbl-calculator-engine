import { Covariate, getComponent } from './covariate';
import { DerivedField } from './derived-field';
import { Data } from '../common/datum';
import { add } from 'lodash';
import { shouldLogDebugInfo} from '../common/env';

export interface Cox {
    name: string;
    version: string;
    description: string;
    covariates: Array<Covariate>;
    derivedFields: Array<DerivedField>;
    baselineHazard: number;
}

function calculateScore(
    cox: Cox,
    data: Data
): number {
    return cox.covariates
        .map(covariate => getComponent(covariate, data))
        .reduce(add);
}

export function getSurvival(
    cox: Cox,
    data: Data
): number {
    if (shouldLogDebugInfo() === true) {
        console.groupCollapsed(`Predictors`)
    }

    if (shouldLogDebugInfo()) {
        console.log(`Baseline Hazard: ${this.baselineHazard}`);
    }

    if (shouldLogDebugInfo() === true) {
        console.groupEnd();
    }

    const score = calculateScore(cox, data);

    return 1 - Math.pow(
        Math.E,
        -1 * cox.baselineHazard * Math.pow(Math.E, score)
    );
}