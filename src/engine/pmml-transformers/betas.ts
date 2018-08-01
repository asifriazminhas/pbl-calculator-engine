// tslint:disable-next-line:no-var-requires
const csvParse = require('csv-parse/lib/sync');
import * as xmlBuilder from 'xmlbuilder';

export function convertBetasCsvStringToPmml(
    betasAndBaselineCsvString: string,
    modelName: string,
    referenceCsvString?: string,
) {
    const betasAndBaselineCsv: Array<{
        [index: string]: string;
    }> = csvParse(betasAndBaselineCsvString, {
        columns: true,
    });
    const referenceCsv = referenceCsvString
        ? csvParse(referenceCsvString, {
              columns: true,
          })
        : undefined;

    const BaselineHazardColumnName = 'H0_5YR';

    const dataFields = Object.keys(
        betasAndBaselineCsv[0],
    ).filter(columnName => {
        return columnName !== BaselineHazardColumnName;
    });

    const pmmlXml = xmlBuilder.create('PMML');
    const dataDictionaryXmlNode = pmmlXml.ele('DataDictionary', {
        numberOfFields: dataFields.length,
    });

    dataFields.forEach(dataField => {
        dataDictionaryXmlNode.ele('DataField', {
            name: dataField,
            optype: isDataFieldCategorical(dataField)
                ? 'categorical'
                : 'continuous',
            dataType: isDataFieldCategorical(dataField) ? 'string' : 'number',
        });
    });

    const generalRegressionXmlNode = pmmlXml.ele('GeneralRegressionModel', {
        modelType: 'CoxRegression',
        modelName,
        // tslint:disable-next-line:no-string-literal
        baselineHazard: betasAndBaselineCsv[0][BaselineHazardColumnName],
    });

    const miningSchemaXmlNode = generalRegressionXmlNode.ele('MiningSchema');
    dataFields.forEach(dataField => {
        miningSchemaXmlNode.ele('MiningField', {
            name: dataField,
            usageType: 'active',
        });
    });

    const parameterListXmlNode = generalRegressionXmlNode.ele('ParameterList');
    dataFields.forEach((dataField, index) => {
        const referenceCsvRowFound = referenceCsv
            ? referenceCsv.find((referenceCsvRow: any) => {
                  return referenceCsvRow['Variable'] === dataField;
              })
            : undefined;

        parameterListXmlNode.ele('Parameter', {
            name: getParameterNameForIndex(index),
            label: dataField,
            referencePoint: referenceCsvRowFound
                ? referenceCsvRowFound['Mean']
                : '',
        });
    });

    const covariateListXmlNode = generalRegressionXmlNode.ele('CovariateList');
    dataFields.forEach(dataField => {
        covariateListXmlNode.ele('Predictor', {
            name: dataField,
        });
    });

    const paramMatrixXmlNode = generalRegressionXmlNode.ele('ParamMatrix');
    dataFields.forEach((dataField, index) => {
        paramMatrixXmlNode.ele('PCell', {
            parameterName: getParameterNameForIndex(index),
            df: '1',
            beta: betasAndBaselineCsv[0][dataField],
        });
    });

    const ppmMatrixXmlNode = generalRegressionXmlNode.ele('PPMatrix');
    dataFields.forEach((dataField, index) => {
        ppmMatrixXmlNode.ele('PPCell', {
            value: '1',
            predictorName: dataField,
            parameterName: getParameterNameForIndex(index),
        });
    });

    return pmmlXml.toString();
}

function isDataFieldCategorical(dataFieldName: string): boolean {
    return dataFieldName.indexOf('_cat') > -1;
}

function getParameterNameForIndex(index: number): string {
    return `p${index}`;
}
