import {
    autobind
} from 'core-decorators';

export type environment = 'production' | 'development' | 'debugging';

/**
 * Has variables related to the environment in which the engine is currently running
 * 
 * @export
 * @class Env
 */
@autobind
export class Env { 
    /**
     * The environment in which it is currently running
     * Production: Only errors are logged
     * Development: Only errors and warnings are logged
     * Debugging: Error, warnings as well as extra information (like evaluating intermediate predictors, explanatory predictors) are logged
     * @private
     * @type {environment}
     * @memberOf Env
     */
    private _environment: environment

    constructor() {
        this._environment = 'production';
    }
    
    /**
     * 
     * 
     * 
     * @memberOf Env
     */
    setEnvironmentToProduction() {
        this._environment = 'production'
    }
    
    /**
     * 
     * 
     * 
     * @memberOf Env
     */
    setEnvironmentToDevelopment() {
        this._environment = 'development';
    }
    
    /**
     * 
     * 
     * 
     * @memberOf Env
     */
    setEnvironmentToDebugging() {
        this._environment = 'debugging';
    }
    
    /**
     * 
     * 
     * @returns {boolean}
     * 
     * @memberOf Env
     */
    isEnvironmentProduction(): boolean {
        return this._environment === 'production';
    }
    
    /**
     * 
     * 
     * @returns {boolean}
     * 
     * @memberOf Env
     */
    isEnvironmentDevelopment(): boolean {
        return this._environment === 'development';
    }
    
    /**
     * 
     * 
     * @returns {boolean}
     * 
     * @memberOf Env
     */
    isEnvironmentDebugging(): boolean {
        return this._environment === 'debugging';
    }
    
    /**
     * 
     * 
     * @returns {boolean}
     * 
     * @memberOf Env
     */
    shouldLogWarnings(): boolean {
        return this.isEnvironmentDebugging() || this.isEnvironmentDevelopment();
    }
}

export const env = new Env();

