import process from "node:process";
import { remixFastify } from "@mcansh/remix-fastify";
import { installGlobals } from "@remix-run/node";
import { fastify } from "fastify";
import getPort, { portNumbers } from "get-port";
import sourceMapSupport from "source-map-support";
installGlobals();
sourceMapSupport.install();
const app = fastify({
	logger: {
		level: process.env.NODE_ENV ? "info" : "error",
	},
});
await app.register(remixFastify);
const host = process.env.HOST === "true" ? "0.0.0.0" : "127.0.0.1";
const desiredPort = Number(process.env.PORT) || 3000;
const portToUse = await getPort({
	port: portNumbers(desiredPort, desiredPort + 100),
});
const address = await app.listen({ port: portToUse, host });
if (portToUse !== desiredPort) {
	console.warn(
		`Port ${desiredPort} is not available, using ${portToUse} instead.`,
	);
}
console.log(`app ready: ${address}`);
