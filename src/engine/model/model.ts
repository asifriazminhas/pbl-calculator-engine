import { Predicate } from '../predicate/predicate';
import { Data } from '../data';
import { ModelAlgorithm } from './model-algorithm';
import { CoxSurvivalAlgorithm } from '../algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm';
import { throwErrorIfUndefined } from '../../util/undefined';
import { NoBaselineFoundForAlgorithm } from '../errors';
import { IModelJson } from '../../parsers/json/json-model';
import { NoPredicateObjectFoundError } from '../predicate/predicate-errors';
import { BaselineJson } from '../../parsers/json/json-baseline';

export type NewBaseline = Array<{
    predicateData: Data;
    newBaseline: BaselineJson;
}>;

export class Model {
    name: string;
    algorithms: ModelAlgorithm[];

    constructor(modelJson: IModelJson) {
        this.name = '';
        this.algorithms = modelJson.algorithms.map(
            ({ algorithm, predicate }) => {
                return new ModelAlgorithm(
                    new CoxSurvivalAlgorithm(algorithm),
                    new Predicate(predicate.equation, predicate.variables),
                );
            },
        );
    }

    getAlgorithmForData(data: Data): CoxSurvivalAlgorithm {
        try {
            return Predicate.getFirstTruePredicateObject(this.algorithms, data)
                .algorithm;
        } catch (err) {
            if (err instanceof NoPredicateObjectFoundError) {
                throw new Error(`No matched algorithm found`);
            }

            throw err;
        }
    }

    updateBaselineForModel(newBaselines: NewBaseline): Model {
        return Object.setPrototypeOf(
            Object.assign({}, this, {
                algorithms: this.algorithms.map(({ predicate, algorithm }) => {
                    const newBaselineForCurrentAlgorithm = throwErrorIfUndefined(
                        newBaselines.find(({ predicateData }) => {
                            return predicate.getPredicateResult(predicateData);
                        }),
                        new NoBaselineFoundForAlgorithm(algorithm.name),
                    );

                    return algorithm.updateBaseline(
                        newBaselineForCurrentAlgorithm.newBaseline,
                    );
                }),
            }),
            Model.prototype,
        );
    }
}
