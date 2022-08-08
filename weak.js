/** @param {NS} ns */
export async function main(ns) {
    if (ns.args.length == 0) {
        return;
    }
    await ns.weaken(ns.args[0]);
}