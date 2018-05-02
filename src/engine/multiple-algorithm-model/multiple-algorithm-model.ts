import { GenericMultipleAlgorithmModel } from './generic-multiple-algorithm-model';
import { Data } from '../data';
import {
    getFirstTruePredicateObject,
    getPredicateResult,
} from './predicate/predicate';
import { throwErrorIfUndefined } from '../undefined';
import { NoBaselineFoundForAlgorithm } from '../errors';
import { NoPredicateObjectFoundError } from './predicate/predicate-errors';
import { CoxSurvivalAlgorithm } from '../algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm';

export type MultipleAlgorithmModel = GenericMultipleAlgorithmModel<
    CoxSurvivalAlgorithm
>;

export function getAlgorithmForData(
    multipleAlgorithmModel: MultipleAlgorithmModel,
    data: Data,
): CoxSurvivalAlgorithm {
    try {
        return getFirstTruePredicateObject(
            multipleAlgorithmModel.algorithms,
            data,
        ).algorithm;
    } catch (err) {
        if (err instanceof NoPredicateObjectFoundError) {
            throw new Error(`No matched algorithm found`);
        }

        throw err;
    }
}

export type NewBaseline = Array<{
    predicateData: Data;
    newBaseline:
        | number
        | {
              [index: number]: number;
          };
}>;
export function updateBaselineForModel(
    model: MultipleAlgorithmModel,
    newBaselines: NewBaseline,
): MultipleAlgorithmModel {
    return Object.assign({}, model, {
        algorithms: model.algorithms.map(({ predicate, algorithm }) => {
            const newBaselineForCurrentAlgorithm = throwErrorIfUndefined(
                newBaselines.find(({ predicateData }) => {
                    return getPredicateResult(predicateData, predicate);
                }),
                new NoBaselineFoundForAlgorithm(algorithm.name),
            );

            return algorithm.updateBaseline(
                newBaselineForCurrentAlgorithm.newBaseline,
            );
        }),
    });
}
