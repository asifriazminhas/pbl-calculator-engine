import * as xmlBuilder from 'xmlbuilder';

// Takes an xml2JsObj and an xmlBuilder node and returns an xmlBuilder node which when toString is called on returns an XML string representing the xml2JsObj passed in appended to the currentNode arg passed in
export function buildXmlFromXml2JsObject(
    xml2JsObj: any,
    currentNode?: any,
): any {
    // get the names of the direct child descendents of the current xml node in xml2JsObj
    let childNodeNames = Object.keys(xml2JsObj);
    // The current parent node of the all the children in the childNodeNames
    let parentNodeXml2JsObj = xml2JsObj;

    // This means we are at the very top of the XML document
    if (!currentNode) {
        // get the name of the root node
        const rootNodeName = Object.keys(xml2JsObj)[0];
        // using the root node name get the root node xml2JsObj
        const rootNodeXml2JsObj = xml2JsObj[rootNodeName];

        // Update the currentNode to the rootNode
        currentNode = xmlBuilder.create(rootNodeName, rootNodeXml2JsObj.$);

        // Update childnode names
        childNodeNames = Object.keys(rootNodeXml2JsObj);
        // Update parentNode
        parentNodeXml2JsObj = rootNodeXml2JsObj;
    }

    /* if the $$ field exists then it means there are 2 or immediate child
    nodes that are repeated and to show their order in the XML file the $$
    field was added */
    if (parentNodeXml2JsObj.$$) {
        // Go thourhg direct child nodes
        parentNodeXml2JsObj.$$ // Remove all the node names which are not actually nodes
            // Add each child node to the currentNode object
            .forEach((childNodeXml2JsObj: any) => {
                // Otherwise it's just a single node that has child nodes itself
                const childNode = currentNode.ele(
                    childNodeXml2JsObj['#name'],
                    childNodeXml2JsObj.$,
                    childNodeXml2JsObj._,
                );
                buildXmlFromXml2JsObject(childNodeXml2JsObj, childNode);
            });
    } else {
        /* Otherwise the child nodes are all different so order does not
        matter*/
        childNodeNames
            // Remove all the node names which are not actually nodes
            .filter(
                childNodeName =>
                    childNodeName !== '$' &&
                    childNodeName !== '$$' &&
                    childNodeName !== '#name' &&
                    childNodeName !== '_',
            )
            // Add each child node to the currentNode object
            .forEach(childNodeName => {
                // Get the xml2JsObj for the current child node
                const childNodeXml2JsObj = parentNodeXml2JsObj[childNodeName];

                // If it's a string then it's single node with no child nodes itself so just add it to the current node
                if (typeof childNodeXml2JsObj === 'string') {
                    currentNode.ele(childNodeName, childNodeXml2JsObj);
                } else if (childNodeXml2JsObj instanceof Array) {
                    // If it's an array then we need to go through each of them
                    childNodeXml2JsObj.forEach(
                        (childNodeXml2JsObjItem: any) => {
                            // Create the XML node for the current child node item
                            const childNode = currentNode.ele(
                                childNodeName,
                                childNodeXml2JsObjItem.$,
                                childNodeXml2JsObjItem._,
                            );
                            // Add the child nodes for the current child node item
                            buildXmlFromXml2JsObject(
                                childNodeXml2JsObjItem,
                                childNode,
                            );
                        },
                    );
                } else {
                    // Otherwise it's just a single node that has child nodes itself
                    const childNode = currentNode.ele(
                        childNodeName,
                        childNodeXml2JsObj.$,
                        childNodeXml2JsObj._,
                    );
                    buildXmlFromXml2JsObject(childNodeXml2JsObj, childNode);
                }
            });
    }

    return currentNode;
}
