import { Omit } from 'utility-types';
import { Jsonify } from '../../util/types';
import { DerivedField } from '../../engine/data-field/derived-field/derived-field';
import { IDataFieldJson } from './json-data-field';
import {
    ICovariateJson,
    parseCovariateJsonToCovariate,
} from './json-covariate';
import { DataField } from '../../engine/data-field/data-field';
import { findCovariateJsonWithName } from './json-covariate';

export interface IDerivedFieldJson
    extends Omit<Jsonify<DerivedField>, 'derivedFrom'> {
    derivedFrom: Array<string | Jsonify<IDataFieldJson>>;
}

export function findDerivedFieldJsonWithName(
    derivedFieldJsons: IDerivedFieldJson[],
    name: string,
): IDerivedFieldJson | undefined {
    return derivedFieldJsons.find(
        derivedFieldJson => derivedFieldJson.name === name,
    );
}

export function parseDerivedFromJsonToDerivedFrom(
    derivedFromJson: Array<string | Jsonify<IDataFieldJson>>,
    derivedFieldJsons: IDerivedFieldJson[],
    covariatesJson: ICovariateJson[],
): DataField[] {
    return derivedFromJson.map(derivedFromJsonItem => {
        if (typeof derivedFromJsonItem === 'string') {
            const covariateJsonForCurrentDerivedFromItem = findCovariateJsonWithName(
                covariatesJson,
                derivedFromJsonItem,
            );
            const derivedFieldJsonForCurrentDerivedFromItem = findDerivedFieldJsonWithName(
                derivedFieldJsons,
                derivedFromJsonItem,
            );

            if (covariateJsonForCurrentDerivedFromItem) {
                return parseCovariateJsonToCovariate(
                    covariateJsonForCurrentDerivedFromItem,
                    covariatesJson,
                    derivedFieldJsons,
                );
            } else if (derivedFieldJsonForCurrentDerivedFromItem) {
                return parseDerivedFieldJsonToDerivedField(
                    derivedFieldJsonForCurrentDerivedFromItem,
                    derivedFieldJsons,
                    covariatesJson,
                );
            } else {
                throw new Error();
            }
        } else {
            return new DataField(derivedFromJsonItem);
        }
    });
}

export function parseDerivedFieldJsonToDerivedField(
    derivedFieldJson: IDerivedFieldJson,
    derivedFieldJsons: IDerivedFieldJson[],
    covariateJsons: ICovariateJson[],
): DerivedField {
    return new DerivedField(
        derivedFieldJson,
        parseDerivedFromJsonToDerivedFrom(
            derivedFieldJson.derivedFrom,
            derivedFieldJsons,
            covariateJsons,
        ),
    );
}
