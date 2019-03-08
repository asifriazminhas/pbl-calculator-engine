import { IPmml } from '../../../parsers/pmml/pmml';
import { IHeader } from '../../../parsers/pmml/header/header';
import { IDataDictionary } from '../../../parsers/pmml/data_dictionary/data_dictionary';
import csvParse = require('csv-parse/lib/sync');
import {
    IInterval,
    IDataField,
} from '../../../parsers/pmml/data_dictionary/data_field';
import { buildXmlFromXml2JsObject } from '../../../util/xmlbuilder';
import { InvalidValueTreatment as PmmlInvalidValueTreatment } from '../../../parsers/pmml/mining-schema/invalid-value-treatment';
import { MissingValueTreatment as PmmlMissingValueTreatment } from '../../../parsers/pmml/mining-schema/missing-value-treatment';
import { IMiningSchema } from '../../../parsers/pmml/mining-schema/mining-schema';

export function convertWebSpecV2CsvToPmml(
    webSpecV2CsvString: string,
    gender: 'male' | 'female',
): string {
    const webSpecV2Csv: WebSpecV2Csv = csvParse(webSpecV2CsvString, {
        columns: true,
    });

    const Header: IHeader = {
        $: {
            description: 'WebSpecV2 PMML',
        },
    };

    const numOfRowsWithDefinedMinOrMaxColumn = webSpecV2Csv.filter(
        webSpecV2CsvRow => {
            const { min, max } = getGenderSpecificMinAndMaxValues(
                webSpecV2CsvRow,
                gender,
            );

            return min || max;
        },
    ).length;

    const DataDictionary: IDataDictionary = {
        DataField: webSpecV2Csv.map(webSpecV2CsvRow => {
            return getDataFieldNode(webSpecV2CsvRow, gender);
        }),
        $: {
            numberOfFields: `${numOfRowsWithDefinedMinOrMaxColumn}`,
        },
    };

    const MiningSchema: IMiningSchema = {
        MiningField: webSpecV2Csv.map(
            ({ InvalidValueTreatment, Name, MissingValueReplacement }) => {
                return {
                    $: Object.assign(
                        {
                            name: Name,
                            invalidValueTreatment:
                                InvalidValueTreatment === 'asMissing'
                                    ? PmmlInvalidValueTreatment.AsMissing
                                    : InvalidValueTreatment === 'returnInvalid'
                                      ? PmmlInvalidValueTreatment.ReturnInvalid
                                      : PmmlInvalidValueTreatment.AsIs,
                        },
                        MissingValueReplacement === 'asMean'
                            ? {
                                  missingValueTreatment:
                                      PmmlMissingValueTreatment.AsMean,
                              }
                            : undefined,
                    ),
                };
            },
        ),
    };

    const pmml: IPmml = {
        Header,
        DataDictionary,
        LocalTransformations: {
            DerivedField: [],
        },
        MiningSchema,
    };

    return buildXmlFromXml2JsObject({
        PMML: pmml,
    });
}

interface WebSpecV2CsvRow {
    Name: string;
    UserMin_male: string;
    UserMin_female: string;
    UserMax_male: string;
    UserMax_female: string;
    InvalidValueTreatment: 'returnInvalid' | 'asMissing' | '';
    MissingValueReplacement: 'asMean' | '';
}
type WebSpecV2Csv = WebSpecV2CsvRow[];

function isMaleGender(gender: 'male' | 'female'): boolean {
    return gender === 'male';
}

function getDataFieldNode(
    webSpecV2CsvRow: WebSpecV2CsvRow,
    gender: 'male' | 'female',
): IDataField {
    const { min, max } = getGenderSpecificMinAndMaxValues(
        webSpecV2CsvRow,
        gender,
    );

    return Object.assign(
        {},
        {
            $: {
                name: webSpecV2CsvRow.Name,
                displayName: '',
                optype: 'continuous' as 'continuous',
                dataType: '',
                'X-shortLabel': '',
                'X-required': 'false',
                'X-recommended': 'false',
            },
            Extension: [],
        },
        min || max
            ? {
                  Interval: getIntervalNode(min, max),
              }
            : undefined,
    );
}

function getGenderSpecificMinAndMaxValues(
    webSpecV2CsvRow: WebSpecV2CsvRow,
    gender: 'male' | 'female',
): { min: string; max: string } {
    return {
        min: isMaleGender(gender)
            ? webSpecV2CsvRow.UserMin_male
            : webSpecV2CsvRow.UserMin_female,
        max: isMaleGender(gender)
            ? webSpecV2CsvRow.UserMax_male
            : webSpecV2CsvRow.UserMax_female,
    };
}

function getIntervalNode(min?: string, max?: string): IInterval {
    return {
        $: Object.assign(
            {},
            {
                closure: 'closedClosed' as 'closedClosed',
                'X-description': '',
            },
            min
                ? {
                      leftMargin: min,
                  }
                : undefined,
            max
                ? {
                      rightMargin: max,
                  }
                : undefined,
        ),
    };
}
