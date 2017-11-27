import { Data } from '../data';
import * as moment from 'moment';
import { Algorithm, AlgorithmType } from '../algorithm';
export interface Cox extends Algorithm {
    algorithmType: AlgorithmType.Cox;
}
export declare function getTimeMultiplier(time: moment.Moment): number;
export declare function getSurvivalToTime(cox: Cox, data: Data, time?: Date | moment.Moment): number;
export declare function getRiskToTime(cox: Cox, data: Data, time?: Date | moment.Moment): number;
