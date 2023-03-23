import { JSEncrypt } from 'wxmp-rsa'
import md5 from './md5';

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDHbXhCqyAxCXZYRzyzSd1eWnmx
40uVT/l5YgIHv76dt+2mvTlPBfz5Sks2usrKdXwlWVN6LH6QIV9alvEEpHIGM3E2
xXhYq9U5OARK329huxYzcSESKI+CfznqLIs2e7YY5/xIxhXE/q6SbmaXz7Shp+SB
S5bERVIUzMueNkq3nwIDAQAB
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