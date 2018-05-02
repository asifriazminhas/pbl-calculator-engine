import { IUserFunctions } from '../../engine/algorithm/user-functions/user-functions';

export interface IUserFunctionsJson {
    [index: string]: string;
}

export function parseUserFunctions(
    userFunctionsJson: IUserFunctionsJson,
): IUserFunctions {
    // tslint:disable-next-line
    let userFunctions: IUserFunctions = {};

    Object.keys(userFunctionsJson).forEach(userFunctionJsonKey => {
        eval(userFunctionsJson[userFunctionJsonKey]);
    });

    return userFunctions;
}
