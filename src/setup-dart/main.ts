import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as path from "path";

const isWin = /^win/.test(process.platform);
const isMac = process.platform === "darwin";

export const dartOS = isWin ? "windows" : (isMac ? "macos" : "linux");

async function run() {
	try {
		const dartChannel = core.getInput("channel", { required: true });
		const releaseType = dartChannel === "be" ? "raw" : "release";
		const url = `https://storage.googleapis.com/dart-archive/channels/${dartChannel}/${releaseType}/latest/sdk/dartsdk-${dartOS}-x64-release.zip`;

		const dartZipPath = await tc.downloadTool(url);

		// TODO: Cache?
		// https://github.com/actions/toolkit/tree/master/packages/tool-cache
		const dartSdkPath = await tc.extractZip(dartZipPath);

		core.addPath(path.join(dartSdkPath, "dart-sdk", "bin"));
		core.setOutput("dart-sdk", dartSdkPath);
	} catch (error) {
		core.setFailed(error.message);
	}
}

run();
