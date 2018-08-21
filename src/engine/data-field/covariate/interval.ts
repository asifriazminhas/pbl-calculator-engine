import { Margin } from './margin';
import { JsonInterval } from '../../../parsers/json/json-interval';

export class Interval {
    lowerMargin?: Margin;
    higherMargin?: Margin;

    constructor(intervalJson: JsonInterval) {
        this.lowerMargin = intervalJson.lowerMargin
            ? new Margin(intervalJson.lowerMargin)
            : undefined;
        this.higherMargin = intervalJson.higherMargin
            ? new Margin(intervalJson.higherMargin)
            : undefined;
    }

    limitNumber(num: number): number {
        if (this.lowerMargin && num < this.lowerMargin.margin) {
            return this.lowerMargin.margin;
        } else if (this.higherMargin && num > this.higherMargin.margin) {
            return this.higherMargin.margin;
        } else {
            return num;
        }
    }
}
