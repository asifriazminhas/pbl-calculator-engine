"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var test = require("tape");

var cause_effect_1 = require("../engine/cause-effect/cause-effect");

var survival_model_builder_1 = require("../engine/survival-model-builder/survival-model-builder");

var chai_1 = require("chai");

test("Cause Effect",
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(t) {
    var MportCauseEffectReference, MportModelJson, mportModel, withMportRiskFactor, data, expectedRiskToTime, causeEffectRiskToTime;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // tslint:disable-next-line
            MportCauseEffectReference = require('@ottawamhealth/pbl-calculator-engine-assets/MPoRT/cause-effect-ref.json');
            MportModelJson = require('@ottawamhealth/pbl-calculator-engine-assets/MPoRT/model.json');
            _context.next = 4;
            return survival_model_builder_1.SurvivalModelBuilder.buildFromModelJson(MportModelJson);

          case 4:
            mportModel = _context.sent;
            withMportRiskFactor = cause_effect_1.getForRiskFactorFunction(MportCauseEffectReference);
            data = [{
              name: 'age',
              coefficent: 21
            }, {
              name: 'sex',
              coefficent: 'male'
            }];
            expectedRiskToTime = mportModel.getRiskToTime(data.concat(MportCauseEffectReference.male.Smoking));
            causeEffectRiskToTime = withMportRiskFactor.withRiskFactor('SMOKING').getCauseEffect(mportModel.getRiskToTime).withData(data);
            chai_1.expect(expectedRiskToTime).to.equal(causeEffectRiskToTime);
            t.pass("Cause effect with risk to time");
            t.end();

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
//# sourceMappingURL=cause-effect.spec.js.map