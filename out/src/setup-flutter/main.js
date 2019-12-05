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
const tc = require("@actions/tool-cache");
const fs = require("fs");
const os = require("os");
const path = require("path");
const utils_1 = require("../utils");
const flutterRepo = `https://github.com/flutter/flutter`;
const isWin = /^win/.test(process.platform);
const isMac = process.platform === "darwin";
const isLinux = !(isWin || isMac);
exports.dartOS = isWin ? "windows" : (isMac ? "macos" : "linux");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const flutterChannel = core.getInput("channel", { required: true });
            const useZip = core.getInput("zip") && core.getInput("zip").trim().toLowerCase() === "true";
            let tempFolder = path.join(os.tmpdir(), Math.round(Math.random() * 10000).toString());
            fs.mkdirSync(tempFolder);
            // Resolve symlinks because the Dart analysis server will resolve them
            // and sometimes give errors about types not matching across them.
            tempFolder = fs.realpathSync.native(tempFolder);
            const flutterSdkPath = useZip
                ? yield downloadZip(flutterChannel, tempFolder)
                : yield gitClone(flutterChannel, tempFolder);
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
function gitClone(flutterChannel, folder) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exec.exec("git", ["clone", "--depth", "1", "--single-branch", "--branch", flutterChannel, flutterRepo], { cwd: folder });
        return path.join(folder, "flutter");
    });
}
function downloadZip(flutterChannel, folder) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://storage.googleapis.com/flutter_infra/releases/releases_${exports.dartOS}.json`;
        let releases;
        try {
            releases = JSON.parse(yield utils_1.fetch(url));
        }
        catch (e) {
            throw new Error(`Failed to download Flutter releases from ${url}: ${e}`);
        }
        const hash = releases.current_release[flutterChannel];
        if (!hash)
            throw new Error(`Unable to find a release for channel ${flutterChannel}`);
        const release = releases.releases.find((r) => r.hash === hash);
        if (!release)
            throw new Error(`Unable to find release for hash ${hash}`);
        const zipPath = yield tc.downloadTool(`${releases.base_url}/${release.archive}`);
        yield (isLinux ? tc.extractTar(zipPath, folder) : tc.extractZip(zipPath, folder));
        return path.join(folder, "flutter");
    });
}
run();
//# sourceMappingURL=main.js.map