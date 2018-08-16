import { Algorithm } from '../algorithm';
import { Covariate } from '../../data-field/covariate/covariate';
import { Data } from '../../data/data';
import { add, uniqWith, flatten } from 'lodash';
import { ICoxSurvivalAlgorithmJson } from '../../../parsers/json/json-cox-survival-algorithm';
import { parseCovariateJsonToCovariate } from '../../../parsers/json/json-covariate';
import { CovariateGroup } from '../../data-field/covariate/covariate-group';
import { DataField, isSameDataField } from '../../data-field/data-field';

export abstract class RegressionAlgorithm extends Algorithm {
    covariates: Covariate[];

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
        );
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
            data,
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

        return uniqWith(
            flatten(
                covariatesForGroup.map(currentCovariate => {
                    return currentCovariate.getAllChildFields();
                }),
            ),
            isSameDataField,
        ).concat(covariatesForGroup);
    }
}
