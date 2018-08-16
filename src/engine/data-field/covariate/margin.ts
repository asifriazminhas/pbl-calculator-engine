import { JsonMargin } from '../../../parsers/json/json-margin';

export class Margin {
    margin: number;
    isOpen: boolean;

    constructor(marginJson: JsonMargin) {
        this.margin = marginJson.margin;
        this.isOpen = marginJson.isOpen;
    }
}
