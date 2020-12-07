'use strict'

const utils = require('./utils')

const start = async () => {
    let crypto = utils.stringToBase58('BTCETHCPD'), dates = ["2020February02", "2021January03"]
    dates = dates.map((v) => utils.stringToAscii(v))

    let big = utils.concatValues(dates[0], crypto, dates[1])

    for (let i = 6; i <= 12; i++)
        big = utils.hexToValue(utils.sha256(big.pow(i).toString()))

    utils.checkHexAgainstAddress(utils.valueToHex(big))
}

start().catch((err) => console.log(err))