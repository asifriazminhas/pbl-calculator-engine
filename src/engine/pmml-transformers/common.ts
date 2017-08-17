export const CategoricalOptype = 'categorical';
export const ContinuousOptype = 'continuous';

export interface BaseDataField {
    name: string;
    optype: string;
    dataType: string;
    displayName: string;
}

export interface ContinuousDataField extends BaseDataField {
    optype: typeof ContinuousOptype;
    interval: {
        closure: string;
        leftMargin: number;
        rightMargin: number;
    }
}

export interface CategoricalDataField extends BaseDataField {
    optype: typeof CategoricalOptype;
    values: Array<{
        value: string;
        displayName: string;
    }>
}

export function getDataFieldNode(dataField: ContinuousDataField | CategoricalDataField) {
    const dataFieldEle = {
        '@name': dataField.name,
        '@optype': dataField.optype,
        '@dataType': 'double',
        '@displayName': dataField.displayName
    };

    if(dataField.optype === 'continuous') {
        return Object.assign({}, dataFieldEle, {
            Interval: {
                '@closure': dataField.interval.closure,
                '@leftMargin': dataField.interval.leftMargin,
                '@rightMargin': dataField.interval.rightMargin
            }
        })
    }
    else {
        return Object.assign({}, dataFieldEle, {
            Value: dataField.values
                .map((value) => {
                    return {
                        '@value': value.value,
                        '@displayName': value.displayName
                    };
                })
        })
    }
}