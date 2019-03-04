import { Algorithm, DataNameReport } from '../algorithm';
import { DerivedField } from '../../data-field/derived-field/derived-field';
import { Data } from '../../data/data';
export declare class SimpleAlgorithm extends Algorithm {
    output: DerivedField;
    buildDataNameReport(): DataNameReport;
    evaluate(data: Data): number;
}
