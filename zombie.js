/** @param {NS} ns */
export async function main(ns) {
    let old;
    let target;
    while (true) {
        let mode = ns.readPort(1);
        if (mode != old) {
            old = mode;
            target = ns.readPort(2);
            ns.print(`[zombie.js] Mode updated to ${mode} - ${target}`);
        }
        if (mode === 'weaken') {
            await ns.weaken(target);
        } else if (mode === 'grow') {
            await ns.grow(target);
        } else if (mode === 'hack') {
            await ns.hack(target);
        } else {
            await ns.sleep(5000);
        }
    }
}