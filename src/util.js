// 时间戳转日期  需要引入的方法名要加export修饰
export function timestampToTime (timestamp) {
  var date = new Date(timestamp)
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var D = date.getDate() + ' '
  var h = date.getHours() + ':'
  var m = date.getMinutes() + ':'
  var s = date.getSeconds()
  return Y + M + D
  // return Y + M + D + h + m + s
}

// 数字转为K,W
export function numFormat (num) {
  if (num >= 10000) {
    num = Math.round(num / 1000) / 10 + 'W'
  } else if (num >= 1000) {
    num = Math.round(num / 100) / 10 + 'K'
  }
  return num
}

// 毫秒转为分秒格式
export function secondToFormat (s) {
  let min = repairZero(Math.floor(s / 60))
  let sec = repairZero(Math.floor(s % 60))
  return makeStr(':', min, sec)
}

// 补 0 的方法, 数字小于 10 时，返回 0 + 数字
function repairZero (num) {
  num = num.toString()
  return num[1] ? num : '0' + num
}

// 字符串拼接
function makeStr () {
  let code = Array.prototype.shift.call(arguments)
  return Array.prototype.join.call(arguments, code)
}
