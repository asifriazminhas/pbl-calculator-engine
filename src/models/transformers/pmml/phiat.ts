const csvParse = require('csv-parse/lib/sync');
import * as xmlBuilder from 'xmlbuilder';

//The type fpr the VariableType column in the PHIAT csv
type VariableType = 'continuous' | 'categorical' | 'Reference';

type Sex = 'Female' | 'Male';

interface BaseDataField {
    Name: string;
    variableType: VariableType;
    variableUse: 'Input' | 'Reference';
    UserMin: string;
    UserMax: string;
    ValidCat: string;
    displayValue: string;
    displayName: string;
    Sex: Sex
    Units: string;
    Recommended: string;
}

interface PhiatCsvRow extends BaseDataField {
    Mean: string;
}

interface ParsedDataField extends BaseDataField {
    Mean: {
        Male: number | null;
        Female: number | null;
    }
}

interface WebSpecificationCategoriesCsvRow {
    'Variable Name': string;
    'Category Value': string;
    'Category Label': string;
    'Category Description': string;
}

/**
 * Parses the type of variable from the PHIAT csv VariableType column
 * 
 * @param {VariableType} variableType 
 * @returns 
 */
function parseVariableType(variableType: VariableType) {
    if (variableType === 'continuous') {
        return 'continuous'
    }
    else if (variableType === 'categorical') {
        return 'categorical';
    }
    else {
        throw new Error(`Unknown variable type ${variableType}`);
    }
}

//Adds a DerivedField node to the localTransformationsNode which represents the field which has the mean value for the data field with the name in the name arg
function addMeanDerivedField(localTransformationsNode: any, name: string) {
    return localTransformationsNode
        .ele('DerivedField', {
            name: `${name}_mean`,
            dataType: 'double',
            optype: 'continuous'
        })
}

function parseCategoriesFromWebSpecificationsCsv(
    webSpecificationsCategoriesCsv: Array<WebSpecificationCategoriesCsvRow>
) {
    let categories: Array<{
        name: string;
        categories: Array<{
            value: string;
            displayName: string;
            description: string;
        }>
    }> = [];

    webSpecificationsCategoriesCsv
        .forEach((webSpecificationsCategoriesCsvRow) => {
            if (webSpecificationsCategoriesCsvRow['Variable Name'] !== '') {
                categories.push({
                    name: webSpecificationsCategoriesCsvRow['Variable Name'],
                    categories: []
                })
            }

            categories[categories.length - 1].categories.push({
                value: webSpecificationsCategoriesCsvRow['Category Value'],
                displayName: webSpecificationsCategoriesCsvRow['Category Label'],
                description: webSpecificationsCategoriesCsvRow['Category Description']
            })
        });

    return categories;
}

export function transformPhiatDictionaryToPmml(
    phiatCsvString: string,
    webSpecificationsCategories: string,
    gender: 'Male' | 'Female' | 'both',
    addMeans: boolean
): string {
    //Parse the csv string into array of objects
    const phiatCsv: Array<PhiatCsvRow> = csvParse(phiatCsvString, {
        columns: true
    });

    const webSpecificationsCategoriesCsv: Array<WebSpecificationCategoriesCsvRow> = csvParse(
        webSpecificationsCategories,
        {
            columns: true
        }
    );
    const webSpecificationCategories = parseCategoriesFromWebSpecificationsCsv(
        webSpecificationsCategoriesCsv
    );

    const phiatRowsNamesToFilterOut = [
        'SurveyCycle2',
        'SurveyCycle3',
        'SurveyCycle4'
    ];

    const phiatCsvRowsWithoutReference = phiatCsv
        //Remove all rows which are Reference variableType
        .filter(phiatCsvRow => phiatCsvRow.variableUse !== 'Reference')
        //Remove all rows whose Name field matches any in the array phiatRowsNamesToFilterOut
        .filter(PhiatCsvRow => phiatRowsNamesToFilterOut
            .indexOf(PhiatCsvRow.Name) === -1)
        //Trim the VariableName and Sex fields
        .map(phiatCsvRow => Object.assign({}, phiatCsvRow, {
            VariableName: phiatCsvRow.Name.trim(),
            Sex: phiatCsvRow.Sex.trim() as Sex
        }));
    
    const dataFields: {
        //Index is the name of the data field
        [index: string]: ParsedDataField
    } = phiatCsvRowsWithoutReference.reduce((currentDataFields: {
        [index: string]: ParsedDataField
    }, phiatCsvRow) => {
        //Find a parsed data field with the same name as the current phiatCsvRow
        const dataFieldForCurrentPhiatCsvRow = Object.keys(currentDataFields)
            .find(dataFieldName => dataFieldName === phiatCsvRow.Name);
        
        //If we did not find one
        if (!dataFieldForCurrentPhiatCsvRow) {
            //Parse the current PHIAT csv row and add it to the object of parsed data fields
            currentDataFields[phiatCsvRow.Name] = Object.assign(
                {},
                phiatCsvRow,
                {
                    Mean: {
                        //if the current row is male
                        Male: phiatCsvRow.Sex === 'Male' ?
                            Number(phiatCsvRow.Mean) : null,
                        //if the current row is female
                        Female: phiatCsvRow.Sex === 'Female' ?
                            Number(phiatCsvRow.Mean) : null
                    }
                }
            )
        }
        //Otherwise update the found parsed data field mean field
        else {
            currentDataFields[phiatCsvRow.Name].Mean[phiatCsvRow.Sex] =
                Number(phiatCsvRow.Mean)
        }

        return currentDataFields;
    }, {});

    //Create root PMML node
    const pmmlXml = xmlBuilder
        .create('PMML');
    
    //If we should add the transformations for the means to the output PMML file
    if (addMeans) {
        const localTransformationsNode = pmmlXml
            .ele('LocalTransformations');
        
        //Add the DerivedFields for the means
        Object.keys(dataFields)
            .forEach((dataField) => {
                //if this data field is not for both genders
                if (gender !== 'both') {
                    //Check if the Mean has been set for the gender it is for
                    if (dataFields[dataField].Mean[gender]) {
                        //Add the DerivedField node for the mean transformations
                        const derivedField = addMeanDerivedField(
                            localTransformationsNode,
                            dataField.trim()
                        );

                        //Add a Constant which has the number mean value
                        derivedField.ele('Constant', {
                            dataType: 'double'
                        }, dataFields[dataField].Mean[gender]);
                    }
                }
                //Otherwise this DataField has means for both genders
                else {
                    //Add DerivedField node
                    const derivedField = addMeanDerivedField(
                        localTransformationsNode,
                        dataField.trim()
                    );

                    //Add nodes which check if the current evaluation of the algorithm is for a male or female person and set the mean field to the right mean value depending on that value. The sex variable is Sex
                    const applyIfNode = derivedField
                        .ele('Apply', {
                            function: 'if'
                        });

                    const applyEqualNode = applyIfNode
                        .ele('Apply', {
                            function: 'equal'
                        });
                    applyEqualNode
                        .ele('FieldRef', {
                            field: 'Sex'
                        });
                    applyEqualNode
                        .ele('Constant', 'Male', {
                            dataType: 'string'
                        });

                    applyIfNode.ele('Constant', {
                        dataType: 'double'
                    }, dataFields[dataField].Mean.Male ? dataFields[dataField].Mean.Male : 0);

                    applyIfNode.ele('Constant', {
                        dataType: 'double'
                    }, dataFields[dataField].Mean.Female ? dataFields[dataField].Mean.Female : 0);
                }
            });
    }

    //Add DataDictionary node to PMML
    const dataDictionary = pmmlXml
        .ele('DataDictionary', {
            //Add 1 for gender
            numberOfFields: phiatCsvRowsWithoutReference.length + 1
        })
    //Add DataField nodes for all rows which are not Reference types
    Object.keys(dataFields)
        .forEach((dataField) => {
            const dataFieldEle = dataDictionary
                .ele('DataField', {
                    name: dataField,
                    optype: parseVariableType(
                        dataFields[dataField].variableType
                    ),
                    dataType: 'double',
                    displayName: dataFields[dataField].displayName,
                });
            
            if (dataFields[dataField].Recommended === 'Yes') {
                dataFieldEle.ele('Extension', {
                    name: 'recommended',
                    value: 'true'
                });
            }
            dataFieldEle.ele('Extension', {
                name: 'units',
                value: dataFields[dataField].Units
            });
            dataFieldEle.ele('Extension', {
                name: 'description',
                value: dataFields[dataField].displayValue
            });

            //If continuous add Interval node
            if (dataFields[dataField].variableType === 'continuous') {
                dataFieldEle
                    .ele('Interval', {
                        closure: 'closedClosed',
                        leftMargin: dataFields[dataField].UserMin,
                        rightMargin: dataFields[dataField].UserMax
                    })
            }
            //Otherwise its categorical so add Value nodes to DataField
            else {
                const relevantWebSpecificationCategory = webSpecificationCategories
                    .find((webSpecificationCategory) => {
                        return webSpecificationCategory.name === dataField
                    });

                if (relevantWebSpecificationCategory) {
                    relevantWebSpecificationCategory
                        .categories
                        .forEach((category) => {
                            dataFieldEle
                                .ele('Value', {
                                    value: category.value,
                                    displayName: category.displayName,
                                    description: category.description
                                })
                        });
                }
                else {
                    throw new Error();
                }
            }
        });

    const sexDataField = dataDictionary
        .ele('DataField', {
            name: 'Sex',
            opType: 'Categorical',
            dataType: 'string'
        })
    sexDataField
        .ele('Value', {
            value: 'Male'
        });
    sexDataField
        .ele('Value', {
            value: 'Female'
        });

    //Convert to XML string
    const pmmlXmlString = pmmlXml.end({
        pretty: true
    });

    //Return XML string
    return pmmlXmlString;
}