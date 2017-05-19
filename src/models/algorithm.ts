//models
import { Datum, datumFactory } from './data/datum'
import { Covariate } from './fields/covariate';
import { DerivedField } from './fields/derived_field';
import { DataField } from './fields/data_field';
import * as moment from 'moment';
import { env } from './env/env';
import * as _ from 'lodash';
import { GenericAlgorithm } from './common';

export interface IAlgorithm extends GenericAlgorithm<DataField> {

} 

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
            .reduce(_.add)

        if(env.shouldLogDebugInfo()) {
            console.log(`Baseline Hazard: ${this.baselineHazard}`);
        }

        if(env.shouldLogDebugInfo() === true) {
            console.groupEnd();
        }

        return 1 - Math.pow(Math.E, -1*this.baselineHazard*Math.pow(Math.E, score));
    }
}

export default Algorithm