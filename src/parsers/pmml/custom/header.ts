import { IHeader } from '../header/header';

export interface ICustomHeader extends IHeader {
    Extension: {
        name: 'ModelName';
        value: string;
    };
}
