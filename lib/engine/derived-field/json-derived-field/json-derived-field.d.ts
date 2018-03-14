import { GenericDerivedField } from '../generic-derived-field';
import { CovariateJson } from '../../covariate';
import { DerivedField } from '../../derived-field/derived-field';
import { DerivedFrom, DerivedFieldJson, DerivedFromJson } from '../../derived-field';
export declare type DerivedFieldJson = GenericDerivedField<DerivedFromJson>;
export declare function findDerivedFieldJsonWithName(derivedFieldJsons: DerivedFieldJson[], name: string): DerivedFieldJson | undefined;
export declare function parseDerivedFromJsonToDerivedFrom(derivedFromJson: DerivedFromJson[], derivedFieldJsons: DerivedFieldJson[], covariatesJson: CovariateJson[]): DerivedFrom[];
export declare function parseDerivedFieldJsonToDerivedField(derivedFieldJson: DerivedFieldJson, derivedFieldJsons: DerivedFieldJson[], covariateJsons: CovariateJson[]): DerivedField;
