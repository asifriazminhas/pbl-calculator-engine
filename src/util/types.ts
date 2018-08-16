import { NonFunctionKeys } from 'utility-types';

/* TODO Make Jsonify type that iterates through all properties and nested
 properties also and decides what to do depending on the property type*/
export type Jsonify<T> = Pick<T, NonFunctionKeys<T>>;

export type Constructor<T> = new (...args: any[]) => T;
