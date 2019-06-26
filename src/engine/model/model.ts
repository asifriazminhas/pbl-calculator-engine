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

export type NewBaseline = Array<{
    predicateData: Data;
    newBaseline: BaselineJson;
}>;

export class Model<T extends CoxSurvivalAlgorithm = CoxSurvivalAlgorithm> {
    name: string;
    algorithms: Array<ModelAlgorithm<T>>;
    modelFields: DataField[];

    constructor(modelJson: IModelJson) {
        this.name = modelJson.name;
        this.algorithms = modelJson.algorithms.map(
            ({ algorithm, predicate }) => {
                return new ModelAlgorithm(
                    new CoxSurvivalAlgorithm(algorithm) as T,
                    new Predicate(predicate.equation, predicate.variables),
                );
            },
        );
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
                            .map(({ covariates }) => {
                                return covariates.map(covariate => {
                                    return covariate
                                        .getDescendantFields()
                                        .concat(covariate);
                                });
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
