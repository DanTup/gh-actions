"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const tc = require("@actions/tool-cache");
const path = require("path");
const isWin = /^win/.test(process.platform);
const isMac = process.platform === "darwin";
const dartOS = isWin ? "windows" : (isMac ? "macos" : "linux");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dartChannel = core.getInput("channel", { required: true });
            const url = `https://storage.googleapis.com/dart-archive/channels/${dartChannel}/release/latest/sdk/dartsdk-${dartOS}-x64-release.zip`;
            const dartZipPath = yield tc.downloadTool(url);
            // TODO: Cache?
            // https://github.com/actions/toolkit/tree/master/packages/tool-cache
            const dartSdkPath = yield tc.extractZip(dartZipPath);
            core.addPath(path.join(dartSdkPath, "dart-sdk", "bin"));
            core.setOutput("dart-sdk", dartSdkPath);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
//# sourceMappingURL=main.js.map