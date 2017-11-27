import { BaseDataField } from './base-data-field';
import { CategoricalDataField } from './categorical-data-field';
import { ContinuousDataField } from './continuous-data-field';

export type DataField = BaseDataField | CategoricalDataField | ContinuousDataField;