// port 1 = mode [weaken, hack, grow]
// port 2 = target

/** @param {NS} ns */
export async function main(ns) {
	let target;
	if (ns.args.length == 1) {
		if (ns.args[0] == '--help') {
			ns.tprint('[manager.js]: ./manager.js <target>');
			return;
		}
		target = ns.args[0];
	} else {
		ns.tprint('[manager.js]: Invalid usage.');
		return;
	}
	ns.clearPort(1);
	ns.clearPort(2);
    ns.tprint('Running against ' + target + '..');
	while (true) {
		await ns.tryWritePort(2, target);

		if (canWeaken(ns, target)) {
			let done;
			do {
				done = await ns.tryWritePort(1, 'weaken');
			} while (done);
		} else if (canGrow(ns, target)) {
			let done;
			do {
				done = await ns.tryWritePort(1, 'grow');
			} while (done);
		} else {
			let done;
			do {
				done = await ns.tryWritePort(1, 'hack');
			} while (done);
		}

		await ns.sleep(5000);
	}
}

export function canWeaken(ns, server) {
    let target = Math.round(ns.getServerMinSecurityLevel(server));
	let current = Math.round(ns.getServerSecurityLevel(server));
	return current > target;
}

export function canGrow(ns, server) {
    let current = Math.round(ns.getServerGrowth(server));
	return current < 75;
}

export function canHack(ns, server) {
    let max = Math.round(ns.getServerMaxMoney(server));
	let current = Math.round(ns.getServerMoneyAvailable(server));
	return current > (max * 0.75);
}