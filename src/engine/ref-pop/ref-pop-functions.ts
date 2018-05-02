import { ModelTypes, getAlgorithmForModelAndData } from '../model';
import {
    ReferencePopulation,
    RefPopsWithPredicate,
} from './reference-population';
import { getHealthAge } from './health-age';
// @ts-ignore
import { Data, IDatum } from '../data';
import { getFirstTruePredicateObject } from '../multiple-algorithm-model/predicate/predicate';
import { NoPredicateObjectFoundError } from '../multiple-algorithm-model/predicate/predicate-errors';
import { CoxSurvivalAlgorithm } from '../algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm';

export class RefPopFunctions {
    private model: ModelTypes;
    private refPop: ReferencePopulation | RefPopsWithPredicate;

    constructor(
        model: ModelTypes,
        refPop: ReferencePopulation | RefPopsWithPredicate,
    ) {
        this.model = model;
        this.refPop = refPop;
    }

    public getHealthAge = (data: Data): number => {
        let refPopToUse: ReferencePopulation;
        if ((this.refPop as RefPopsWithPredicate)[0].predicate) {
            try {
                refPopToUse = getFirstTruePredicateObject(
                    this.refPop as RefPopsWithPredicate,
                    data,
                ).refPop;
            } catch (err) {
                if (err instanceof NoPredicateObjectFoundError) {
                    throw new Error(
                        `No matched ref pop found for data ${JSON.stringify(
                            data,
                            null,
                            2,
                        )}`,
                    );
                }

                throw err;
            }
        } else {
            refPopToUse = this.refPop as ReferencePopulation;
        }

        return getHealthAge(refPopToUse, data, getAlgorithmForModelAndData(
            this.model,
            data,
        ) as CoxSurvivalAlgorithm);
    };
}
