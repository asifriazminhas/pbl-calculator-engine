import { Data } from '../../../data';
import { BaselineJson } from '../../../../parsers/json/json-baseline';
export declare class Baseline {
    private baseline;
    constructor(baselineJson: BaselineJson);
    getBaselineForData(data: Data): number;
}
