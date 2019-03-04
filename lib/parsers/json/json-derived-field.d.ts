import { Omit } from 'utility-types';
import { JsonSerializable } from '../../util/types';
import { DerivedField } from '../../engine/data-field/derived-field/derived-field';
import { IDataFieldJson } from './json-data-field';
import { ICovariateJson } from './json-covariate';
import { DataField } from '../../engine/data-field/data-field';
import { JsonInterval } from './json-interval';
export interface IDerivedFieldJson extends Omit<JsonSerializable<DerivedField>, 'derivedFrom' | 'interval'> {
    derivedFrom: Array<string | JsonSerializable<IDataFieldJson>>;
    interval?: JsonInterval;
}
export declare function findDerivedFieldJsonWithName(derivedFieldJsons: IDerivedFieldJson[], name: string): IDerivedFieldJson | undefined;
export declare function parseDerivedFromJsonToDerivedFrom(derivedFromJson: Array<string | JsonSerializable<IDataFieldJson>>, derivedFieldJsons: IDerivedFieldJson[], covariatesJson: ICovariateJson[]): DataField[];
export declare function parseDerivedFieldJsonToDerivedField(derivedFieldJson: IDerivedFieldJson, derivedFieldJsons: IDerivedFieldJson[], covariateJsons: ICovariateJson[]): DerivedField;
