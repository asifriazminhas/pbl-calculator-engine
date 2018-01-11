"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NoCauseEffectRefFound extends Error {
    constructor(sex) {
        super();
        this.message = `No CauseEffectRef found for sex ${sex}`;
    }
}
exports.NoCauseEffectRefFound = NoCauseEffectRefFound;
//# sourceMappingURL=no-cause-effect-ref-found.js.map