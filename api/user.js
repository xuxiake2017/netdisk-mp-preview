import { postJSON, post } from '../utils/request'

export const LoginAndRegister = params => {
  return postJSON('wechat/loginAndRegister', params)
}

export const AutoLogin = params => {
  return post('wechat/autoLogin', params)
}

export const GetCaptcha = params => {
  return post('wechat/getCaptcha', params)
}

export const VerifyCaptcha = params => {
  return post('wechat/verifyCaptcha', params)
}

export const SendSMSCaptcha = params => {
  return postJSON('wechat/sendSMSCaptcha', params)
}

export const Logout = params => {
  return postJSON('wechat/logout', params)
}

export const GetInfo = params => {
  return postJSON('user/getInfo', params)
}

export const GetDetail = params => {
  return postJSON('user/detail', params)
}