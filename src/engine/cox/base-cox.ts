import { Algorithm, AlgorithmType } from '../algorithm';
import { TimeMetric } from './time-metric';

export interface IBaseCox extends Algorithm {
    algorithmType: AlgorithmType.Cox;
    timeMetric: TimeMetric;
}
