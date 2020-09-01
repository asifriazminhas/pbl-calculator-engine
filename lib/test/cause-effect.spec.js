"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var test = _interopRequireWildcard(require("tape"));

var _causeEffect = require("../engine/cause-effect/cause-effect");

var _survivalModelBuilder = require("../engine/survival-model-builder/survival-model-builder");

var _chai = require("chai");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

test.skip("Cause Effect", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
    var MportCauseEffectReference, MportModelJson, mportModel, withMportRiskFactor, data, expectedRiskToTime, causeEffectRiskToTime;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // tslint:disable-next-line
            MportCauseEffectReference = require('@ottawamhealth/pbl-calculator-engine-assets/MPoRT/cause-effect-ref.json');
            MportModelJson = require('@ottawamhealth/pbl-calculator-engine-assets/MPoRT/model.json');
            _context.next = 4;
            return _survivalModelBuilder.SurvivalModelBuilder.buildFromModelJson(MportModelJson);

          case 4:
            mportModel = _context.sent;
            withMportRiskFactor = (0, _causeEffect.getForRiskFactorFunction)(MportCauseEffectReference);
            data = [{
              name: 'age',
              coefficent: 21
            }, {
              name: 'sex',
              coefficent: 'male'
            }];
            expectedRiskToTime = mportModel.getRiskToTime(data.concat(MportCauseEffectReference.male.Smoking));
            causeEffectRiskToTime = withMportRiskFactor.withRiskFactor('SMOKING').getCauseEffect(mportModel.getRiskToTime).withData(data);
            (0, _chai.expect)(expectedRiskToTime).to.equal(causeEffectRiskToTime);
            t.pass("Cause effect with risk to time");
            t.end();

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
//# sourceMappingURL=cause-effect.spec.js.map