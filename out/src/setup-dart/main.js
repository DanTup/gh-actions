"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dartOS = void 0;
const core = require("@actions/core");
const tc = require("@actions/tool-cache");
const path = require("path");
const isWin = /^win/.test(process.platform);
const isMac = process.platform === "darwin";
exports.dartOS = isWin ? "windows" : (isMac ? "macos" : "linux");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dartChannel = core.getInput("channel", { required: true });
            const releaseType = dartChannel === "be" ? "raw" : "release";
            const url = `https://storage.googleapis.com/dart-archive/channels/${dartChannel}/${releaseType}/latest/sdk/dartsdk-${exports.dartOS}-x64-release.zip`;
            const dartZipPath = yield tc.downloadTool(url);
            // TODO: Cache?
            // https://github.com/actions/toolkit/tree/master/packages/tool-cache
            const dartSdkPath = yield tc.extractZip(dartZipPath);
            core.addPath(path.join(dartSdkPath, "dart-sdk", "bin"));
            core.setOutput("dart-sdk", dartSdkPath);
        }
        catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            core.setFailed((error === null || error === void 0 ? void 0 : error.message) || error);
        }
    });
}
void run();
//# sourceMappingURL=main.js.map