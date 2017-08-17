import { DerivedFieldJson, DerivedFromJson, CovariateJson } from '../common/json-types';
import { DerivedField, DerivedFrom } from '../cox/derived-field';
export declare function findDerivedFieldJsonWithName(derivedFieldJsons: Array<DerivedFieldJson>, name: string): DerivedFieldJson | undefined;
export declare function parseDerivedFromJsonToDerivedFrom(derivedFromJson: Array<DerivedFromJson>, derivedFieldJsons: Array<DerivedFieldJson>, covariatesJson: Array<CovariateJson>): Array<DerivedFrom>;
export declare function parseDerivedFieldJsonToDerivedField(derivedFieldJson: DerivedFieldJson, derivedFieldJsons: Array<DerivedFieldJson>, covariateJsons: Array<CovariateJson>): DerivedField;
