import { GenericMultipleAlgorithmModel } from './generic-multiple-algorithm-model';
import { Cox, IBaselineHazardObject, updateBaselineHazard } from '../cox';
import { Data } from '../data';
import { getPredicateResult } from './predicate';
import { throwErrorIfUndefined } from '../undefined';
import { NoBaselineHazardFoundForAlgorithm } from '../errors';

export type MultipleAlgorithmModel = GenericMultipleAlgorithmModel<Cox>;

export function getAlgorithmForData(
    multipleAlgorithmModel: MultipleAlgorithmModel,
    data: Data,
): Cox {
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

export type NewBaselineHazard = Array<{
    predicateData: Data;
    newBaselineHazard: IBaselineHazardObject;
}>;
export function updateBaselineHazardForModel(
    model: MultipleAlgorithmModel,
    newBaselineHazards: NewBaselineHazard,
): MultipleAlgorithmModel {
    return Object.assign({}, model, {
        algorithms: model.algorithms.map(({ predicate, algorithm }) => {
            const newBaselineHazardForCurrentAlgorithm = throwErrorIfUndefined(
                newBaselineHazards.find(({ predicateData }) => {
                    return getPredicateResult(predicateData, predicate);
                }),
                new NoBaselineHazardFoundForAlgorithm(algorithm.name),
            );

            return updateBaselineHazard(
                algorithm,
                newBaselineHazardForCurrentAlgorithm,
            );
        }),
    });
}
