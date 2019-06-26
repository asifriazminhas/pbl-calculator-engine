import {
    Model,
    Data,
    CoxSurvivalAlgorithm,
    ModelFactory,
} from '../engine/model';
import { IGenderSpecificCauseEffectRef } from '../engine/cause-effect';
import { updateDataWithData } from '../engine/data';
import { CovariateGroup } from '../engine/data-field/covariate/covariate-group';
import { CauseDeletedRef } from './cause-deleted-ref';
import { IExternalPredictor } from './external-predictor';
import * as moment from 'moment';

export type CauseDeletedModel = Model<CauseDeletedCox>;
type CauseDeletedCox = CoxSurvivalAlgorithm & {
    getCauseDeletedRisk: typeof getCauseDeletedRisk;
    riskFactorRef: IGenderSpecificCauseEffectRef;
};

/**
 * Adds cause deleted methods to the model argument
 *
 * @export
 * @param {Model} model The Model argument to augment. Each algorithm object
 * within the model will be extended to add cause deleted methods to it
 * @param {CauseDeletedRef} riskFactorRef A JSON array containing the reference
 * exposure values to use for each algorithm when calculating cause deleted
 * @returns {CauseDeletedModel}
 */
export function addCauseDeleted(
    model: Model,
    riskFactorRef: CauseDeletedRef,
): CauseDeletedModel {
    const newCoxProperties = model.algorithms.map(modelAlgorithm => {
        const riskFactorRefForCurrentAlgorithm = riskFactorRef.find(ref => {
            // Check whether the current reference is for this algorithm
            return modelAlgorithm.predicate.getPredicateResult([
                {
                    name: ref.sexVariable,
                    coefficent: ref.sexValue,
                },
            ]);
        });
        if (!riskFactorRefForCurrentAlgorithm) {
            throw new Error(
                `No exposure reference object for algorithm ${modelAlgorithm
                    .algorithm.name}`,
            );
        }

        return {
            riskFactorRef: riskFactorRefForCurrentAlgorithm.ref,
            getCauseDeletedRisk,
        };
    });

    return ModelFactory.extendModel(model, newCoxProperties);
}

function getCauseDeletedRisk(
    this: CauseDeletedCox,
    externalPredictors: IExternalPredictor[],
    riskFactor: CovariateGroup,
    data: Data,
    time?: Date | moment.Moment,
): number {
    // Add in the external predictors, replacing any current predictors which
    // match up with it
    const updatedAlgorithm = externalPredictors.reduce(
        (currentAlgorithm, predictor) => {
            return currentAlgorithm.replaceCovariate(predictor);
        },
        this,
    );
    // Remove all the covariates for this risk factor which are part of the
    // external predictors
    updatedAlgorithm.covariates = updatedAlgorithm.covariates.filter(
        covariate => {
            if (covariate.isPartOfGroup(riskFactor)) {
                const isExternalPredictor =
                    externalPredictors.find(predictor => {
                        return predictor.name === covariate.name;
                    }) !== undefined;
                return isExternalPredictor;
            } else {
                return true;
            }
        },
    );

    // Risk calculated with the new algorithm
    const externalRisk = updatedAlgorithm.getRiskToTime(data, time);

    const riskFactorRefToUse = this.riskFactorRef[riskFactor];
    // Risk calculated by replacing certain profile values with the exposure
    // reference values
    const causeDeletedRisk = updatedAlgorithm.getRiskToTime(
        updateDataWithData(data, riskFactorRefToUse),
        time,
    );

    const causeDeletedRiskEffectExternal = externalRisk - causeDeletedRisk;

    const originalRisk = this.getRiskToTime(data, time);

    return causeDeletedRiskEffectExternal - originalRisk;
}
