import { IHeader } from '../header/header';

//TODO Fix this so that it's follows the Extensions schema
export interface ICustomHeader extends IHeader {
    Extension: {
        Version: string;
        ModelName: string;
    }
}