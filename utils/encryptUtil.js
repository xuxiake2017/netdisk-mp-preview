import { JSEncrypt } from 'wxmp-rsa'
import md5 from './md5';

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDBuCd3Nij/0v1f+zoErXKYfBEt
Ws7zMIJ8NWKtzDJST2SCD2bnmGnNY4AE+cEcf/yu0rcmIg8BlnX8drFx2KGsh/P1
1vuvxy7WaD434aF9bQBkdGDU3F/SlJs9uawdeCdrH5IwfcDaE/3wLkcjLOaKgfNv
UL1KdwvKRwmZJDX0YwIDAQAB
-----END PUBLIC KEY-----
`

export const encode = (origin) => {
  const encryptContext = new JSEncrypt()
  encryptContext.setPublicKey(PUBLIC_KEY)
  const encryptedData = encryptContext.encryptLong(origin)
  return encryptedData
}

export const makeSign = (params, secret) => {
  let signStr = ''
  Object.keys(params).filter(key => key !== '_sign').sort((a, b) => a - b).forEach(key => {
    signStr += key
    signStr += params[key]
  })
  signStr = `${secret}${signStr}${secret}`
  const token = md5.md5(signStr).toUpperCase()
  return encode(token)
}