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
const exec = require("@actions/exec");
const os = require("os");
const path = require("path");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const flutterChannel = core.getInput("channel", { required: true });
            const flutterRepo = `https://github.com/flutter/flutter`;
            const tempFolder = os.tmpdir();
            yield exec.exec("git", ["clone", "--single-branch", "--branch", flutterChannel, flutterRepo], { cwd: tempFolder });
            const flutterSdkPath = path.join(tempFolder, "flutter");
            core.addPath(path.join(flutterSdkPath, "bin"));
            core.addPath(path.join(flutterSdkPath, "cache", "dart-sdk", "bin"));
            core.setOutput("flutter-sdk", flutterSdkPath);
            yield exec.exec("flutter", ["doctor"], { cwd: tempFolder });
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
//# sourceMappingURL=main.js.map