import { Datum, datumFactory } from '../data/datum'
import { Covariate } from './data_fields/covariate';
import { DerivedField } from './data_fields/derived_field';
import { DataField } from './data_fields/data_field';
import * as moment from 'moment';
import { env } from '../env/env';
import { flatten, add } from 'lodash';
import { GenericAlgorithm } from '../common';

export interface IAlgorithm extends GenericAlgorithm<DataField> {} 

export abstract class Algorithm implements IAlgorithm {
    name: string;
    version: string;
    description: string;
    covariates: Array<Covariate>;
    localTransformations: Array<DerivedField>;
    baselineHazard: number;

    static readonly PmmlData = [
        datumFactory('StartDate', moment())
    ];

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