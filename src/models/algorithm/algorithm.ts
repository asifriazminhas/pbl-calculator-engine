import { Datum, datumFactory } from '../data/datum'
import { Covariate } from './data_fields/covariate';
import { DerivedField } from './data_fields/derived_field';
import { DataField } from './data_fields/data_field';
import * as moment from 'moment';
import { env } from '../env/env';
import { flatten, add } from 'lodash';
import { GenericAlgorithm } from '../common';

export interface IAlgorithm extends GenericAlgorithm<DataField> {} 

export class Algorithm implements IAlgorithm {
    name: string;
    version: string;
    description: string;
    covariates: Array<Covariate>;
    localTransformations: Array<DerivedField>;
    baselineHazard: number;

    static readonly PmmlData = [
        datumFactory('StartDate', moment())
    ];

    evaluate(data: Array<Datum>): number {
        if(env.shouldLogDebugInfo() === true) {
            console.groupCollapsed(`Predictors`)
        }

        var score = this.covariates
            .map(covariate => covariate.getComponent(data))
            .reduce(add)

        if(env.shouldLogDebugInfo()) {
            console.log(`Baseline Hazard: ${this.baselineHazard}`);
        }

        if(env.shouldLogDebugInfo() === true) {
            console.groupEnd();
        }

        return 1 - Math.pow(
            Math.E,
            -1 * this.baselineHazard * Math.pow(Math.E, score)
        );
    }

    getAllDerivedFields(): Array<DataField> {
        return flatten(
            this.covariates
                .map(covariate => covariate.getAllDerivedFields())
        )
            .filter((currentDerivedField, index, derivedFields) => {
                return derivedFields
                    .findIndex((derivedField) => {
                        return currentDerivedField.name === derivedField.name
                    }) === index;
            });
    }
}

export default Algorithm