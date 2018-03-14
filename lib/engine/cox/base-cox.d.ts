import { AlgorithmType } from '../algorithm';
import { TimeMetric } from './time-metric';
export interface IBaseCox {
    algorithmType: AlgorithmType.Cox;
    timeMetric: TimeMetric;
    maximumTime: number;
}
