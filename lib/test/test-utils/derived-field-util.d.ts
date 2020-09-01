import { IDerivedFieldJson } from '../../parsers/json/json-derived-field';
import { DerivedField } from '../../engine/data-field/derived-field/derived-field';
import { DataField } from '../../../src/engine/data-field/data-field';
export declare function getMockDerivedField(overrideFields?: Partial<IDerivedFieldJson>, derivedFrom?: DataField[]): DerivedField;
