import { IGenericAlgorithm } from './generic-algorithm';
import { DerivedFieldJson } from '../derived-field';
import { IAlgorithmJson } from './algorithm-json';
import { Algorithm } from './algorithm';
import { AlgorithmType } from './algorithm-type';

export interface IAlgorithmJson<Z extends AlgorithmType>
    extends IGenericAlgorithm<string, Z> {
    derivedFields: DerivedFieldJson[];
}

export function parseUserFunctions(
    userFunctionsJson: IAlgorithmJson<any>['userFunctions'],
): Algorithm<any>['userFunctions'] {
    // tslint:disable-next-line
    let userFunctions: Algorithm<any>['userFunctions'] = {};

    Object.keys(userFunctionsJson).forEach(userFunctionJsonKey => {
        eval(userFunctionsJson[userFunctionJsonKey]);
    });

    return userFunctions;
}
