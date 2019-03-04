"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var json_user_functions_1 = require("../../parsers/json/json-user-functions");

var Algorithm = function Algorithm(algorithmJson) {
  _classCallCheck(this, Algorithm);

  this.name = algorithmJson.name;
  this.userFunctions = json_user_functions_1.parseUserFunctions(algorithmJson.userFunctions);
  this.tables = algorithmJson.tables;
};

exports.Algorithm = Algorithm;
//# sourceMappingURL=algorithm.js.map