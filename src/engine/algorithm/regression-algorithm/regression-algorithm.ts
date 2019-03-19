import { Algorithm } from '../algorithm';
import { Covariate } from '../../data-field/covariate/covariate';
import { Data } from '../../data/data';
import { add, flatten, memoize } from 'lodash';
import { ICoxSurvivalAlgorithmJson } from '../../../parsers/json/json-cox-survival-algorithm';
import { parseCovariateJsonToCovariate } from '../../../parsers/json/json-covariate';
import { CovariateGroup } from '../../data-field/covariate/covariate-group';
import { DataField } from '../../data-field/data-field';
import { datumFactoryFromDataField } from '../../data/datum';

export abstract class RegressionAlgorithm extends Algorithm {
    covariates: Covariate[];

    protected getAllFields = memoize((): DataField[] => {
        return DataField.getUniqueDataFields(
            flatten(
                this.covariates.map(currentCovariate => {
                    return currentCovariate.getDescendantFields();
                }),
            ),
        );
    });

    constructor(regressionAlgorithmJson: ICoxSurvivalAlgorithmJson) {
        super(regressionAlgorithmJson);

        this.covariates = regressionAlgorithmJson.covariates.map(
            covariateJson => {
                return parseCovariateJsonToCovariate(
                    covariateJson,
                    regressionAlgorithmJson.covariates,
                    regressionAlgorithmJson.derivedFields,
                );
            },
        )
        .sort((a, b) => a.name.localeCompare(b.name));
    }

    calculateScore(data: Data): number {
        /* Go through all the covariates and calculate the data needed to
        calculate the coefficient for each one. On each loop we add the data
        returned to the currentData variable so that we don't recalculate data
        */
        const componentCalculationData = this.covariates.reduce(
            (currentData, covariate) => {
                const dataForCurrentCovariate = covariate.calculateDataToCalculateCoefficent(
                    currentData,
                    this.userFunctions,
                    this.tables,
                );

                return currentData.concat(dataForCurrentCovariate);
            },
            this.validateData(data),
        );

        return this.covariates
            .map(covariate =>
                covariate.getComponent(
                    componentCalculationData,
                    this.userFunctions,
                    this.tables,
                ),
            )
            .reduce(add, 0);
    }

    getCovariatesForGroup(group: CovariateGroup): Covariate[] {
        return this.covariates.filter(covariate => {
            return covariate.isPartOfGroup(group);
        });
    }

    getCovariatesWithoutGroup(group: CovariateGroup): Covariate[] {
        return this.covariates.filter(covariate => {
            return covariate.isPartOfGroup(group) === false;
        });
    }

    getAllFieldsForGroup(group: CovariateGroup): DataField[] {
        const covariatesForGroup = this.getCovariatesForGroup(group);

        return DataField.getUniqueDataFields(
            flatten(
                covariatesForGroup.map(currentCovariate => {
                    return currentCovariate.getDescendantFields();
                }),
            ),
        ).concat(covariatesForGroup);
    }

    /**
     * Goes through each datum in the data arg and does the following checks:
     * 1. Checks whether they are within the bounds defined by the interval
     * field on the corresponding DataField object. If they aren't, sets them
     * to either the lower or upper bound
     *
     * @private
     * @param {Data} data
     * @returns {Data}
     * @memberof RegressionAlgorithm
     */
    private validateData(data: Data): Data {
        const allDataFields = this.getAllFields();

        return data.map(datum => {
            const dataFieldForCurrentDatum = DataField.findDataFieldWithName(
                allDataFields,
                datum.name,
            );

            return dataFieldForCurrentDatum
                ? datumFactoryFromDataField(
                      dataFieldForCurrentDatum,
                      datum.coefficent,
                  )
                : datum;
        });
    }
}
