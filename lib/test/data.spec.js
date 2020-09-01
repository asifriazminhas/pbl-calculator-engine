"use strict";

var _tape = _interopRequireDefault(require("tape"));

var _data = require("../engine/data/data");

var _chai = require("chai");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _tape.default)("Data functions", function (t) {
  var originalData = [{
    name: 'age',
    coefficent: 21
  }, {
    name: 'sex',
    coefficent: 'male'
  }];
  var dataUpdate = [{
    name: 'sex',
    coefficent: 'female'
  }, {
    name: 'TypeOfSmoker',
    coefficent: 3
  }];
  var updatedData = (0, _data.updateDataWithData)(originalData, dataUpdate);
  (0, _chai.expect)(updatedData[0]).to.eql(originalData[0]);
  (0, _chai.expect)(updatedData[1]).to.eql(dataUpdate[0]);
  (0, _chai.expect)(updatedData[2]).to.eql(dataUpdate[1]);
  t.pass(".updateDataWithData");
  t.end();
});
//# sourceMappingURL=data.spec.js.map