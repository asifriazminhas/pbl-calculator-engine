import { Data, IDatum } from '../data';
import { autobind } from 'core-decorators';
import { uniqWith } from 'lodash';

@autobind
export class DataField {
    name: string;

    constructor(fieldJson: { name: string }) {
        this.name = fieldJson.name;
    }

    static getUniqueDataFields(dataFields: DataField[]): DataField[] {
        return uniqWith(dataFields, DataField.isSameDataField);
    }

    static isSameDataField(dataFieldOne: DataField, dataFieldTwo: DataField) {
        return dataFieldOne.name === dataFieldTwo.name;
    }

    getDatumForField(data: Data): IDatum | undefined {
        return data.find(datum => datum.name === this.name);
    }

    isFieldWithName(name: string): boolean {
        return this.name === name;
    }
}
