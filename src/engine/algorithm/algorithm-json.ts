import { IGenericAlgorithm } from './generic-algorithm';
import { IAlgorithmJson } from './algorithm-json';
import { IAlgorithm } from './algorithm';
import { AlgorithmType } from './algorithm-type';
import { IDerivedFieldJson } from '../../parsers/json/json-derived-field';

export interface IAlgorithmJson<Z extends AlgorithmType>
    extends IGenericAlgorithm<string, Z> {
    derivedFields: IDerivedFieldJson[];
}

export function parseUserFunctions(
    userFunctionsJson: IAlgorithmJson<any>['userFunctions'],
): IAlgorithm<any>['userFunctions'] {
    // tslint:disable-next-line
    let userFunctions: IAlgorithm<any>['userFunctions'] = {};

    Object.keys(userFunctionsJson).forEach(userFunctionJsonKey => {
        eval(userFunctionsJson[userFunctionJsonKey]);
    });

    return userFunctions;
}
