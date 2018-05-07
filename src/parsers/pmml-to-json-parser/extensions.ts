import { BasePmmlNode, Extension } from '../pmml';

function reduceExtensionsArrayToObject(extensions: Array<Extension>): {
    [index: string]: string
} {
    return extensions.reduce((extensions: {
                [index: string]: string;
            }, currentExtension) => {
            extensions[currentExtension.$.name] = currentExtension.$.value;
            return extensions;
        }, {});
}

export function parseExtensions(pmmlNode: BasePmmlNode): {
    [index: string]: string
} {
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