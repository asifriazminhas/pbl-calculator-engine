"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function reduceExtensionsArrayToObject(extensions) {
    return extensions.reduce((extensions, currentExtension) => {
        extensions[currentExtension.$.name] = currentExtension.$.value;
        return extensions;
    }, {});
}
function parseExtensions(pmmlNode) {
    if (pmmlNode.Extension) {
        if (pmmlNode.Extension instanceof Array) {
            return reduceExtensionsArrayToObject(pmmlNode.Extension);
        }
        else {
            return {
                [pmmlNode.Extension.$.name]: pmmlNode.Extension.$.value
            };
        }
    }
    else {
        return {};
    }
}
exports.parseExtensions = parseExtensions;
//# sourceMappingURL=extensions.js.map