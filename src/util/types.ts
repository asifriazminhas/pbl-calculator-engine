import { NonFunctionKeys } from 'utility-types';

export type Jsonify<T> = Pick<T, NonFunctionKeys<T>>;

export type Constructor<T> = new (...args: any[]) => T;
