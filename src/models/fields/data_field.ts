//models
import { GenericDataField } from '../common';
import { Datum } from '../data/datum';

/**
 * Base Field used in the algorithm. Maps to a DataField node in PMML
 * 
 * @export
 * @class DataField
 * @implements {GenericDataField}
 */
export class DataField implements GenericDataField {
    name: string

    isDataFieldWithName(name: string): boolean {
        return this.name === name;
    }

    getDatumForDataField(data: Array<Datum>): Datum | undefined {
        return data
            .find(datum => datum.name === this.name);
    }

    getErrorLabel(): string {
        return 'Predictor';
    }
}