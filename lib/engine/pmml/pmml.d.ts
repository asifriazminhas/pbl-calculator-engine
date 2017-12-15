import { IDataDictionary } from './data_dictionary/data_dictionary';
import { IDataField } from './data_dictionary/data_field';
import { ILocalTransformations } from './local_transformations/local_transformations';
import { IDerivedField } from './local_transformations/derived_field';
import { IGeneralRegressionModel } from './general_regression_model/general_regression_model';
import { IParameter } from './general_regression_model/parameter';
import { IPCell } from './general_regression_model/p_cell';
import { IHeader } from './header/header';
import { ICustomHeader } from './custom/header';
import { IRestrictedCubicSpline } from './custom/restricted_cubic_spline';
import { ITaxonomy } from './taxonomy';
export interface IOutput {
    OutputField: {
        $: {
            name: string;
            targetField: string;
        };
    };
}
export interface IPmml {
    Header: IHeader;
    DataDictionary: IDataDictionary;
    LocalTransformations: ILocalTransformations;
    GeneralRegressionModel?: IGeneralRegressionModel;
    Taxonomy?: ITaxonomy[] | ITaxonomy;
    Output?: IOutput;
    Targets?: {
        Target: {
            $: {
                field: string;
                opType: 'continuous' | 'categorical';
            };
        };
    };
}
export interface ICustomPmml extends IPmml {
    Header: ICustomHeader;
    CustomPMML: {
        RestrictedCubicSpline: IRestrictedCubicSpline;
    };
}
export interface ICustomPmmlXml {
    PMML: ICustomPmml;
}
export declare class Pmml {
    pmmlXml: ICustomPmmlXml;
    constructor(pmmlXml: ICustomPmmlXml);
    findDataFieldWithName(dataFieldName: string): IDataField | undefined;
    findParameterWithLabel(parameterLabel: string): IParameter | undefined;
    findPCellWithParameterName(parameterName: string): IPCell | undefined;
    findDerivedFieldWithName(derivedFieldName: string): IDerivedField | undefined;
    toString(): string;
}
