"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseUserFunctions = parseUserFunctions;

function parseUserFunctions(userFunctionsJson) {
  // tslint:disable-next-line
  var userFunctions = {};
  Object.keys(userFunctionsJson).forEach(function (userFunctionJsonKey) {
    eval(userFunctionsJson[userFunctionJsonKey]);
  });
  return userFunctions;
}
//# sourceMappingURL=json-user-functions.js.map