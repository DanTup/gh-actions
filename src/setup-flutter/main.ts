import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as tc from "@actions/tool-cache";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { fetch } from "../utils";

const flutterRepo = `https://github.com/flutter/flutter`;
const isWin = /^win/.test(process.platform);
const isMac = process.platform === "darwin";
const isLinux = !(isWin || isMac);

export const dartOS = isWin ? "windows" : (isMac ? "macos" : "linux");

async function run() {
	try {
		const flutterChannel = core.getInput("channel", { required: true });
		const useZip = core.getInput("zip") && core.getInput("zip").trim().toLowerCase() === "true";

		let tempFolder = path.join(os.tmpdir(), Math.round(Math.random() * 10000).toString());
		fs.mkdirSync(tempFolder);
		// Resolve symlinks because the Dart analysis server will resolve them
		// and sometimes give errors about types not matching across them.
		tempFolder = fs.realpathSync.native(tempFolder);

		const flutterSdkPath = useZip
			? await downloadZip(flutterChannel, tempFolder)
			: await gitClone(flutterChannel, tempFolder);

		core.addPath(path.join(flutterSdkPath, "bin"));
		core.addPath(path.join(flutterSdkPath, "cache", "dart-sdk", "bin"));
		core.setOutput("flutter-sdk", flutterSdkPath);

		await exec.exec(path.join(flutterSdkPath, "bin", isWin ? "flutter.bat" : "flutter"), ["config", "--no-analytics"]);
		await exec.exec(path.join(flutterSdkPath, "bin", isWin ? "flutter.bat" : "flutter"), ["doctor", "-v"]);
	} catch (error) {
		core.setFailed(error.message);
	}
}

async function gitClone(flutterChannel: string, folder: string) {
	await exec.exec(
		"git",
		["clone", "--single-branch", "--branch", flutterChannel, flutterRepo],
		{ cwd: folder },
	);

	return path.join(folder, "flutter");
}

async function downloadZip(flutterChannel: string, folder: string) {
	const url = `https://storage.googleapis.com/flutter_infra/releases/releases_${dartOS}.json`;
	let releases: FlutterReleaseJson;
	try {
		releases = JSON.parse(await fetch(url));
	} catch (e) {
		throw new Error(`Failed to download Flutter releases from ${url}: ${e}`);
	}
	const hash = releases.current_release[flutterChannel];
	if (!hash)
		throw new Error(`Unable to find a release for channel ${flutterChannel}`);
	const release = releases.releases.find((r) => r.hash === hash);
	if (!release)
		throw new Error(`Unable to find release for hash ${hash}`);

	const zipPath = await tc.downloadTool(`${releases.base_url}/${release.archive}`);
	await (isLinux ? tc.extractTar(zipPath, folder) : tc.extractZip(zipPath, folder));

	return path.join(folder, "flutter");
}

interface FlutterReleaseJson {
	base_url: string;
	current_release: { [key: string]: string };
	releases: Array<{
		hash: string;
		archive: string;
	}>;
}

run();
