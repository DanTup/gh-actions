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
const fs = require("fs");
const os = require("os");
const path = require("path");
const isWin = /^win/.test(process.platform);
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const flutterChannel = core.getInput("channel", { required: true });
            const flutterRepo = `https://github.com/flutter/flutter`;
            let tempFolder = path.join(os.tmpdir(), Math.round(Math.random() * 10000).toString());
            fs.mkdirSync(tempFolder);
            // Resolve symlinks because the Dart analysis server will resolve them
            // and sometimes give errors about types not matching across them.
            tempFolder = fs.realpathSync.native(tempFolder);
            yield exec.exec("git", ["clone", "--single-branch", "--branch", flutterChannel, flutterRepo], { cwd: tempFolder });
            const flutterSdkPath = path.join(tempFolder, "flutter");
            core.addPath(path.join(flutterSdkPath, "bin"));
            core.addPath(path.join(flutterSdkPath, "cache", "dart-sdk", "bin"));
            core.setOutput("flutter-sdk", flutterSdkPath);
            yield exec.exec(path.join(flutterSdkPath, "bin", isWin ? "flutter.bat" : "flutter"), ["config", "--no-analytics"]);
            yield exec.exec(path.join(flutterSdkPath, "bin", isWin ? "flutter.bat" : "flutter"), ["doctor", "-v"]);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
//# sourceMappingURL=main.js.map