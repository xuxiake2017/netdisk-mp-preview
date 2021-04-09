const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 将style的obj形式转换为字符
 * @param {*} obj 
 * @returns 
 */
const styleObj2StyleStr = obj =>  {
  let styleStr = ''
  if (Object.keys(obj).length === 0) {
    return styleStr
  }
  const reg = /[A-Z]/g
  Object.entries(obj).forEach(item => {
    const res = item[0].replace(reg, match => {
      return `_${String.prototype.toLocaleLowerCase.call(match)}`
    })
    styleStr += `${res}: ${item[1]};`
  })
  return styleStr
}

module.exports = {
  formatTime: formatTime,
  styleObj2StyleStr: styleObj2StyleStr,
}
