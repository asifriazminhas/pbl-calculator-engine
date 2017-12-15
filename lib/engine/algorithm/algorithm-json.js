"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseUserFunctions(userFunctionsJson) {
    // tslint:disable-next-line
    let userFunctions = {};
    Object.keys(userFunctionsJson).forEach(userFunctionJsonKey => {
        eval(userFunctionsJson[userFunctionJsonKey]);
    });
    return userFunctions;
}
exports.parseUserFunctions = parseUserFunctions;
//# sourceMappingURL=algorithm-json.js.map