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

const formateSecond = (seconds) => {
  const minute = Number.parseInt(seconds / 60)
  const second = minute === 0 ? String(seconds) : String(seconds - minute * 60)
  return `${minute}:${second.length === 1 ? '0' + second : second}`
}


let timeout = null;
/**
 * 防抖原理：一定时间内，只有最后一次操作，再过wait毫秒后才执行函数
 * 
 * @param {Function} func 要执行的回调函数 
 * @param {Number} wait 延时的时间
 * @param {Boolean} immediate 是否立即执行 
 * @return null
 */
const debounce = function (func, wait = 500, immediate = false) {
	// 清除定时器
	if (timeout !== null) clearTimeout(timeout);
	// 立即执行，此类情况一般用不到
	if (immediate) {
		var callNow = !timeout;
		timeout = setTimeout(function() {
			timeout = null;
		}, wait);
		if (callNow) typeof func === 'function' && func();
	} else {
		// 设置定时器，当最后一次操作后，timeout不会再被清除，所以在延时wait毫秒后执行func回调方法
		timeout = setTimeout(function() {
			typeof func === 'function' && func();
		}, wait);
	}
}

let timer, flag;
/**
 * 节流原理：在一定时间内，只能触发一次
 * 
 * @param {Function} func 要执行的回调函数 
 * @param {Number} wait 延时的时间
 * @param {Boolean} immediate 是否立即执行
 * @return null
 */
function throttle(func, wait = 500, immediate = true) {
	if (immediate) {
		if (!flag) {
			flag = true;
			// 如果是立即执行，则在wait毫秒内开始时执行
			typeof func === 'function' && func();
			timer = setTimeout(() => {
				flag = false;
			}, wait);
		}
	} else {
		if (!flag) {
			flag = true
			// 如果是非立即执行，则在wait毫秒内的结束处执行
			timer = setTimeout(() => {
				flag = false
				typeof func === 'function' && func();
			}, wait);
		}
		
	}
};

module.exports = {
  styleObj2StyleStr: styleObj2StyleStr,
  formateSecond: formateSecond,
  debounce: debounce,
  throttle: throttle,
}
