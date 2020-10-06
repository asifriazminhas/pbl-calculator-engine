export declare const CategoricalOptype = "categorical";
export declare const ContinuousOptype = "continuous";
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
    };
}
export interface CategoricalDataField extends BaseDataField {
    optype: typeof CategoricalOptype;
    values: Array<{
        value: string;
        displayName: string;
    }>;
}
export declare function getDataFieldNode(dataField: ContinuousDataField | CategoricalDataField): ({
    '@name': string;
    '@optype': "categorical" | "continuous";
    '@dataType': string;
    '@displayName': string;
} & {
    Interval: {
        '@closure': string;
        '@leftMargin': number;
        '@rightMargin': number;
    };
}) | ({
    '@name': string;
    '@optype': "categorical" | "continuous";
    '@dataType': string;
    '@displayName': string;
} & {
    Value: {
        '@value': string;
        '@displayName': string;
    }[];
});
