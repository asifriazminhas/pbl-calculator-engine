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
import { buildXmlFromXml2JsObject } from '../../engine/xmlbuilder';
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

export class Pmml {
    pmmlXml: ICustomPmmlXml;

    constructor(pmmlXml: ICustomPmmlXml) {
        this.pmmlXml = pmmlXml;
    }

    findDataFieldWithName(dataFieldName: string): IDataField | undefined {
        return this.pmmlXml.PMML.DataDictionary
            ? this.pmmlXml.PMML.DataDictionary.DataField
              ? this.pmmlXml.PMML.DataDictionary.DataField.find(
                    dataField => dataField.$.name === dataFieldName,
                )
              : undefined
            : undefined;
    }

    findParameterWithLabel(parameterLabel: string): IParameter | undefined {
        return (this.pmmlXml.PMML
            .GeneralRegressionModel as IGeneralRegressionModel).ParameterList.Parameter.find(
            parameter => parameter.$.label === parameterLabel,
        );
    }

    findPCellWithParameterName(parameterName: string): IPCell | undefined {
        return (this.pmmlXml.PMML
            .GeneralRegressionModel as IGeneralRegressionModel).ParamMatrix.PCell.find(
            pCell => pCell.$.parameterName === parameterName,
        );
    }

    findDerivedFieldWithName(
        derivedFieldName: string,
    ): IDerivedField | undefined {
        const DerivedField = this.pmmlXml.PMML.LocalTransformations
            .DerivedField;
        return DerivedField instanceof Array
            ? DerivedField.find(
                  derivedField => derivedField.$.name === derivedFieldName,
              )
            : DerivedField.$.name === derivedFieldName
              ? DerivedField
              : undefined;
    }

    toString(): string {
        return buildXmlFromXml2JsObject({
            PMML: this.pmmlXml.PMML,
        }).end({
            pretty: true,
        });
    }
}
