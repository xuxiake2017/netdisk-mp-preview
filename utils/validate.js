// 大小写字母数字
export function validateAlphaNum (value) {
  const res = /^[A-Za-z\d]+$/.test(value)
  if (!res) {
    throw new Error('请仅输入大小写字母以及数字')
  }
}

// 密码
export function validatePassword (value) {
  if (value.length < 6) {
    throw new Error('密码长度不应小于6位')
  }
  throw validateAlphaNum(value)
}

// 验证码
export function validateCaptcha (value) {
  if (value.length !== 4) {
    throw new Error('验证码长度应为4位')
  } else if (!/^[A-Za-z\d]+$/.test(value)) {
    throw new Error('验证码应只包含数字、字母')
  }
}

// 手机
export function checkPhone (value) {
  value = value && value.toString().trim()
  const isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(value)
  if (!isPhone) {
    throw new Error('请输入正确的手机号')
  }
}

export function checkEmail (value) {
  const val = value && value.toString().trim()
  if (!/^[A-Za-z0-9._%-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,4}$/.test(val)) {
    throw new Error('请输入正确的邮箱地址')
  }
}

// 验证文件（夹）名是否合法
export function verifyFileName (fileName) {
  fileName = fileName.trim()
  if (!fileName) {
    throw new Error('文件名不能为空')
  }
  const reg1 = /^[^ ,./\\][\S]{0,20}$/
  if (!reg1.test(fileName)) {
    throw new Error('不能以 ,./\\开头')
  }
  const reg2 = /[/\\]+/
  if (reg2.test(fileName)) {
    throw new Error('文件名不能包含/\\')
  }
}
