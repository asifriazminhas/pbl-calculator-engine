import { RegressionAlgorithm } from '../regression-algorithm';
import { Bins } from './bins/bins';
import { TimeMetric } from './time-metric';
import { Data } from '../../../data/data';
import moment from 'moment';
import { Calibration } from './calibration/calibration';
import { ICoxSurvivalAlgorithmJson } from '../../../../parsers/json/json-cox-survival-algorithm';
import { Baseline } from '../baseline/baseline';
import { CalibrationJson } from '../../../../parsers/json/json-calibration';
import { BaselineJson } from '../../../../parsers/json/json-baseline';
import { DataField } from '../../../data-field/data-field';
export interface INewPredictor {
    name: string;
    betaCoefficent: number;
    referencePoint: number | undefined;
}
export declare class CoxSurvivalAlgorithm extends RegressionAlgorithm {
    timeMetric: TimeMetric;
    maximumTime: number;
    bins?: Bins;
    calibration: Calibration;
    baseline: Baseline;
    constructor(coxSurvivalAlgorithmJson: ICoxSurvivalAlgorithmJson);
    evaluate(data: Data, time?: Date | moment.Moment): number;
    getRiskToTime(data: Data, time?: Date | moment.Moment): number;
    getSurvivalToTime(data: Data, time?: Date | moment.Moment): number;
    updateBaseline(newBaseline: BaselineJson): CoxSurvivalAlgorithm;
    addPredictor(predictor: INewPredictor): CoxSurvivalAlgorithm;
    addCalibrationToAlgorithm(calibrationJson: CalibrationJson, predicateData: Data): CoxSurvivalAlgorithm;
    /**
     * Goes though all the fields part of this algorithm and tries to find one
     * whose name matches with the name arg. Throws an Error if no DataField is
     * found
     *
     * @param {string} name
     * @returns {DataField}
     * @memberof CoxSurvivalAlgorithm
     */
    findDataField(name: string): DataField;
    getRequiredVariables(): DataField[];
    getRecommendedVariables(): DataField[];
    private getSurvivalToTimeWithBins;
    private getRiskToTimeWithoutBins;
    private getTimeMultiplier;
}
