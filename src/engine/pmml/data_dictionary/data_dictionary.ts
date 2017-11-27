import { IDataField, mergeDataFields } from './data_field';
import { returnEmptyArrayIfUndefined } from '../../undefined';
import { toString } from 'lodash';

export interface IDataDictionary {
    DataField: Array<IDataField>;
    $: {
        numberOfFields: string;
    }
}

export function mergeDataDictionary(
    dataDictionaryOne: IDataDictionary,
    dataDictionaryTwo: IDataDictionary
): IDataDictionary {
    const mergedDataFields = mergeDataFields(
        dataDictionaryOne ? returnEmptyArrayIfUndefined(
            dataDictionaryOne.DataField
        ) : [],
        dataDictionaryTwo ? returnEmptyArrayIfUndefined(
            dataDictionaryTwo.DataField
         ) : []
    );

    return {
        DataField: mergedDataFields,
        $: {
            numberOfFields: toString(mergedDataFields.length)
        }
    }
}
