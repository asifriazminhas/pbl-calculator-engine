import { Jsonify } from '../../util/types';
import { Predicate } from '../../engine/predicate/predicate';

export interface PredicateJson extends Jsonify<Predicate> {}
