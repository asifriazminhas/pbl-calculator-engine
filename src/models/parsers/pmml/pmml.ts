import { parseDataFields } from './data_field';
import { parseDerivedFields } from './derived_field';
import { CustomPmmlXml } from './interfaces/custom/pmml';
import { AlgorithmJson } from '../json/algorithm';
import { CovariateJson } from '../json/fields/covariate';
import { DerivedFieldJson } from '../json/fields/derived_field';
import { mergeArrays } from './merge/merge_arrays';
import * as xmlBuilder from 'xmlbuilder';
import * as fs from 'fs';
import * as path from 'path';

//bluebird
import * as bluebird from 'bluebird'

//parsing xml string
import * as parseXmlString from 'xml2js'
var promisifiedParseXmlString: any = bluebird.promisify(parseXmlString.parseString)

function filterOutNotTopDerivedFields(derivedField: DerivedFieldJson, index: number, derivedFields: Array<DerivedFieldJson>): boolean {
    index;

    return derivedFields
        .find(currentDerivedField => currentDerivedField.derivedFrom.indexOf(derivedField.name) > -1) ? false : true;
}

function filterOutDerivedFieldsAssociatedWithADataField(dataFields: Array<CovariateJson>) {
    return (derivedField: DerivedFieldJson) => {
        return dataFields
            .find(dataField => dataField.name === derivedField.name) ? false : true
    }
}

//Merges the passed in two pmml files with priority given to the second one
function mergePmml(pmmlOne: CustomPmmlXml, pmmlTwo: CustomPmmlXml): CustomPmmlXml {
    const derivedFieldsOne = pmmlOne.PMML.LocalTransformations ? pmmlOne.PMML.LocalTransformations.DerivedField : [];
    const derivedFieldsTwo = pmmlTwo.PMML.LocalTransformations ? pmmlTwo.PMML.LocalTransformations.DerivedField : [];

    const dataFieldsOne = pmmlOne.PMML.DataDictionary  ? pmmlOne.PMML.DataDictionary.DataField : [];
    const dataFieldsTwo = pmmlTwo.PMML.DataDictionary ? pmmlTwo.PMML.DataDictionary.DataField : [];
    const mergedDataFields = mergeArrays(dataFieldsOne, dataFieldsTwo, (dataField) => {
        return dataField.$.name
    });

    const mergedPmml = Object.assign({}, pmmlOne.PMML, pmmlTwo.PMML, {
        LocalTransformations: {
            DerivedField: mergeArrays(derivedFieldsOne, derivedFieldsTwo, (derivedField) => {
                return derivedField.$.name;
            })
        },
        DataDictionary: Object.assign({}, {
            $: Object.assign({}, pmmlOne.PMML.DataDictionary ? pmmlOne.PMML.DataDictionary.$ : {}, pmmlTwo.PMML.DataDictionary ? pmmlTwo.PMML.DataDictionary.$ : {}, {
                numberOfFields: mergedDataFields.length
            }),
            DataField: mergedDataFields
        })
    });

    return {
        PMML: mergedPmml
    };
}

//Takes an xml2JsObj and an xmlBuilder node and returns an xmlBuilder node which when toString is called on returns an XML string representing the xml2JsObj passed in appended to the currentNode arg passed in
function buildXmlFromXml2JsObject(xml2JsObj: any, currentNode?: any): any {
    //get the names of the direct child descendents of the current xml node in xml2JsObj
    let childNodeNames = Object.keys(xml2JsObj);
    //The current parent node of the all the children in the childNodeNames
    let parentNodeXml2JsObj = xml2JsObj;

    //This means we are at the very top of the XML document
    if(!currentNode) {
        //get the name of the root node
        const rootNodeName = Object.keys(xml2JsObj)[0];
        //using the root node name get the root node xml2JsObj
        const rootNodeXml2JsObj = xml2JsObj[rootNodeName];

        //Update the currentNode to the rootNode
        currentNode = xmlBuilder.create(rootNodeName, rootNodeXml2JsObj.$);

        //Update childnode names
        childNodeNames = Object.keys(rootNodeXml2JsObj);
        //Update parentNode
        parentNodeXml2JsObj = rootNodeXml2JsObj;
    }

    //Go thourhg direct child nodes 
    childNodeNames
        //Remove all the node names which are not actually nodes
        .filter(childNodeName => childNodeName !== '$' && childNodeName !== '$$' && 
            childNodeName !== '#name' && childNodeName !== '_')
        //Add each child node to the currentNode object
        .forEach((childNodeName) => {
            //Get the xml2JsObj for the current child node
            const childNodeXml2JsObj = parentNodeXml2JsObj[childNodeName];

            //If it's a string then it's single node with no child nodes itself so just add it to the current node
            if(typeof childNodeXml2JsObj === 'string') {
                currentNode.ele(childNodeName, childNodeXml2JsObj);
            }
            //If it's an array then we need to go through each of them
            else if(childNodeXml2JsObj instanceof Array) {
                childNodeXml2JsObj.forEach((childNodeXml2JsObjItem: any) => {
                    //Create the XML node for the current child node item
                    const childNode = currentNode.ele(childNodeName, childNodeXml2JsObjItem.$, childNodeXml2JsObjItem._);
                    //Add the child nodes for the current child node item
                    buildXmlFromXml2JsObject(childNodeXml2JsObjItem, childNode);
                });
            }
            //Otherwise it's just a single node that has child nodes itself
            else {
                const childNode = currentNode.ele(childNodeName, childNodeXml2JsObj.$, childNodeXml2JsObj._);
                buildXmlFromXml2JsObject(childNodeXml2JsObj, childNode);
            }
        });

    return currentNode;
}

export default async function (pmmls: Array<string>): Promise<AlgorithmJson> {
    const parsedPmmls: Array<CustomPmmlXml> = await Promise.all(pmmls.map((pmml) => {
        return promisifiedParseXmlString(pmml, {
            explicitArray: false,
            explicitChildren: true,
            preserveChildrenOrder: true
        });
    }));

    const mergedPmml = parsedPmmls
        .reduce((mergedPmml, currentPmml, index) => {
            if(index === 0) {
                return currentPmml;
            } 
            else {
                return mergePmml(mergedPmml, currentPmml);
            }
        });

    const pmmlString = buildXmlFromXml2JsObject(mergedPmml).end({
        pretty: true
    });
    fs.writeFileSync(path.join(__dirname, '../../../../test/assets/result.xml'), pmmlString);

    const covariates = parseDataFields(mergedPmml);
    var localTransformations =
        parseDerivedFields(mergedPmml.PMML.LocalTransformations.DerivedField);
    const baselineHazard = Number(mergedPmml.PMML.GeneralRegressionModel.$.baselineHazard);

    const parsedAlgorithm = {
        name: mergedPmml.PMML.Header.Extension.ModelName,
        version: mergedPmml.PMML.Header.Extension.Version,
        description: mergedPmml.PMML.Header.$.description,
        baselineHazard,
        covariates,
        localTransformations
    };

    //Find dangling intermediate predictors and throw an error if we find one
    parsedAlgorithm
        .localTransformations
        .filter(filterOutNotTopDerivedFields)
        .filter(filterOutDerivedFieldsAssociatedWithADataField(covariates))
        .map((derivedField) => {
            console.warn(`Derived field ${derivedField.name} does not have a Data field associated with it`);
            return derivedField;
        })
        .map(() => {
            throw new Error(`Derived fields mentioned above do not have Data fields associated with them`);
        });

    return parsedAlgorithm;
}