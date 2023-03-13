/**
 * @description: 根据月份返回天数
 * @param  {Number} month 月份
 * @param  {Number} days 天数
 */
const checkMonthDays = (month, days) => {
  let day
  switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      day = 31
      break
    case 4:
    case 6:
    case 9:
    case 11:
      day = 30
      break
    case 2:
      day = days === 365 ? 28 : 29
      break
  }
  return day
}

/**
 * @description: 获取天数对应的星期
 * @param  {number} num 天数
 * @param  {number} month 月份
 * @param  {number} year 年份
 */
const addNum = (num, month, year) => {
  const arr = []
  let obj = {}
  for (let i = 1; i <= num; i++) {
    obj.date = i
    obj.weekday = new Date(`${year}/ ${month} / ${i}`).getDay()
    arr.push(obj)
    obj = {}
  }
  return arr
}

/**
 * @description: 判断是否闰年
 * @param  {Number} year 传入年份
 */
const isLeapYear = (year) => {
  return year % 4 > 0
}

export default {
  checkMonthDays,
  addNum,
  isLeapYear
}
