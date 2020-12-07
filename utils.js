'use strict'

const constants = require('./constants')
const bigInt    = require('big-integer')
const ethjs     = require('ethereumjs-util')
const crypto    = require('crypto')

const stringToBase58 = (string, alphabet = constants.alphabet.base58.btc) => {
    let decoded = bigInt(0);

	while (string){
        decoded = decoded.multiply(58).add(alphabet.indexOf(string[0]))

		string = string.substring(1);
	}

	return decoded;
}

const reversedStringToBase58 = (string) => stringToBase58(string.split('').reverse().join(''))

const valueToHex = (value) => {
    let hex = value.toString(16)

    if (hex.length % 2 > 0) hex = "0" + hex

    return hex
}

const hexToValue = (hex) => bigInt(hex, 16)

const toLittleEndian = (string) => {
    let len = string.length, littleEndianString = ""

    for(let i = 0; i < len/2; i++)
        littleEndianString += string.substring((len-((i+1)*2)),(len-(i*2)))

    return littleEndianString
}

const toBigEndian = (string) => {
    let len = string.length, bigEndianHexString = "";

    for(let i = 0; i < len/2; i++)
        bigEndianHexString += string.substring((len-(i*2)), (len-((i+1)*2)))

    return bigEndianHexString
}

const stringToAscii = (string) => hexToValue(Buffer.from(string.split('').map((c) => c.charCodeAt(0)), 16).toString('hex'))

const padding = (bigIntegerHexString) => {
    let string = bigIntegerHexString
    
	while (string.length < 64) string = '0' + string
        
	if (64 < string.length) string = string.substring(string.length-64)

	return string; 
}

const concatValues = (...vals) => new bigInt(vals.flat().map((v) => v.toString()).join(''))

const sha256 = (encrypt) => crypto.createHash('sha256').update(encrypt).digest('hex')

const checkHexAgainstAddress = (hex, bounty = "0x812DFd7fB17f148d5F0E85Cb3018f8822Ad89E91") => {
    hex = ethjs.addHexPrefix(padding(hex))

    let privk = ethjs.toBuffer(hex), pub = ethjs.toChecksumAddress(ethjs.Address.fromPrivateKey(privk).toString())

    if (pub === bounty) console.log(`Found! PrivateKey: ${hex}`)
}

module.exports = { 
    stringToBase58, reversedStringToBase58, valueToHex, hexToValue, toLittleEndian, toBigEndian,
    stringToAscii, concatValues, sha256, checkHexAgainstAddress
}