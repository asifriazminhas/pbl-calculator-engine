"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildXmlFromXml2JsObject = buildXmlFromXml2JsObject;

var xmlBuilder = _interopRequireWildcard(require("xmlbuilder"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Takes an xml2JsObj and an xmlBuilder node and returns an xmlBuilder node which when toString is called on returns an XML string representing the xml2JsObj passed in appended to the currentNode arg passed in
function buildXmlFromXml2JsObject(xml2JsObj, currentNode) {
  // get the names of the direct child descendents of the current xml node in xml2JsObj
  var childNodeNames = Object.keys(xml2JsObj); // The current parent node of the all the children in the childNodeNames

  var parentNodeXml2JsObj = xml2JsObj; // This means we are at the very top of the XML document

  if (!currentNode) {
    // get the name of the root node
    var rootNodeName = Object.keys(xml2JsObj)[0]; // using the root node name get the root node xml2JsObj

    var rootNodeXml2JsObj = xml2JsObj[rootNodeName]; // Update the currentNode to the rootNode

    currentNode = xmlBuilder.create(rootNodeName, rootNodeXml2JsObj.$); // Update childnode names

    childNodeNames = Object.keys(rootNodeXml2JsObj); // Update parentNode

    parentNodeXml2JsObj = rootNodeXml2JsObj;
  }
  /* if the $$ field exists then it means there are 2 or immediate child
  nodes that are repeated and to show their order in the XML file the $$
  field was added */


  if (parentNodeXml2JsObj.$$) {
    // Go thourhg direct child nodes
    parentNodeXml2JsObj.$$ // Remove all the node names which are not actually nodes
    // Add each child node to the currentNode object
    .forEach(function (childNodeXml2JsObj) {
      // Otherwise it's just a single node that has child nodes itself
      var childNode = currentNode.ele(childNodeXml2JsObj['#name'], childNodeXml2JsObj.$, childNodeXml2JsObj._);
      buildXmlFromXml2JsObject(childNodeXml2JsObj, childNode);
    });
  } else {
    /* Otherwise the child nodes are all different so order does not
    matter*/
    childNodeNames // Remove all the node names which are not actually nodes
    .filter(function (childNodeName) {
      return childNodeName !== '$' && childNodeName !== '$$' && childNodeName !== '#name' && childNodeName !== '_';
    }) // Add each child node to the currentNode object
    .forEach(function (childNodeName) {
      // Get the xml2JsObj for the current child node
      var childNodeXml2JsObj = parentNodeXml2JsObj[childNodeName]; // If it's a string then it's single node with no child nodes itself so just add it to the current node

      if (typeof childNodeXml2JsObj === 'string') {
        currentNode.ele(childNodeName, childNodeXml2JsObj);
      } else if (childNodeXml2JsObj instanceof Array) {
        // If it's an array then we need to go through each of them
        childNodeXml2JsObj.forEach(function (childNodeXml2JsObjItem) {
          // Create the XML node for the current child node item
          var childNode = currentNode.ele(childNodeName, childNodeXml2JsObjItem.$, childNodeXml2JsObjItem._); // Add the child nodes for the current child node item

          buildXmlFromXml2JsObject(childNodeXml2JsObjItem, childNode);
        });
      } else {
        // Otherwise it's just a single node that has child nodes itself
        var childNode = currentNode.ele(childNodeName, childNodeXml2JsObj.$, childNodeXml2JsObj._);
        buildXmlFromXml2JsObject(childNodeXml2JsObj, childNode);
      }
    });
  }

  return currentNode;
}
//# sourceMappingURL=index.js.map