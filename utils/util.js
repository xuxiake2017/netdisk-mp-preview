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
      return `-${String.prototype.toLocaleLowerCase.call(match)}`
    })
    styleStr += `${res}: ${item[1]};`
  })
  return styleStr
}

module.exports = {
  styleObj2StyleStr: styleObj2StyleStr,
}
