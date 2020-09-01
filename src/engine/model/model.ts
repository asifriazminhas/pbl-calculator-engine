import { Predicate } from '../predicate/predicate';
import { Data } from '../data';
import { ModelAlgorithm } from './model-algorithm';
import { CoxSurvivalAlgorithm } from '../algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm';
import { throwErrorIfUndefined } from '../../util/undefined';
import { NoBaselineFoundForAlgorithm } from '../errors';
import { IModelJson } from '../../parsers/json/json-model';
import { NoPredicateObjectFoundError } from '../predicate/predicate-errors';
import { BaselineJson } from '../../parsers/json/json-baseline';
import { DataField } from '../data-field/data-field';
import { flatten, uniqBy } from 'lodash';
import { Algorithm } from '../algorithm/algorithm';
import { JsonAlgorithms } from '../../parsers/json/json-algorithms';
import { AlgorithmType } from '../../parsers/json/algorithm-type';
import { SimpleAlgorithm } from '../algorithm/simple-algorithm/simple-algorithm';

export type NewBaseline = Array<{
    predicateData: Data;
    newBaseline: BaselineJson;
}>;

export class Model<T extends Algorithm> {
    name: string;
    algorithms: Array<ModelAlgorithm<T>>;
    modelFields: DataField[];

    constructor(modelJson: IModelJson<JsonAlgorithms>) {
        this.name = modelJson.name;
        this.algorithms = modelJson.algorithms.map(algorithmWithPredicate => {
            let algorithm: Algorithm;
            const algorithmJson = algorithmWithPredicate.algorithm;
            switch (algorithmJson.algorithmType) {
                case AlgorithmType.CoxSurvivalAlgorithm: {
                    algorithm = new CoxSurvivalAlgorithm(algorithmJson);
                    break;
                }
                case AlgorithmType.SimpleAlgorithm: {
                    algorithm = new SimpleAlgorithm(algorithmJson);
                    break;
                }
                default: {
                    throw new Error(
                        `Trying to parse unknown algorithm JSON ${algorithmJson}`,
                    );
                }
            }

            const predicate = new Predicate(
                algorithmWithPredicate.predicate.equation,
                algorithmWithPredicate.predicate.variables,
            );

            return new ModelAlgorithm(algorithm as T, predicate);
        });
        this.modelFields = modelJson.modelFields.map(modelField => {
            return new DataField(modelField);
        });
    }

    getAlgorithmForData(data: Data): T {
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

    updateBaselineForModel(
        this: Model<CoxSurvivalAlgorithm>,
        newBaselines: NewBaseline,
    ): Model<CoxSurvivalAlgorithm> {
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

    /**
     * Returns all the fields used in the model and all it's algorithms
     *
     * @returns {DataField[]}
     * @memberof Model
     */
    getAllFields(): DataField[] {
        return uniqBy(
            this.modelFields.concat(
                flatten(
                    flatten(
                        this.algorithms
                            .map(({ algorithm }) => {
                                return algorithm;
                            })
                            .map(algorithm => {
                                if (algorithm instanceof CoxSurvivalAlgorithm) {
                                    return flatten(
                                        algorithm.covariates.map(covariate => {
                                            return covariate
                                                .getDescendantFields()
                                                .concat(covariate);
                                        }),
                                    );
                                } else if (
                                    algorithm instanceof SimpleAlgorithm
                                ) {
                                    return algorithm.output
                                        .getDescendantFields()
                                        .concat(algorithm.output);
                                } else {
                                    throw new Error(`Unknown algorithm type`);
                                }
                            }),
                    ),
                ),
            ),
            field => {
                return field.name;
            },
        );
    }

    getModelRequiredFields() {
        return this.modelFields.filter(field => field.isRequired);
    }

    getModelRecommendedFields() {
        return this.modelFields.filter(field => field.isRecommended);
    }
}
