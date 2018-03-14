import { IBaseCox } from './base-cox';
import { Data } from '../data';
import * as moment from 'moment';
import { AlgorithmType } from '../algorithm/algorithm-type';
import { IRegressionAlgorithm } from '../regression-algorithm/regression-algorithm';
import { TimeMetric } from './time-metric';
import { IBins, IBinsData, BinsLookup } from './bins/bins';
export interface Cox extends IBaseCox, IRegressionAlgorithm<AlgorithmType.Cox>, Partial<IBins> {
}
export interface ICoxWithBins extends Cox {
    binsData: IBinsData;
    binsLookup: BinsLookup;
}
export declare function getTimeMultiplier(time: moment.Moment, timeMetric: TimeMetric, maximumTime: number): number;
export declare function getSurvivalToTime(cox: Cox, data: Data, time?: Date | moment.Moment): number;
export declare function getRiskToTimeWithoutBins(cox: Cox, data: Data, time?: Date | moment.Moment): number;
export declare function getSurvivalToTimeWithBins(coxWithBins: ICoxWithBins, data: Data, time?: Date | moment.Moment): number;
export declare function getRiskToTime(cox: Cox | ICoxWithBins, data: Data, time?: Date | moment.Moment): number;
