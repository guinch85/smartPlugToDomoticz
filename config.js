let ftpConfig = {
    host: "192.168.85.6",
    port: 21,
    user: 'Home',
    password: 'ludi2400'
}
let domoticzApiConfig={
    host: "192.168.85.6",
    port:8080,
    path :"/json.htm?type=command&param=udevice&idx="
}

let smartPlugList = [
    {
        ip: "192.168.85.153",
        name: "Cave à vin",
        mac: "D8:47:32:8D:62:BB",
        technical_id: "smartPlug62BB",
        domoticzPowerIdx: 1569
    },
    {
        ip: "192.168.85.154",
        name: "Cafetière",
        mac: "D8:47:32:8D:66:AC",
        technical_id: "smartPlug66AC",
        domoticzPowerIdx: 1568
    },
    {
        ip: "192.168.85.155",
        name: "Frigo extension",
        mac: "D8:47:32:8D:62:66",
        technical_id: "smartPlug6266",
        domoticzPowerIdx: 1567
    },
]

module.exports = {
    domoticzApiConfig,
    ftpConfig,
    smartPlugList
};
