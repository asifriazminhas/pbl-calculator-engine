import { Margin } from './margin';

export class Interval {
    lowerMargin?: Margin;
    higherMargin?: Margin;

    constructor(lowerMargin?: Margin, higherMargin?: Margin) {
        this.lowerMargin = lowerMargin;
        this.higherMargin = higherMargin;
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
