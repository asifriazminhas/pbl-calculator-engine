"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Margin = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Margin = function Margin(marginJson) {
  _classCallCheck(this, Margin);

  this.margin = marginJson.margin;
  this.isOpen = marginJson.isOpen;
};

exports.Margin = Margin;
//# sourceMappingURL=margin.js.map