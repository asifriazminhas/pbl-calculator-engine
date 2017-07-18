//models
import { GenericDataField, GenericCategory } from '../../common';
import { Datum } from '../../data/datum';
import { CategoricalMixin } from '../op_types/categorical';
import { ContinuousMixin } from '../op_types/continuous';

/**
 * Base Field used in the algorithm. Maps to a DataField node in PMML
 * 
 * @export
 * @class DataField
 * @implements {GenericDataField}
 */
export class DataField implements GenericDataField {
    name: string;
    displayName: string;
    extensions: {
        [index: string]: string;
    }

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

    isCategorical<T extends DataField>(this: T | T & CategoricalDataField | T & ContinuousDataField): this is T & CategoricalDataField {
        return (this as CategoricalDataField).opType === 'categorical';
    }

    isContinuous<T extends DataField>(this: T | T & CategoricalDataField | T & ContinuousDataField): this is T & ContinuousDataField {
        return (this as ContinuousDataField).opType === 'continuous';
    }

    canBeDerivedFromDataField(dataField: DataField): boolean {
        dataField;

        return false;
    }
}

export class CategoricalDataField extends CategoricalMixin(DataField) {}
export class ContinuousDataField extends ContinuousMixin(DataField) { }

export type DataFieldTypes = DataField | CategoricalDataField | ContinuousDataField;
