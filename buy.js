/** @param {NS} ns */
export async function main(ns) {
    if (ns.args.length === 0) {
        list(ns);
    } else {
        let id = ns.args[0];
        if (id > 20) {
            ns.tprint('ID out of range');
            return;
        }
        let number = ns.getPurchasedServers().length + 1;
        let hostname = ns.purchaseServer(`zombie-${number}`, Math.pow(2, id));
        ns.tprint(`Purchased server ${hostname} with ${Math.pow(2, id)}GB RAM`);
    }
}

/** @param {NS} ns */
export function list(ns) {
    ns.tprint("-".padStart(60, "-"));
    ns.tprint(
        "ID".padStart(10),
        "RAM".padStart(10),
        "PRICE".padStart(20),
        "CAN AFFORD".padStart(20),
    );
    ns.tprint("-".padStart(60, "-"));

    let money = ns.getPlayer().money;

    for (let i = 1; i <= 20; i++) {
        let ram = Math.pow(2, i);
        let price = ns.getPurchasedServerCost(ram);
        ns.tprint(
            `${i}`.padStart(10),
            `${ram}`.padStart(10),
            `${price}`.padStart(20),
            `${money >= price}`.padStart(20),
        );
    }
}