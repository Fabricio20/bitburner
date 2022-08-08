let target = 'joesguns';
let zombies = [
    'n00dles', 
    'foodnstuff', 
    'sigma-cosmetics', 
    'hong-fang-tea', 
    'harakiri-sushi', 
    'iron-gym', 
    'CSEC', 
    'max-hardware', 
    'nectar-net',
    'zer0',
    'neo-net',
    'silver-helix',
    'phantasy'
];

/** @param {NS} ns */
export async function main(ns) {
    let weak_weight = ns.getScriptRam('weak.js');
    let grow_weight = ns.getScriptRam('grow.js');
    let hack_weight = ns.getScriptRam('hack.js');

    ns.disableLog('getServerMinSecurityLevel');
	ns.disableLog('getServerSecurityLevel');
	ns.disableLog('getServerMaxMoney');
	ns.disableLog('getServerMoneyAvailable');
	ns.disableLog('sleep');
	ns.disableLog('scp');
	ns.disableLog('exec');
	ns.disableLog('getServerUsedRam');
	ns.disableLog('getServerMaxRam');

    zombies = zombies.filter(zombie => {
        if (!isUsable(ns, zombie)) {
            ns.tprint(`[-] Ignoring ${zombie} since no root access.`);
            return false;
        }
        return true;
    });

    let owned = await fetchOwned(ns);
    if (owned.length > 0) {
        for (let o of owned) {
            zombies.push(o);
        }
        ns.tprint(`[+] Loaded ${owned.length} owned servers.`);
    }

    for (let zombie of zombies) {
        await install(ns, zombie);
        ns.tprint(`[+] Installed scripts on ${zombie}`);
    }

    let old_mode;
    do {
        let mode = getMode(ns, target);
        if (mode != old_mode) {
            old_mode = mode;
            ns.tprint(`[+] Updated to ${mode} mode.`);
        }
        let time;
        if (mode == 'weak') {
            time = ns.getWeakenTime(target);
        } else if (mode == 'hack') {
            time = ns.getHackTime(target);
        } else {
            time = ns.getGrowTime(target);
        }
        for (let zombie of zombies) {
            // -- Ignore busy servers
            const busy = ns.getServerUsedRam(zombie);
            if (busy > 0) {
                continue;
            }

            const ram = ns.getServerMaxRam(zombie);
            // -- Execution
            if (mode == 'weak') {
                const threads = ram / weak_weight;
                ns.exec('weak.js', zombie, threads, target);
            } else if (mode == 'hack') {
                const threads = ram / hack_weight;
                ns.exec('hack.js', zombie, threads, target);
            } else {
                const threads = ram / grow_weight;
                ns.exec('grow.js', zombie, threads, target);
            }
        }
        await ns.sleep(Math.round(time + 1000));
    } while (true);
}

export function isUsable(ns, server) {
    return ns.serverExists(server) && ns.hasRootAccess(server);
}

export async function install(ns, server) {
    await download('weak.js', ns, server);
    await download('hack.js', ns, server);
    await download('grow.js', ns, server);
}

export async function download(script, ns, server) {
	// ns.tprint(`[+] Uploading ${script} to ${server}`);
    await ns.scp(script, 'home', server);
}

export function getMode(ns, target) {
    // hack = needs low security, needs high money, increases security
    // grow = needs low security, needs high money, increase security
    // weak = lowers security
    const security_current = Math.round(ns.getServerSecurityLevel(target));
    const security_target = Math.round(ns.getServerMinSecurityLevel(target)) + 2;
    if (security_current > security_target) {
        return 'weak';
    }
    let money_current = Math.round(ns.getServerMoneyAvailable(target));
    let money_target = Math.round(ns.getServerMaxMoney(target) * 0.75);
    if (money_current >= money_target) {
        return 'hack';
    } else {
        return 'grow';
    }
}

/** @param {NS} ns */
export async function fetchOwned(ns) {
    let servers = [];
    let limit = ns.getPurchasedServerLimit();
    for (let i = 1; i <= limit; i++) {
        let hostname = `zombie-${i}`;
        if (ns.serverExists(hostname)) {
            servers.push(hostname);
        } else {
            break;
        }
    }
    return servers;
}