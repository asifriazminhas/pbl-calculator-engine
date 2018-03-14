import { GenericMultipleAlgorithmModel } from './generic-multiple-algorithm-model';
import { Algorithm } from '../algorithm';
import { Data } from '../data';
import {
    getFirstTruePredicateObject,
    getPredicateResult,
} from './predicate/predicate';
import { throwErrorIfUndefined } from '../undefined';
import { NoBaselineFoundForAlgorithm } from '../errors';
import { updateBaseline } from '../regression-algorithm/regression-algorithm';
import { RegressionAlgorithmTypes } from '../regression-algorithm/regression-algorithm-types';
import { AlgorithmTypes } from '../algorithm/algorithm-types';
import { IBaselineMixin } from '../regression-algorithm/baseline/baseline';
import { NoPredicateObjectFoundError } from './predicate/predicate-errors';

export type MultipleAlgorithmModel<
    U extends AlgorithmTypes = AlgorithmTypes
> = GenericMultipleAlgorithmModel<U>;

export function getAlgorithmForData(
    multipleAlgorithmModel: MultipleAlgorithmModel,
    data: Data,
): Algorithm<any> {
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
    newBaseline: IBaselineMixin;
}>;
export function updateBaselineForModel(
    model: MultipleAlgorithmModel<RegressionAlgorithmTypes>,
    newBaselines: NewBaseline,
): MultipleAlgorithmModel<RegressionAlgorithmTypes> {
    return Object.assign({}, model, {
        algorithms: model.algorithms.map(({ predicate, algorithm }) => {
            const newBaselineForCurrentAlgorithm = throwErrorIfUndefined(
                newBaselines.find(({ predicateData }) => {
                    return getPredicateResult(predicateData, predicate);
                }),
                new NoBaselineFoundForAlgorithm(algorithm.name),
            );

            return updateBaseline(
                algorithm,
                newBaselineForCurrentAlgorithm.newBaseline,
            );
        }),
    });
}
