import { Covariate } from '../covariate';
import { DerivedField } from '../../derived-field/derived-field';
import { Data } from '../../../data/data';
import { IUserFunctions } from '../../../algorithm/user-functions/user-functions';
import { ITables } from '../../../algorithm/tables/tables';
export declare class InteractionCovariate extends Covariate {
    derivedField: DerivedField;
    calculateDataToCalculateCoefficent(data: Data, userDefinedFunctions: IUserFunctions, tables: ITables): Data;
    private isCoefficentDatumSetToReferencePoint;
}
