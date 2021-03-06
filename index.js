// const sm = require('./lib/sm.js')
const sm = require('./lib/index.js')
// const axios = require('axios')
// const sm4 = require('sm-crypto').sm4;
// const sm4 = require('gm-crypt').sm4;
// const sm4 = require('./lib/sm4.js')
// const sm4 = import('./lib/sm4.js')
import sm4 from './lib/sm4.js'
// console.log(sm4)
// const instance = require('./lib/instanceAxios')
import instance from './lib/instanceAxios'
import utils from './lib/utils'
import {Base64} from 'js-base64'
import ecdsa from './lib/ecdsa'
import {SHA3, Keccak, SHAKE} from 'sha3' // 使用外部引入的

var hashStr = 'c888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a' // 与go代码里一样的字符串
var priStr = '55c974f17a0b44178d982dcd478150b8a4c0f206f397d7880d06bf5a72932b81'
var sm2 = sm.sm2
var sm3 = sm.sm3

// main()
function main() {
  console.log('start main')
  test0()
  test1()
  test2()
}

// 使用指定的私钥
function test0() {
  var keyesDefine = sm2.genKeyPair(priStr)
  var ct = keyesDefine.encrypt(hashStr)
  console.log('ct:', ct, `[${ct.join(', ')}]`)
  // ct: [246, 106, 106, 40, 249, 239, 104, 205, 94, 25, 74, 123, 117, 222, 186, 157, 161, 54, 72, 5, 161, 55, 231, 22, 35, 1, 41, 120, 226, 18, 197, 95, 143, 44, 190, 238, 171, 248, 247, 163, 91, 234, 30, 56, 158, 201, 3, 172, 214, 151, 42, 167, 104, 91, 90, 12, 34, 99, 41, 73, 16, 156, 197, 27, 253, 36, 73, 156, 146, 2, 200, 250, 44, 127, 17, 67, 162, 208, 186, 195, 225, 179, 163, 180, 116, 102, 126, 226, 35, 154, 39, 58, 206, 129, 255, 188, 61, 178, 253, 3, 203, 218, 136, 187, 226, 146, 186, 169, 2, 171, 209, 211, 186, 73, 67, 86, 61, 69, 97, 52, 88, 225, 75, 208, 231, 225, 45, 118, 46, 15, 250, 16, 193, 84, 3, 152, 135, 81, 63, 19, 170, 94, 178, 101, 148, 187, 41, 86, 30, 219, 31, 72, 230, 44, 144, 144, 155, 171, 205, 173]
  var mt = keyesDefine.decrypt(ct)
  console.log('mt:', `[${mt.join(', ')}]`)
  // mt: [99, 56, 56, 56, 99, 57, 99, 101, 57, 101, 48, 57, 56, 100, 53, 56, 54, 52, 100, 51, 100, 101, 100, 54, 101, 98, 99, 99, 49, 52, 48, 97, 49, 50, 49, 52, 50, 50, 54, 51, 98, 97, 99, 101, 51, 97, 50, 51, 97, 51, 54, 102, 57, 57, 48, 53, 102, 49, 50, 98, 100, 54, 52, 97]
  var signData = keyesDefine.signSha512(hashStr)
  console.log('signData:', signData)
  // signData: {r: "4e403f48d144c3077ea0cc2070535a9d9ccad580459b735f9c988b6f64851000", s: "6db31e8b77902d72417b4593b9e3734cb8f10389ce3382774d75b0d3a317b8a4"}
  var isok = keyesDefine.verify512(hashStr, signData.r, signData.s)
  console.log('isok:', isok)
  // isok: true
}

// 使用自动生成的私钥
function test1() {
  console.log('start test1')
  var keyesAuto = sm2.genKeyPair()
  console.log('keyesAuto', keyesAuto)
  var ct = keyesAuto.encrypt(hashStr)
  console.log('ct', ct)
  // console.log('ct:', `[${ct.join(', ')}]`)
  // // ct: [246, 106, 106, 40, 249, 239, 104, 205, 94, 25, 74, 123, 117, 222, 186, 157, 161, 54, 72, 5, 161, 55, 231, 22, 35, 1, 41, 120, 226, 18, 197, 95, 143, 44, 190, 238, 171, 248, 247, 163, 91, 234, 30, 56, 158, 201, 3, 172, 214, 151, 42, 167, 104, 91, 90, 12, 34, 99, 41, 73, 16, 156, 197, 27, 253, 36, 73, 156, 146, 2, 200, 250, 44, 127, 17, 67, 162, 208, 186, 195, 225, 179, 163, 180, 116, 102, 126, 226, 35, 154, 39, 58, 206, 129, 255, 188, 61, 178, 253, 3, 203, 218, 136, 187, 226, 146, 186, 169, 2, 171, 209, 211, 186, 73, 67, 86, 61, 69, 97, 52, 88, 225, 75, 208, 231, 225, 45, 118, 46, 15, 250, 16, 193, 84, 3, 152, 135, 81, 63, 19, 170, 94, 178, 101, 148, 187, 41, 86, 30, 219, 31, 72, 230, 44, 144, 144, 155, 171, 205, 173]
  // var mt = keyesAuto.decrypt(ct)
  // console.log('mt:', `[${mt.join(', ')}]`)
  // // mt: [99, 56, 56, 56, 99, 57, 99, 101, 57, 101, 48, 57, 56, 100, 53, 56, 54, 52, 100, 51, 100, 101, 100, 54, 101, 98, 99, 99, 49, 52, 48, 97, 49, 50, 49, 52, 50, 50, 54, 51, 98, 97, 99, 101, 51, 97, 50, 51, 97, 51, 54, 102, 57, 57, 48, 53, 102, 49, 50, 98, 100, 54, 52, 97]
  // var signData = keyesAuto.signSha512(hashStr)
  // console.log('signData:', signData)
  // // signData: {r: "8fa4acb8ed782e0aadd2a03c49ab60abe3a1ad625c17f7207294762dbdcf63bd", s: "a1899998f6d57b6e9eb7c133f07032a910c5acf0b53c58b2cccd0755ff78afed"}
  // var isok = keyesAuto.verify512(hashStr, signData.r, signData.s)
  // console.log('isok:', isok)
  // // isok: true
}

// 使用原版sm2.js的方法
function test2() {
  var keys = sm2.genKeyPair()
  var sign = keys.sign(hashStr)
  console.log('sign:', sign)
  // sign: {r: "64590e43b91e7a6c1249c9f3e19cb1f84e9fe56160d9f502a764e856193c9336", s: "2063cb56b981581a333b11ade303106c6c388a86955a01915ee5e6cfcba8faab"}
  var isok = keys.verify(hashStr, sign.r, sign.s)
  console.log('isok:', isok)
  // isok: true
  var ct = keys.encrypt(hashStr)
  console.log('ct:', `[${ct.join(', ')}]`)
  var mt = keys.decrypt(ct)
  // console.log('mt:', `[${mt.join(', ')}]`)
  console.log('mt', mt)
}

/**
 * 用于测试的方法
 * @return {Function} [description]
 */
function fn () {
  console.log('welcome to here')
}

/**
 * 使用did请求公钥
 * @param  {string} did [description]
 * @return {promise}     [description]
 */
function getPubByDid (did) {
  let reqBody = {
    "jsonrpc":"2.0",
    "method":"did_getPubkeyByDid",
    "params":[
      // "did:ttm:u0ece7b787c097d55b87d4c01efae0fbe6a27b10cec8a67847c68f0482a8dc"
    ],
    "id":1
  }
  reqBody.params.push(did)
  return instance.get(did, {params: reqBody})
}

/**
 * 生成密钥对
 * @param  {[type]} priStr [description]
 * @return {[type]}        [description]
 */
// function genKey(priStr) {
//   var keys = sm2.genKeyPair(priStr)
//   console.log('keys', keys.pri.toString(16), keys.pub.x.toString(16), keys.pub.y.toString(16))
//   var ct = keys.encrypt(hashStr)
//   console.log('ct', ct)
//   var mt = keys.decrypt(ct)
//   console.log('mt:', `[${mt.join(', ')}]`)
//   return ct
// }


/**
 * 获得keystore
 * @return {[type]} [description]
 */
function getDidttm (did) {
  let url = '/did/didttm/' // + did
  // console.log('url', url)
  return instance({
    // url: `/did/didttm/${Base64.encode(did).substr(0, 8)}`,
    // url: `/did/didttm/${Base64.encode(did)}`,
    // url: `/did/didttm/${did}`,
    url: url,
    method: 'get',
    params: {
      did: did
    }
  })
}
/**
 * 解密didttm
 * @param  {[type]} ct  [description]
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
function decryptDidttm (ct, key) {
  let decode = Base64.decode(ct)
  key = 'JeF8U9wHFOMfs2Y8'
  let sm4fn = new this.sm4({
    key: key, // key
    mode: 'cbc',
    iv: 'UISwD9fW6cFh9SNS',
    cipherType: 'base64'
  })
  return sm4fn.decrypt(decode)
}
/**
 * 加密didttm
 * @param  {[type]} mtStr [description]
 * @param  {[type]} key   [description]
 * @return {str}       [description]
 */
// function encryptDidttm (mtStr, key) {
//   if (typeof(mtStr) !== 'string') {
//     throw new Error('参数不是字符串')
//   }
//   key = 'JeF8U9wHFOMfs2Y8'
//   let sm4fn = new this.sm4({
//     key: key,
//     mode: 'cbc',
//     iv: 'UISwD9fW6cFh9SNS',
//     cipherType: 'base64'
//   })
//   let ct = sm4fn.encrypt(mtStr)
//   let encode = Base64.encode(ct)
//   return encode
// }
/**
 * 获得pvdata
 * @return {[type]} [description]
 */
// function getPvData (did) {
//   let url = '/did/pvdata' // + did
//   // console.log('url', url)
//   return instance({
//     // url: `/did/pvdata/${Base64.encode(did).substr(0, 8)}`,
//     // url: `/did/pvdata/${Base64.encode(did)}`,
//     // url: `/did/pvdata/${did}`,
//     url: url,
//     method: 'get',
//     params: {
//       did: did
//     }
//   })
// }
/**
 * 解密pvData
 * @param  {[type]} ct  [description]
 * @param  {[type]} pri [description]
 * @return {[type]}     [description]
 */
function decryptPvData (ct, pri) {
  let keys = null
  if (typeof(pri) === 'string') {
    keys = sm2.genKeyPair(pri)
  } else {
    keys = pri
  }
  var mt = keys.decrypt(ct)
  mt = utils.asciiToStr(mt)
  mt = JSON.parse(mt)
  return mt
}

// 解密图片
let decryptPic = function (picCt, priStr) {
  priStr = priStr.indexOf('0x') === 0 ? priStr.slice(2) : priStr
  let ct = utils.hexStrToArr(picCt)
  let mt = sm4.decrypt(ct, priStr, {hashKey: true})
  // console.log('mt', mt)
  return mt
  // return encode(mt)
}

/**
 * 获得didList
 * @param  {[type]} phone [description]
 * @return {[type]}       [description]
 */
function getDidList (phone) {
  // return instance.get(`/node/udidList`)
  return instance({
    url: '/node/udidList',
    method: 'get',
    params: {
      phone: phone
    }
  })
}
/**
 * 请求验证码
 * @param  {[type]} phone [description]
 * @return {[type]}       [description]
 */
function getCheckCode (phone) {
  // return instance.get(`/node/vcode/${phone}`)
  return instance({
    url: `/node/vcode`,
    params: {
      phone: phone
    }
  })
}




/**
 * 创建身份证书
 * @return {[type]} [description]
 */
function createIdCertify () {
}
/**
 * 根据证书id请求链上的证书指纹数据
 * @param  {[type]} claim_sn [description]
 * @return {[type]}          [description]
 */
function getCertifyFingerPrint (claim_sn, isShow) {
  // return instance({
  //   url: '/claim/fingerprint',
  //   method: 'get',
  //   params: {
  //     claim_sn: claim_sn
  //   }
  // })
  return instance({
    url: '',
    method: 'post',
    // data: {"jsonrpc":"2.0","method":"ma_getMetainfo","params":[templateId],"id":1}
    data: {"jsonrpc":"2.0","method":"cer_getCertifyById","params":[claim_sn, isShow],"id":1}
  })
}
/**
 * 根据证书模板id请求证书模板
 * @param  {[type]} templateId [description]
 * @return {[type]}            [description]
 */
function getTemplate (templateId) {
  // return instance({
  //   url: '/claim/template',
  //   method: 'get',
  //   params: {
  //     templateId: templateId
  //   }
  // })
  return instance({
    url: '',
    method: 'post',
    data: {"jsonrpc":"2.0","method":"ma_getMetainfo","params":[templateId],"id":1}
  })
}
/**
 * 得到证书模板列表
 * 暂时不需要参数
 * @return {[type]} [description]
 */
function getTemplateList () {
  return instance({
    url: 'claim/templateList',
    method: 'get',
    params: {
    }
  })
}
/**
 * 验证身份证书
 * @return {[type]} [description]
 */
function validateIdCertify () {}
/**
 * 取消身份证书
 * @return {[type]} [description]
 */
function cancelIdCertify () {}
/**
 * 创建通用证书
 * @return {[type]} [description]
 */
function createCommonCertify () {}
/**
 * 验证通用证书
 * @return {[type]} [description]
 */
function validateCommonCertify () {}
/**
 * 核验通用证书
 * @return {[type]} [description]
 */
function checkCommonCertify () {}
/**
 * 取消通用证书
 * @return {[type]} [description]
 */
function cancelCheckCommonCertify () {}
/**
 * 取消证书
 * @param  {[type]} claim_sn [description]
 * @return {[type]}          [description]
 */
// function cancelCertify (claim_sn, did, hashCont, endtime, pri) {
//   let keys = null
//   if (typeof(pri) === 'string') {
//     keys = sm2.genKeyPair(pri)
//   } else {
//     keys = pri
//   }
//   let sign = keys.signSha512(`${did}cancel${claim_sn}=${hashCont}end at${endtime}`)
//   return instance({
//     url: '/claim/cancel',
//     method: 'put',
//     data: {
//       did: did,
//       claim_sn: claim_sn,
//       hashCont: hashCont,
//       endtime: endtime,
//       sign: sign
//     }
//   })
// }
/**
 * 获取签发证书页面的临时url
 * @param  {[type]} claim_sn    [description]
 * @param  {[type]} templateId  [description]
 * @param  {[type]} certifyData [description]
 * @return {[type]}             [description]
 */
// function certifySignUrl (claim_sn, templateId, certifyData) {
//   return instance({
//     url: '/claim/certifySignUrl',
//     method: 'post',
//     data: {
//       claim_sn: claim_sn,
//       templateId: templateId,
//       certifyData: certifyData
//     }
//   })
// }
/**
 * 获取签发证书页面的数据
 * @param  {[type]} certifySignUuid [description]
 * @return {[type]}                 [description]
 */
function getCertifySignData (certifySignUuid) {
  return instance({
    url: '/claim/certifySignUrl',
    method: 'get',
    params: {
      certifySignUuid: certifySignUuid
    }
  })
}
/**
 * 提交签发
 * @param  {[type]} certifySignUuid [description]
 * @return {[type]}                 [description]
 */
// function signCertify(did, claim_sn, templateId, hashValue, endTime, sign) {
//   return instance({
//     url: '/claim/validate',
//     method: 'post',
//     data: {
//       did: did,
//       claim_sn: claim_sn,
//       templateId: templateId,
//       hashValue: hashValue,
//       endTime: endTime,
//       sign: sign
//     }
//   })
// }
/**
 * 把byte型的数组 => 16进制的字符串
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
function bytesToStrHex(arr) {
  var str = ''
  for (var i = 0; i < arr.length; i++) {
    var temp = parseInt(arr[i], 10).toString(16)
    if (temp.length < 2) {
      temp = '0' + temp
    }
    str += temp
  }
  return str
}
/**
 * 保存证书的临时数据
 * @param {[type]} claim_sn    [description]
 * @param {[type]} templateId  [description]
 * @param {[type]} certifyData [description]
 * @param {[type]} expire      [description]
 * @param {[type]} purpose     [description]
 */
// function setTemporaryCertifyData (claim_sn, templateId, certifyData, expire, purpose) {
//   return instance({
//     url: '/claim/temporaryCertifyData',
//     method: 'post',
//     data: {
//       claim_sn: claim_sn,
//       templateId: templateId,
//       certifyData: certifyData,
//       expire: expire,
//       purpose: purpose
//     }
//   })
// }
/**
 * 得到证书的临时数据
 * @param  {[type]} temporaryID [description]
 * @return {[type]}             [description]
 */
function getTemporaryCertifyData (temporaryID) {
  return instance({
    url: '/claim/temporaryCertifyData',
    method: 'get',
    params: {
      temporaryID: temporaryID
    }
  })
}
// module.exports = {
//   main,
//   test0,
//   test1,
//   test2,
//   fn,
//   getPubByDid,
//   sm2,
//   // sm3,
//   sm4,
//   getDidttm,
//   decryptDidttm,
//   getPvData,
//   decryptPvData,
//   getDidList,
//   getCheckCode,

//   bytesToStrHex,
//   createIdCertify,
//   validateIdCertify,
//   cancelIdCertify,
//   createCommonCertify,
//   validateCommonCertify,
//   checkCommonCertify,
//   cancelCheckCommonCertify,
//   genKey
// }

// keccak(256)的哈希方法
function hashKeccak256 (msg, format = 'hex') {
  let hash = new Keccak(256)
  let msgs = []
  if (typeof(msg) === 'string') {
    msgs.push(msg)
  }
  for (let i = 0, iLen = msgs.length; i < iLen; i++) {
    hash.update(msgs[i])
  }
  let hashStr = hash.digest(format)
  hash.reset()
  return hashStr
}

// 从远端拉取数据
function pullBackupData (key, needHask = true) {
  if (needHask) {
    key = hashKeccak256(key)
  }
  return instance({
    url: '',
    method: 'post',
    data: {
      jsonrpc: '2.0',
      method: 'dp_getDepository',
      params: [key],
      id: 1
    }
  })
}


export default {
  main,
  test0,
  test1,
  test2,
  fn,
  getPubByDid,
  sm2,
  sm3,
  sm4,
  SHA3,
  Keccak,
  SHAKE,
  ecdsa,
  getDidttm,
  decryptDidttm,
  // encryptDidttm,
  // getPvData,
  decryptPvData,
  decryptPic,
  getDidList,
  getCheckCode,

  bytesToStrHex,
  // setTemporaryCertifyData,
  getTemporaryCertifyData,
  createIdCertify,
  getCertifyFingerPrint,
  getTemplate,
  getTemplateList,
  validateIdCertify,
  cancelIdCertify,
  createCommonCertify,
  validateCommonCertify,
  checkCommonCertify,
  cancelCheckCommonCertify,
  // cancelCertify,
  // certifySignUrl,
  getCertifySignData,
  // signCertify,
  // genKey,
  utils,
  hashKeccak256,
  pullBackupData
}
