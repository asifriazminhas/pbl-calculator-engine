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
        interval: parseInterval(dataFieldNode),
        categories: parseValues(dataFieldNode),
        isRequired: parseIsRequired(miningField),
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

function parseInterval(dataField: IDataField): JsonInterval | undefined {
    if ('Interval' in dataField) {
        return Object.assign(
            {},
            dataField.Interval.$.leftMargin
                ? {
                      lowerMargin: {
                          margin: Number(dataField.Interval.$.leftMargin),
                          isOpen: false,
                      },
                  }
                : undefined,
            dataField.Interval.$.rightMargin
                ? {
                      higherMargin: {
                          margin: Number(dataField.Interval.$.rightMargin),
                          isOpen: false,
                      },
                  }
                : undefined,
        );
    } else {
        return undefined;
    }
}

function parseIsRequired(miningField?: IMiningField): boolean {
    return miningField
        ? miningField.$.invalidValueTreatment ===
          InvalidValueTreatment.ReturnInvalid
          ? true
          : false
        : false;
}
