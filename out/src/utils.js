"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https = require("https");
const url = require("url");
function fetch(urlString) {
    const u = url.parse(urlString);
    if (u.protocol === "https:")
        return fetchHttps(u.hostname, u.port, u.path);
    else
        throw new Error(`Cannot fetch URL ${urlString}`);
}
exports.fetch = fetch;
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
                reject({ message: `Failed to get ${path}: ${resp && resp.statusCode}: ${resp && resp.statusMessage}` });
            }
            else {
                const chunks = [];
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