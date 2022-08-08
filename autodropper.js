let targets = ['n00dles', 'foodnstuff', 'sigma-cosmetics', 'hong-fang-tea', 'harakiri-sushi', 
'iron-gym', 'zer0', 'nectar-net', 'CSEC', 'max-hardware', 'neo-net', 'phantasy', 'omega-net', 'silver-helix'];


/** @param {NS} ns */
export async function main(ns) {
    for (let target of targets) {
        let running = ns.scriptRunning('zombie.js', target);
        if (!running) {
            await ns.exec('dropper.js', ns.getHostname(), 1, target);
            ns.tprint(`[${target}]: Dropped. [${running}]`);
        } else {
            ns.tprint(`[${target}]: Running. [${running}]`);
        }
    }
}