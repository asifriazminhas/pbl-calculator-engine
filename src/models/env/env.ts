import {
    autobind
} from 'core-decorators';

export type environment = 'production' | 'testing';

@autobind
export class Env {
    private _environment: environment

    constructor() {
        this._environment = 'production';
    }

    set environment(environment: environment) {
        this._environment = environment
    }

    isEnvironmentTesting() {
        return this._environment === 'testing';
    }
}

export default new Env();

