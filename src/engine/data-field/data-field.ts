import { Data, IDatum } from '../data';
import { autobind } from 'core-decorators';
import { uniqWith } from 'lodash';
import { Interval } from './covariate/interval';
import { IDataFieldJson } from '../../parsers/json/json-data-field';
import { ICategory } from './category';

@autobind
export class DataField {
    name: string;
    interval?: Interval;
    /**
     * If the DataField is a categorical field, then this field will be set.
     * Otherwise it will be undefined.
     *
     * @type {ICategory[]}
     * @memberof DataField
     */
    categories?: ICategory[];
    isRequired: boolean;

    constructor(fieldJson: IDataFieldJson) {
        this.name = fieldJson.name;
        this.interval = fieldJson.interval
            ? new Interval(fieldJson.interval)
            : undefined;
        this.isRequired = fieldJson.isRequired;
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

    /**
     * Validates the Datum identical to this DataField using the interval and
     * categories fields if present
     *
     * @param {Data[]} data
     * @memberof DataField
     */
    validateData(data: Data[]) {
        // TODO Luke
    }
}
