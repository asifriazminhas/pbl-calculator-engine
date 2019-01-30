import { JsonSerializable } from '../../util/types';
import { Predicate } from '../../engine/predicate/predicate';

export interface PredicateJson extends JsonSerializable<Predicate> {}
