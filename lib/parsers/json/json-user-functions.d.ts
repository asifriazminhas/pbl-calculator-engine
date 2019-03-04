import { IUserFunctions } from '../../engine/algorithm/user-functions/user-functions';
export interface IUserFunctionsJson {
    [index: string]: string;
}
export declare function parseUserFunctions(userFunctionsJson: IUserFunctionsJson): IUserFunctions;
