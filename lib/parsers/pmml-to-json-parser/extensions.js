"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

exports.parseExtensions = parseExtensions;
//# sourceMappingURL=extensions.js.map