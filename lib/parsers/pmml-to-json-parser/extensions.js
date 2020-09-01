"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseExtensions = parseExtensions;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function reduceExtensionsArrayToObject(extensions) {
  return extensions.reduce(function (extensions, currentExtension) {
    extensions[currentExtension.$.name] = currentExtension.$.value;
    return extensions;
  }, {});
}

function parseExtensions(pmmlNode) {
  if (pmmlNode.Extension) {
    if (pmmlNode.Extension instanceof Array) {
      return reduceExtensionsArrayToObject(pmmlNode.Extension);
    } else {
      return _defineProperty({}, pmmlNode.Extension.$.name, pmmlNode.Extension.$.value);
    }
  } else {
    return {};
  }
}
//# sourceMappingURL=extensions.js.map