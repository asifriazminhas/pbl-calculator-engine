import { IBaseCox } from './base-cox';
import { Data } from '../data';
import * as moment from 'moment';
import { BinsLookup, IBinsData } from './bins';
import { AlgorithmType } from '../algorithm/algorithm-type';
import { IRegressionAlgorithm } from '../regression-algorithm/regression-algorithm';
export interface Cox extends IBaseCox, IRegressionAlgorithm<AlgorithmType.Cox> {
    binsLookup?: BinsLookup;
    binsData?: IBinsData;
}
export interface ICoxWithBins extends Cox {
    binsLookup: BinsLookup;
    binsData: IBinsData;
}
export declare function getTimeMultiplier(time: moment.Moment): number;
export declare function getSurvivalToTime(cox: Cox, data: Data, time?: Date | moment.Moment): number;
export declare function getRiskToTimeForCoxWithBins(cox: ICoxWithBins, data: Data, time?: Date | moment.Moment): number;
export declare function getRiskToTime(cox: Cox, data: Data, time?: Date | moment.Moment): number;
