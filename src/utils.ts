import * as https from "https";
import * as url from "url";

export function fetch(urlString: string): Promise<string> {
	const u = url.parse(urlString);
	if (u.protocol === "https:")
		return fetchHttps(u.hostname, u.port, u.path);
	else
		throw new Error(`Cannot fetch URL ${urlString}`);
}

function fetchHttps(hostname: string | null, port: string | null, path: string | null) {
	return new Promise<string>((resolve, reject) => {
		const options: https.RequestOptions = {
			headers: {
				"User-Agent": "DanTup/gh-actions",
			},
			hostname,
			method: "GET",
			path,
			port,
		};

		const req = https.request(options, (resp) => {
			if (!resp || !resp.statusCode || resp.statusCode < 200 || resp.statusCode > 300) {
				reject({ message: `Failed to get ${path || "/"}: ${resp && resp.statusCode}: ${resp && resp.statusMessage}` });
			} else {
				const chunks: string[] = [];
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
				resp.on("data", (b) => chunks.push(b.toString()));
				resp.on("end", () => {
					const data = chunks.join("");
					resolve(data);
				});
			}
		});
		req.end();
	});
}
