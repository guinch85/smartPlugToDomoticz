const TPLinkSmartPlug = require('tplink-smartplug-node');
const jsonExport = require('jsonexport');
const fs = require("fs");
const path = require('path')
const FTPClient = require('ftp');
const ftpConfig = require('./config').ftpConfig;
const smartPlugList = require('./config').smartPlugList;

let sentHistoryDataToSme = function () {
    let d = new Date();
    let currentMonth = d.getMonth() + 1;
    let currentYear = d.getFullYear();

    let promiseList = [];

    for (let idx = 0; idx < smartPlugList.length; idx++) {
        let tp = new TPLinkSmartPlug(smartPlugList[idx].ip);

        tp.raw({emeter: {get_daystat: {month: currentMonth, year: currentYear}}}).then(respData => {
            console.log("Get information for plug : " + smartPlugList[idx].name);
            let macAddress = smartPlugList[idx].mac;
            console.log(macAddress);
            let id = macAddress.replaceAll(':', '');
            console.log(id);

            let data = respData.emeter.get_daystat.day_list;
            // console.log(data);
            let rows = [];
            for (let i = 0; i < data.length; i++) {
                let dataYear = data[i].year;
                let dataMonth = data[i].month < 10 ? "0" + data[i].month : data[i].month;
                let dataDay = data[i].day < 10 ? "0" + data[i].day : data[i].day;
                let d = dataYear + "-" + dataMonth + "-" + dataDay;
                // console.log(d);
                let row = {
                    id: smartPlugList[idx].technical_id,
                    value: data[i].energy_wh,
                    date: d
                }
                // console.log(row);
                rows.push(row);
            }
            const exportCsv = new Promise((resolve, reject) => {
                jsonExport(rows, (err, csv) => {
                    if (err) reject(err);
                    fs.writeFileSync('./export/' + smartPlugList[idx].technical_id + ".csv", csv)
                    // console.log("CSV file " + item.name + " ready!");
                    resolve();
                })
            });
            promiseList.push(exportCsv);

            console.log(rows);

        }).catch(console.log);
    }

    Promise.all(promiseList).then(() => {
        console.log("All files is ready for send");
        let ftpClient = new FTPClient();

        ftpClient.connect(ftpConfig);

        ftpClient.on('ready', function () {
            const exportPath = path.join(__dirname, '/export');
            fs.readdir(exportPath, function (err, files) {
                if (err) console.log(err);
                else {
                    let csvFiles = files.filter(el => path.extname(el) === '.csv');
                    for (let f = 0; f < csvFiles.length; f++) {
                        let file = csvFiles[f];
                        // console.log(file);
                        ftpClient.put('export/' + file, file, function (err) {
                            if (err) console.log(err);
                            console.log("File " + file + " sent successfully");
                            if (f === csvFiles.length - 1) ftpClient.end();
                        });
                    }
                }
            })
        });
    });
};

sentHistoryDataToSme();
