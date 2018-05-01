import { NonFunctionKeys } from 'utility-types';

export type Jsonify<T> = Pick<T, NonFunctionKeys<T>>;
