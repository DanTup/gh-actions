import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

async function run() {
	try {
		const flutterChannel = core.getInput("channel", { required: true });
		const flutterRepo = `https://github.com/flutter/flutter`;

		const tempFolder = path.join(os.tmpdir(), Math.round(Math.random() * 10000).toString());
		fs.mkdirSync(tempFolder);
		await exec.exec("git", ["clone", "--single-branch", "--branch", flutterChannel, flutterRepo], { cwd: tempFolder });

		const flutterSdkPath = path.join(tempFolder, "flutter");

		core.addPath(path.join(flutterSdkPath, "bin"));
		core.addPath(path.join(flutterSdkPath, "cache", "dart-sdk", "bin"));
		core.setOutput("flutter-sdk", flutterSdkPath);

		await exec.exec("./flutter", ["doctor"], { cwd: path.join(flutterSdkPath, "bin") });
	} catch (error) {
		core.setFailed(error.message);
	}
}

run();
