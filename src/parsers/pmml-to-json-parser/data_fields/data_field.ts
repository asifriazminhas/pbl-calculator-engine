import { IDataField } from '../../pmml';
import { IDataFieldJson } from '../../../parsers/json/json-data-field';
import { JsonInterval } from '../../json/json-interval';
import { IMiningField } from '../../pmml/mining-schema/mining-field';
import { InvalidValueTreatment } from '../../pmml/mining-schema/invalid-value-treatment';

export function parseDataFieldFromDataFieldPmmlNode(
    dataFieldNode: IDataField,
    miningField?: IMiningField,
): IDataFieldJson {
    return {
        name: dataFieldNode.$.name,
        interval: parseInterval(dataFieldNode),
        isRequired: parseIsRequired(miningField),
    };
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
