import { GenericDerivedField } from '../generic-derived-field';
import {
    CovariateJson,
    findCovariateJsonWithName,
    parseCovariateJsonToCovariate,
} from '../../covariate';
import { DerivedField } from '../../derived-field/derived-field';
import {
    DerivedFrom,
    DerivedFieldJson,
    DerivedFromJson,
} from '../../derived-field';

export type DerivedFieldJson = GenericDerivedField<DerivedFromJson>;

export function findDerivedFieldJsonWithName(
    derivedFieldJsons: DerivedFieldJson[],
    name: string,
): DerivedFieldJson | undefined {
    return derivedFieldJsons.find(
        derivedFieldJson => derivedFieldJson.name === name,
    );
}

export function parseDerivedFromJsonToDerivedFrom(
    derivedFromJson: DerivedFromJson[],
    derivedFieldJsons: DerivedFieldJson[],
    covariatesJson: CovariateJson[],
): DerivedFrom[] {
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
            return derivedFromJsonItem;
        }
    });
}

export function parseDerivedFieldJsonToDerivedField(
    derivedFieldJson: DerivedFieldJson,
    derivedFieldJsons: DerivedFieldJson[],
    covariateJsons: CovariateJson[],
): DerivedField {
    return Object.assign({}, derivedFieldJson, {
        derivedFrom: parseDerivedFromJsonToDerivedFrom(
            derivedFieldJson.derivedFrom,
            derivedFieldJsons,
            covariateJsons,
        ),
    });
}
