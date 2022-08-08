/** @param {NS} ns */
export async function main(ns) {
    let server;
	if (ns.args.length == 1) {
		server = ns.args[0];
	} else {
        ns.tprint('[-] Missing target for dropper.');
		return;
	}
	ns.tprint('[+] Running against ' + server + '..');
    await download('zombie.js', ns, server);
    let threads = await this.getThreads(2.0, ns, server);
    ns.tprint(`[+] This server can run with ${threads} threads..`);
    ns.exec('zombie.js', server, threads);
	ns.tprint(`[+] Now running on ${server} with ${threads} threads.`);
}

export async function download(script, ns, server) {
	let exists = await ns.fileExists(script, server);
	if (!exists) {
		ns.tprint('[+] Uploading ' + script + ' to ' + server);
		await ns.scp(script, 'files', server);
	} else {
		ns.tprint('[+] Overwriting ' + script + ' on ' + server);
		await ns.scp(script, 'files', server);
	}
}

export async function getThreads(weight, ns, server) {
	let free = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
	let floor = Math.floor(free / weight);
	return Math.round(floor);
}