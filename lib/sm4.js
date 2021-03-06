// sm4.js
// 可能会使用gm-crypt 、 aes
const sm4 = require('sm-crypto').sm4;
// import Sm4js from './sm4js'; //esmodule
// import util from './utils.js'
// import md5 from 'md5'
const Sm4js = require('./sm4js')
// const Sm4js = require('sm4js')
const util = require('./utils')
const md5 = require('md5')

/**
 * 加密
 * @param  {string} mt  十六进制字段串
 * @param  {array} key  长度为16的数组
 * @return {array}     [description]
 */
let encrypt = (mt, key, {hashKey = true}) => {
  // 方法内求key的散列值
  // key = util.str16ToArr16(md5(key))
  // key = util.hexStrToArr(md5(key))
  key = hashKey ? util.hexStrToArr(md5(key)) : key
  // mt = util.strToAscii(mt)
  // console.log('key', key)
  // console.log('mt', mt)
  let iv = util.randomArr(0, 255, 16)
  let encryptData = sm4.encrypt(iv, key)

  // let dataBytes = util.hexStrToArr(mt)
  let dataBytes = ''
  if (typeof(mt) === 'string') {
    dataBytes = util.strToAscii(mt)
  }

  let hashCode = md5(dataBytes)
  dataBytes = dataBytes.concat(util.hexStrToArr(hashCode))
  let sm4ConfigEnd = {
    key: key,
    mode: 'cbc',
    iv: iv,
    cipherType: 'array',
    mtType: 'array'
  }
  let sm4End = new Sm4js(sm4ConfigEnd)
  let ctEnd = sm4End.encrypt(dataBytes)
  return encryptData.concat(ctEnd)
}
let decrypt = (ct, key, {hashKey = true}) => {
  // key = util.str16ToArr16(md5(key))
  // key = util.hexStrToArr(md5(key))
  key = hashKey ? util.hexStrToArr(md5(key)) : key
  let iv = sm4.decrypt(ct.slice(0, 16), key)
  let sm4ConfigEnd = {
    key: key,
    mode: 'cbc',
    iv: iv,
    cipherType: 'array',
    mtType: 'array'
  }
  let sm4End = new Sm4js(sm4ConfigEnd)
  let origText = sm4End.decrypt(ct.slice(16))
  let hashCode = md5(origText.slice(0, -16))
  if (hashCode === util.arrToHexStr(origText.slice(-16))) {
    // return util.arrToHexStr(origText.slice(0, -16))
    return util.asciiToStr(origText.slice(0, -16))
  } else {
    return null
  }
}

// module.exports = {
//   encrypt: encrypt,
//   decrypt: decrypt
// }

export default {
  // test: function () {
  //   console.log('test from ecdsa')
  // }
  encrypt: encrypt, // 可能不应该显露加密方法
  decrypt: decrypt
}