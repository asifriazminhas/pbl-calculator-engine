import { Model } from '../model/model';
import {
    ReferencePopulation,
    RefPopsWithPredicate,
} from './reference-population';
import { getHealthAge } from './health-age';
import { Data } from '../data';
import { Predicate } from '../predicate/predicate';
import { NoPredicateObjectFoundError } from '../predicate/predicate-errors';
import { CoxSurvivalAlgorithm } from '../model';

export class RefPopFunctions {
    private model: Model<CoxSurvivalAlgorithm>;
    private refPop: ReferencePopulation | RefPopsWithPredicate;

    constructor(
        model: Model<CoxSurvivalAlgorithm>,
        refPop: ReferencePopulation | RefPopsWithPredicate,
    ) {
        this.model = model;
        this.refPop = refPop;
    }

    public getHealthAge = (data: Data): number => {
        let refPopToUse: ReferencePopulation;
        if ((this.refPop as RefPopsWithPredicate)[0].predicate) {
            try {
                refPopToUse = Predicate.getFirstTruePredicateObject(
                    (this.refPop as RefPopsWithPredicate).map(
                        currentRefProp => {
                            return Object.assign({}, currentRefProp, {
                                predicate: new Predicate(
                                    currentRefProp.predicate.equation,
                                    currentRefProp.predicate.variables,
                                ),
                            });
                        },
                    ),
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

        return getHealthAge(
            refPopToUse,
            data,
            this.model.getAlgorithmForData(data),
        );
    };
}
