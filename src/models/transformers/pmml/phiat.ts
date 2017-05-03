const csvParse = require('csv-parse/lib/sync');
import * as xmlBuilder from 'xmlbuilder';

/**
 * Parses the type of variable from the PHIAT csv VariableType column
 * 
 * @param {VariableType} variableType 
 * @returns 
 */
function parseVariableType(variableType: VariableType) {
    if(variableType === 'Continuous') {
        return 'continuous'
    }
    else if(variableType === 'Categorical') {
        return 'categorical';
    }
    else {
        throw new Error(`Unknown variable type ${variableType}`);
    }
}

//The type fpr the VariableType column in the PHIAT csv
type VariableType = 'Continuous' | 'Categorical' | 'Reference';

/**
 * Converts the PHIAT csv into a PMML file. Currently does the following:
 * Adds derived fields to support mean values using the Mean column
 * Converts the DataMin and DataMax columns into an Interval node in a DataField
 * Converts the ValidCat column into Value nodes used in a DataField
 * Converts VariableType column to set the type field in the DataField
 * 
 * @export
 * @param {string} phiatCsvString The PHIAT csv file as a string
 * @returns {string} PMML XML string
 */
export function transformPhiatDictionaryToPmml(phiatCsvString: string): string {
    //Parse the csv string into array of objects
    const phiatCsv: Array<{
        VariableName: string;
        Mean: string;
        VariableType: VariableType;
        DataMin: string;
        DataMax: string;
        ValidCat: string;
    }> = csvParse(phiatCsvString, {
        columns: true
    });

    //Remove all rows which are Reference variableType
    const phiatCsvRowsWithoutReference = phiatCsv
        .filter(phiatCsvRow => phiatCsvRow.VariableType !== 'Reference');
    
    //Create root PMML node
    const pmmlXml = xmlBuilder
        .create('PMML');
    
    //Add LocalTransformations node to it
    const localTransformationsNode = pmmlXml
        .ele('LocalTransformations');
    //Add the DerivedFields for the means
    phiatCsvRowsWithoutReference
        .forEach((phiatCsvRow) => {
            localTransformationsNode
                .ele('DerivedField', {
                    name: `${phiatCsvRow.VariableName.trim()}_mean`, 
                    dataType: 'double'
                })
                    .ele('Constant', phiatCsvRow.Mean);
        });
    
    //Add DataDictionary node to PMML
    const dataDictionary = pmmlXml
        .ele('DataDictionary', {
            numberOfFields: phiatCsvRowsWithoutReference.length
        })
    //Add DataField nodes for all rows which are not Reference types
    phiatCsvRowsWithoutReference
        .forEach((phiatCsvRow) => {
            const dataField = dataDictionary
                .ele('DataField', {
                    name: phiatCsvRow.VariableName,
                    optype: parseVariableType(phiatCsvRow.VariableType),
                    dataType: 'double'
                });
            
            //If continuous add Interval node
            if(phiatCsvRow.VariableType === 'Continuous') {
                dataField
                    .ele('Interval', {
                        closure: 'closedClosed',
                        leftMargin: phiatCsvRow.DataMin,
                        rightMargin: phiatCsvRow.DataMax
                    })
            }
            //Otherwise its categorical so add Value nodes to DataField
            else {
                (JSON.parse(phiatCsvRow.ValidCat) as Array<string>)
                    .forEach((validCategory) => {
                        dataField.ele('Value', {
                            value: validCategory
                        })
                    });
            }
        });
    
    //Convert to XML string
    const pmmlXmlString = pmmlXml.end({
        pretty: true
    });

    //Return XML string
    return pmmlXmlString;
}