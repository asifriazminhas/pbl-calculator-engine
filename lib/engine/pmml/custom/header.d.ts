import { IHeader } from '../header/header';
export interface ICustomHeader extends IHeader {
    Extension: {
        Version: string;
        ModelName: string;
    };
}
