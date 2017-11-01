import { DerivedField } from './derived-field';
import { Covariate } from '../cox/covariate';
import { DataField } from '../data-field';

export type DerivedFrom = DerivedField | DataField | Covariate;
