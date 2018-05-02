import { ITables } from './tables/tables';
import { IUserFunctions } from './user-functions/user-functions';
import { Data } from '../data';

export abstract class Algorithm {
    name: string;
    userFunctions: IUserFunctions;
    tables: ITables;

    abstract evaluate(data: Data): number;
}
