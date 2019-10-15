import {
    Model,
    Data,
    CoxSurvivalAlgorithm,
    ModelFactory,
} from '../engine/model';
import { IGenderSpecificCauseEffectRef } from '../engine/cause-effect';
import { updateDataWithData, IDatum, findDatumWithName } from '../engine/data';
import { CauseDeletedRef } from './cause-deleted-ref';
import { IExternalPredictor } from './external-predictor';
import moment from 'moment';
import { RiskFactor } from '../risk-factors';
import { flatten } from 'lodash';
import { DerivedField } from '../engine/data-field/derived-field/derived-field';
import { Covariate } from '../engine/data-field/covariate/covariate';

export interface ICauseDeletedModel extends Model<CauseDeletedCox> {
    updateCauseDeletedRef: typeof updateCauseDeletedRef;
}
type CauseDeletedCox = CoxSurvivalAlgorithm & {
    getCauseDeletedRisk: typeof getCauseDeletedRisk;
    riskFactorRef: IGenderSpecificCauseEffectRef;
};

/**
 * Adds cause deleted methods to the model argument
 *
 * @export
 * @param {Model} model The Model argument to augment. Each algorithm
 * object within the model will be extended to add cause deleted methods
 * to it
 * @param {CauseDeletedRef} riskFactorRef A JSON array containing the
 * reference exposure values to use for each algorithm when calculating
 * cause deleted
 * @returns {CauseDeletedModel}
 */
export function addCauseDeleted(
    model: Model,
    riskFactorRef: CauseDeletedRef,
): ICauseDeletedModel {
    return ModelFactory.extendModel(
        model,
        { updateCauseDeletedRef },
        getCauseDeletedCoxProperties(model, riskFactorRef),
    );
}

function getCauseDeletedRisk(
    this: CauseDeletedCox,
    externalPredictors: IExternalPredictor[],
    riskFactors: RiskFactor[],
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
    // Remove all the covariates for this risk factor which are not part of the
    // external predictors
    updatedAlgorithm.covariates = updatedAlgorithm.covariates.filter(
        covariate => {
            const isPartOfGroup =
                riskFactors.find(riskFactor => {
                    return covariate.isPartOfGroup(riskFactor) === true;
                }) !== undefined;
            if (isPartOfGroup === true) {
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

    const referenceData = flatten(
        riskFactors.map(riskFactor => {
            return this.riskFactorRef[riskFactor];
        }),
    );
    const newData = data.concat(
        referenceData
            // Get all the reference datum objects which are not part of the input data
            .filter(refDatum => {
                try {
                    findDatumWithName(refDatum.name, data);
                    return false;
                } catch (err) {
                    return true;
                }
            })
            // For each reference datum objects that is not present in the
            // input data arg, construct the datum object for it using the
            // input data. If we cannot construct it then return the ref datum itself
            .map(refDatum => {
                const fieldForRefDatum = this.findDataField(refDatum.name);

                if (fieldForRefDatum instanceof DerivedField) {
                    return {
                        name: refDatum.name,
                        coefficent: fieldForRefDatum.calculateCoefficent(
                            fieldForRefDatum.calculateDataToCalculateCoefficent(
                                data,
                                this.userFunctions,
                                this.tables,
                            ),
                            this.userFunctions,
                            this.tables,
                        ),
                    };
                } else if (fieldForRefDatum instanceof Covariate) {
                    return {
                        name: refDatum.name,
                        coefficent: fieldForRefDatum.calculateCoefficient(
                            fieldForRefDatum.calculateDataToCalculateCoefficent(
                                data,
                                this.userFunctions,
                                this.tables,
                            ),
                            this.userFunctions,
                            this.tables,
                        ),
                    };
                } else {
                    return refDatum;
                }
            }),
    );
    // Risk calculated by replacing certain profile values with the exposure
    // reference values
    const causeDeletedRisk = updatedAlgorithm.getRiskToTime(
        updateDataWithReference(newData, referenceData),
        time,
    );

    const causeDeletedRiskEffectExternal = externalRisk - causeDeletedRisk;

    const originalRisk = this.getRiskToTime(data, time);

    return causeDeletedRiskEffectExternal - originalRisk;
}

function updateCauseDeletedRef(
    this: ICauseDeletedModel,
    newReference: CauseDeletedRef,
): ICauseDeletedModel {
    return ModelFactory.extendModel(
        this,
        {
            updateCauseDeletedRef,
        },
        getCauseDeletedCoxProperties(this, newReference),
    );
}

function getCauseDeletedCoxProperties(
    model: Model,
    causeDeletedRef: CauseDeletedRef,
) {
    return model.algorithms.map(modelAlgorithm => {
        const riskFactorRefForCurrentAlgorithm = causeDeletedRef.find(ref => {
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
}

function updateDataWithReference(
    data: Data,
    referenceData: Array<
        {
            clamp?: {
                lower?: boolean;
                upper?: boolean;
            };
        } & IDatum
    >,
) {
    const dataUpdate = referenceData.map(refDatum => {
        const datumInData = findDatumWithName(refDatum.name, data);

        if (refDatum.clamp !== undefined) {
            const refCoefficient = Number(refDatum.coefficent);
            const inputCoefficient = Number(datumInData.coefficent);

            if (
                inputCoefficient < refCoefficient &&
                refDatum.clamp.lower === true
            ) {
                return {
                    name: refDatum.name,
                    coefficent: refDatum.coefficent,
                };
            } else if (
                inputCoefficient > refCoefficient &&
                refDatum.clamp.upper === true
            ) {
                return {
                    name: refDatum.name,
                    coefficent: refDatum.coefficent,
                };
            } else {
                return datumInData;
            }
        }

        return refDatum;
    });

    return updateDataWithData(data, dataUpdate);
}
