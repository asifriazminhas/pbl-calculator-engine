import { BaselineJson } from '../../../../parsers/json/json-baseline';
export declare class Baseline {
    private baseline;
    constructor(baselineJson: BaselineJson);
    getBaselineHazard(timeInDays: number): number;
}
