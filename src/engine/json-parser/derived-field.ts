import { CovariateJson } from './json-types';
import { DerivedField, DerivedFrom } from '../cox/derived-field';
import { findCovariateJsonWithName, parseCovariateJsonToCovariate } from './covariate';
import { DerivedFieldJson, DerivedFromJson } from '../derived-field';

export function findDerivedFieldJsonWithName(
    derivedFieldJsons: Array<DerivedFieldJson>,
    name: string
): DerivedFieldJson | undefined {
    return derivedFieldJsons
        .find(derivedFieldJson => derivedFieldJson.name === name);
}

export function parseDerivedFromJsonToDerivedFrom(
    derivedFromJson: Array<DerivedFromJson>,
    derivedFieldJsons: Array<DerivedFieldJson>,
    covariatesJson: Array<CovariateJson>
): Array<DerivedFrom> {
    return derivedFromJson
        .map((derivedFromJsonItem) => {
            if (typeof derivedFromJsonItem === 'string') {
                const covariateJsonForCurrentDerivedFromItem = findCovariateJsonWithName(
                    covariatesJson,
                    derivedFromJsonItem
                );
                const derivedFieldJsonForCurrentDerivedFromItem = findDerivedFieldJsonWithName(
                    derivedFieldJsons,
                    derivedFromJsonItem,
                );

                if (covariateJsonForCurrentDerivedFromItem) {
                    return parseCovariateJsonToCovariate(
                        covariateJsonForCurrentDerivedFromItem,
                        covariatesJson,
                        derivedFieldJsons
                    );
                }
                else if (derivedFieldJsonForCurrentDerivedFromItem) {
                    return parseDerivedFieldJsonToDerivedField(
                        derivedFieldJsonForCurrentDerivedFromItem,
                        derivedFieldJsons,
                        covariatesJson
                    );
                }
                else {
                    throw new Error();
                }
            }
            else {
                return derivedFromJsonItem;
            }
        })
}

export function parseDerivedFieldJsonToDerivedField(
    derivedFieldJson: DerivedFieldJson,
    derivedFieldJsons: Array<DerivedFieldJson>,
    covariateJsons: Array<CovariateJson>
): DerivedField {
    return Object.assign(
        {},
        derivedFieldJson,
        {
            derivedFrom: parseDerivedFromJsonToDerivedFrom(
                derivedFieldJson.derivedFrom,
                derivedFieldJsons,
                covariateJsons
            )
        }
    );
}