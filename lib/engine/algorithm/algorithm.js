"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Algorithm = void 0;

var _jsonUserFunctions = require("../../parsers/json/json-user-functions");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Algorithm = function Algorithm(algorithmJson) {
  _classCallCheck(this, Algorithm);

  this.name = algorithmJson.name;
  this.userFunctions = (0, _jsonUserFunctions.parseUserFunctions)(algorithmJson.userFunctions);
  this.tables = algorithmJson.tables;
};

exports.Algorithm = Algorithm;
//# sourceMappingURL=algorithm.js.map