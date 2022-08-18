const TPLinkSmartPlug = require('tplink-smartplug-node');
const http = require('http');
const smartPlugList = require('./config').smartPlugList;
const domoticzApiConfig = require("./config").domoticzApiConfig;

let sentRealDataToDomoticz = function () {
    console.log("Start *** sentRealDataToDomoticz ***");

    let options = {
        host: domoticzApiConfig.host,
        port: domoticzApiConfig.port,
        path: ""
    };

    for (let idx = 0; idx < smartPlugList.length; idx++) {
        let tp = new TPLinkSmartPlug(smartPlugList[idx].ip);
        tp.getEmeterRealtime().then(resp => {
            console.log("Get information for plug : " + smartPlugList[idx].name);
            // console.log(resp);
            let power = resp.emeter.get_realtime.power_mw / 1000;
            console.log("Power = " + power);
            options.path = domoticzApiConfig.path + smartPlugList[idx].domoticzPowerIdx + '&svalue=' + power;
            let req = http.request(options);
            req.on('error', function (e) {
                console.error("Request failed");
                console.error(e);
            });
            req.on('timeout', function () {
                console.log("Request timeout");
            });
            req.end();

        })
    }
    setTimeout(sentRealDataToDomoticz, 1000);
};
sentRealDataToDomoticz();