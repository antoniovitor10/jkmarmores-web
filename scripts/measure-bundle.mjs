import fs from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

const html = fs.readFileSync(path.resolve("out/index.html"), "utf8");
const scripts = [...html.matchAll(/<script[^>]+src="([^"]+\.js)"[^>]*>/g)].filter((match) => !/\bnoModule\b/i.test(match[0])).map((match) => match[1]);
const unique = [...new Set(scripts)];
const detalhes = unique.map((url) => ({ url, bytes: gzipSync(fs.readFileSync(path.join("out", new URL(url, "https://jkmarmores.com.br").pathname))).length }));
const total = detalhes.reduce((soma, item) => soma + item.bytes, 0);
process.stdout.write(`Scripts iniciais da home: ${unique.length} arquivos, ${total} bytes gzip\n`);
if (process.argv.includes("--detail")) detalhes.forEach((item) => process.stdout.write(`${item.bytes} ${item.url}\n`));
