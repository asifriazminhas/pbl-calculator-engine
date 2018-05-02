import { Algorithm } from '../algorithm';
import { Covariate } from '../../data-field/covariate/covariate';
import { Data } from '../../data/data';
import { add } from 'lodash';
import { Baseline } from './baseline/baseline';

export abstract class RegressionAlgorithm extends Algorithm {
    covariates: Covariate[];
    baseline: Baseline;

    calculateScore(data: Data): number {
        return (
            this.covariates
                .map(covariate =>
                    covariate.getComponent(
                        data,
                        this.userFunctions,
                        this.tables,
                    ),
                )
                .reduce(add, 0) * this.baseline.getBaselineForData(data)
        );
    }
}
