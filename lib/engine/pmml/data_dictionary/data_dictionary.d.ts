import { IDataField } from './data_field';
export interface IDataDictionary {
    DataField: Array<IDataField>;
    $: {
        numberOfFields: string;
    };
}
export declare function mergeDataDictionary(dataDictionaryOne: IDataDictionary, dataDictionaryTwo: IDataDictionary): IDataDictionary;
