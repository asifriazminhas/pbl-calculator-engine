import { IDataField } from '../../pmml';
import { IDataFieldJson } from '../../../parsers/json/json-data-field';
import { JsonInterval } from '../../json/json-interval';

export function parseDataFieldFromDataFieldPmmlNode(
    dataFieldNode: IDataField,
): IDataFieldJson {
    return {
        name: dataFieldNode.$.name,
        interval: parseInterval(dataFieldNode),
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
