import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

const isWin = /^win/.test(process.platform);

async function run() {
	try {
		const flutterChannel = core.getInput("channel", { required: true });
		const flutterRepo = `https://github.com/flutter/flutter`;

		let tempFolder = path.join(os.tmpdir(), Math.round(Math.random() * 10000).toString());
		fs.mkdirSync(tempFolder);
		// Resolve symlinks because the Dart analysis server will resolve them
		// and sometimes give errors about types not matching across them.
		tempFolder = fs.realpathSync.native(tempFolder);
		await exec.exec("git", ["clone", "--single-branch", "--branch", flutterChannel, flutterRepo], { cwd: tempFolder });

		const flutterSdkPath = path.join(tempFolder, "flutter");

		core.addPath(path.join(flutterSdkPath, "bin"));
		core.addPath(path.join(flutterSdkPath, "cache", "dart-sdk", "bin"));
		core.setOutput("flutter-sdk", flutterSdkPath);

		await exec.exec(path.join(flutterSdkPath, "bin", isWin ? "flutter.bat" : "flutter"), ["config", "--no-analytics"]);
		await exec.exec(path.join(flutterSdkPath, "bin", isWin ? "flutter.bat" : "flutter"), ["doctor", "-v"]);
	} catch (error) {
		core.setFailed(error.message);
	}
}

run();
