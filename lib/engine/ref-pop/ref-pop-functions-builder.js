"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RefPopFunctionsBuilder = void 0;

var _refPopFunctions = require("./ref-pop-functions");

var RefPopFunctionsBuilder = {
  withModel: function withModel(model) {
    return {
      withRefPop: function withRefPop(refPop) {
        return new _refPopFunctions.RefPopFunctions(model, refPop);
      }
    };
  }
};
exports.RefPopFunctionsBuilder = RefPopFunctionsBuilder;
//# sourceMappingURL=ref-pop-functions-builder.js.map