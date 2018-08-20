import { Data, IDatum } from '../data';
import { autobind } from 'core-decorators';
import { uniqWith } from 'lodash';
import { Interval } from './covariate/interval';
import { JsonInterval } from '../../parsers/json/json-interval';

@autobind
export class DataField {
    name: string;
    interval?: Interval;

    constructor(fieldJson: { name: string; interval?: JsonInterval }) {
        this.name = fieldJson.name;
        this.interval = fieldJson.interval
            ? new Interval(fieldJson.interval)
            : undefined;
    }

    static getUniqueDataFields(dataFields: DataField[]): DataField[] {
        return uniqWith(dataFields, DataField.isSameDataField);
    }

    static isSameDataField(dataFieldOne: DataField, dataFieldTwo: DataField) {
        return dataFieldOne.name === dataFieldTwo.name;
    }

    static findDataFieldWithName(
        dataFields: DataField[],
        name: string,
    ): DataField | undefined {
        return dataFields.find(dataField => {
            return dataField.name === name;
        });
    }

    getDatumForField(data: Data): IDatum | undefined {
        return data.find(datum => datum.name === this.name);
    }

    isFieldWithName(name: string): boolean {
        return this.name === name;
    }
}
