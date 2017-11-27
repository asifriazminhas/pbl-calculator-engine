import { GenericMultipleAlgorithmModel } from './generic-multiple-algorithm-model';
import { Algorithm } from '../algorithm';
import { updateBaseline, IBaselineObject } from '../algorithm';
import { Data } from '../data';
import { getPredicateResult } from './predicate';
import { throwErrorIfUndefined } from '../undefined';
import { NoBaselineFoundForAlgorithm } from '../errors';

export type MultipleAlgorithmModel = GenericMultipleAlgorithmModel<Algorithm>;

export function getAlgorithmForData(
    multipleAlgorithmModel: MultipleAlgorithmModel,
    data: Data,
): Algorithm {
    const matchedAlgorithm = multipleAlgorithmModel.algorithms.find(
        algorithmWithPredicate => {
            return getPredicateResult(data, algorithmWithPredicate.predicate);
        },
    );

    if (!matchedAlgorithm) {
        throw new Error(`No matched algorithm found`);
    }

    return matchedAlgorithm.algorithm;
}

export type NewBaseline = Array<{
    predicateData: Data;
    newBaseline: IBaselineObject;
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

            return updateBaseline(algorithm, newBaselineForCurrentAlgorithm);
        }),
    });
}
