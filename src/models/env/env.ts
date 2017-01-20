export type environment = 'production' | 'testing';

export class Env {
    private _environment: environment

    constructor() {
        this._environment = 'production';
    }

    set environment(environment: environment) {
        this._environment = environment
    }
}

export default new Env();

