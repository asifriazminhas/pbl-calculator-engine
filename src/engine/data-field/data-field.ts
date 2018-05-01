import { Data, IDatum } from '../data';
import { autobind } from 'core-decorators';

@autobind
export class DataField {
    name: string;

    constructor(fieldJson: { name: string }) {
        this.name = fieldJson.name;
    }

    getDatumForField(data: Data): IDatum | undefined {
        return data.find(datum => datum.name === this.name);
    }

    isFieldWithName(name: string): boolean {
        return this.name === name;
    }
}
