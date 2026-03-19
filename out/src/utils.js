import * as https from "https";
import * as url from "url";
export function fetch(urlString) {
    const u = url.parse(urlString);
    if (u.protocol === "https:")
        return fetchHttps(u.hostname, u.port, u.path);
    else
        throw new Error(`Cannot fetch URL ${urlString}`);
}
function fetchHttps(hostname, port, path) {
    return new Promise((resolve, reject) => {
        const options = {
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
                // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                reject({ message: `Failed to get ${path || "/"}: ${resp && resp.statusCode}: ${resp && resp.statusMessage}` });
            }
            else {
                const chunks = [];
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument
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
//# sourceMappingURL=utils.js.map