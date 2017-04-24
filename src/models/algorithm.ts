//models
import IntermediatePredictor, {
    GenericIntermediatePredictor
} from './predictors/intermediate_predictor'
import ExplanatoryPredictor, {
    IExplanatoryPredictor
} from './predictors/explanatory_predictor'
import Datum from './data/datum'
import * as moment from 'moment';
import Predictor from './predictors/predictor';
import { env } from './env/env';
import * as _ from 'lodash';

export interface GenericAlgorithm<R, U extends IExplanatoryPredictor, V extends GenericIntermediatePredictor<R>> {
    name: string;
    baselineHazard: number;
    version: string;
    explanatoryPredictors: Array<U>;
    intermediatePredictors: Array<V>;
}

export class Algorithm implements GenericAlgorithm<Predictor, ExplanatoryPredictor, IntermediatePredictor> {
    name: string
    explanatoryPredictors: Array<ExplanatoryPredictor>
    intermediatePredictors: Array<IntermediatePredictor>
    baselineHazard: number;
    version: string;

    static readonly PmmlData = [
        new Datum().constructorForNewDatum('StartDate', moment())
    ];

    evaluate(data: Array<Datum>): number {
        if(env.shouldLogDebugInfo() === true) {
            console.groupCollapsed(`Predictors`)
        }

        var score = this.explanatoryPredictors
            .map(explanatoryPredictor => explanatoryPredictor.getComponentForPredictor(data))
            .reduce(_.add)

        if(env.shouldLogDebugInfo() === true) {
            console.groupEnd();
        }

        return 1 - Math.pow(Math.E, -1*this.baselineHazard*Math.pow(Math.E, score));
    }
}

export default Algorithm