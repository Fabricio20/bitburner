const left = 30, right = 40;

/** @param {NS} ns */
export async function main(ns) {
    if (ns.args.length == 0) {
        ns.tprint("Missing target server.");
        return;
    }
    let target = ns.args[0];
    if (!ns.serverExists(target)) {
        ns.tprint("Target server does not exist.");
        return;
    }

    ns.tprint("-".padStart(left + right, "-"));
    ns.tprint(
        "NAME".padStart(left),
        "VALUE".padStart(right),
    );
    ns.tprint("-".padStart(left + right, "-"));

    // -- Ram
    ns.tprint(
        "RAM".padStart(left),
        `${ns.getServerMaxRam(target)}`.padStart(right)
    );

    // -- Has Root Access
    ns.tprint(
        "HACKED".padStart(left),
        `${ns.hasRootAccess(target)}`.padStart(right)
    );

    // -- Security Level
    ns.tprint(
        "Security Level".padStart(left),
        `${Math.round(ns.getServerSecurityLevel(target))}`.padStart(right)
    );
    // -- Time to Weaken
    ns.tprint(
        "Time To Weaken".padStart(left),
        `${Math.round(ns.getWeakenTime(target))}`.padStart(right)
    );

    // -- Money Limit
    ns.tprint(
        "Money Limit".padStart(left),
        `${ns.getServerMaxMoney(target)}`.padStart(right)
    );
    // -- Money Available
    ns.tprint(
        "Money Available".padStart(left),
        `${Math.round(ns.getServerMoneyAvailable(target))}`.padStart(right)
    );
    const pct = (ns.getServerMoneyAvailable(target) / ns.getServerMaxMoney(target)) * 100;
    // -- Money Percentage
    ns.tprint(
        "Money Percentage".padStart(left),
        `${ns.nFormat(pct + '', "0.0a")}%`.padStart(right)
    );
}