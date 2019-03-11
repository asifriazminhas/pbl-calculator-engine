import { IDataField } from '../../pmml';
import { IDataFieldJson } from '../../../parsers/json/json-data-field';
import { JsonInterval } from '../../json/json-interval';
import { IMiningField } from '../../pmml/mining-schema/mining-field';
import { InvalidValueTreatment } from '../../pmml/mining-schema/invalid-value-treatment';
import { ICategory } from '../../../engine/data-field/category';

export function parseDataFieldFromDataFieldPmmlNode(
    dataFieldNode: IDataField,
    miningField?: IMiningField,
): IDataFieldJson {
    return {
        name: dataFieldNode.$.name,
        intervals: parseIntervals(dataFieldNode),
        categories: parseValues(dataFieldNode),
        isRequired: parseIsRequired(dataFieldNode, miningField),
        metadata: {
            label: dataFieldNode.$.displayName,
            shortLabel: dataFieldNode.$['X-shortLabel'],
        },
    };
}

function parseValues(dataField: IDataField): ICategory[] | undefined {
    if ('Value' in dataField) {
        if (dataField.Value === undefined) {
            return undefined;
        } else {
            return (dataField.Value instanceof Array
                ? dataField.Value
                : [dataField.Value]
            ).map(valueNode => {
                return {
                    value: valueNode.$.value,
                    displayValue: valueNode.$.displayName,
                    description: valueNode.$.description,
                };
            });
        }
    }

    return undefined;
}

function parseIntervals(dataField: IDataField): JsonInterval[] | undefined {
    if ('Interval' in dataField) {
        return (dataField.Interval instanceof Array
            ? dataField.Interval
            : [dataField.Interval]
        ).map(interval => {
            return Object.assign(
                {
                    description: interval.$['X-description'],
                },
                interval.$.leftMargin
                    ? {
                          lowerMargin: {
                              margin: Number(interval.$.leftMargin),
                              isOpen: false,
                          },
                      }
                    : undefined,
                interval.$.rightMargin
                    ? {
                          higherMargin: {
                              margin: Number(interval.$.rightMargin),
                              isOpen: false,
                          },
                      }
                    : undefined,
            );
        });
    } else {
        return undefined;
    }
}

function parseIsRequired(
    dataFieldNode: IDataField,
    miningField?: IMiningField,
): boolean {
    if (dataFieldNode && dataFieldNode.$['X-required']) {
        return dataFieldNode.$['X-required'] === 'true' ? true : false;
    }

    if (miningField) {
        return miningField.$.invalidValueTreatment ===
            InvalidValueTreatment.ReturnInvalid
            ? true
            : false;
    }

    return false;
}
