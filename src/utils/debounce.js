/**
 * 防抖函数
 * @param {Function} fn - 目标执行函数
 * @param {Number} delay - 延迟时间（ms）
 * @param {Boolean} immediate - 是否立即执行（首次触发立即执行，后续延迟）
 * @returns {Function} 防抖后的函数
 */
export function debounce(fn, delay = 300, immediate = true) {
  let timer = null
  return function (...args) {
    // 清除上一次的定时器
    if (timer) clearTimeout(timer)
    // 立即执行逻辑
    if (immediate && !timer) {
      fn.apply(this, args)
    }
    // 重置定时器
    timer = setTimeout(() => {
      if (!immediate) {
        fn.apply(this, args)
      }
      timer = null // 执行后清空定时器，保证immediate逻辑生效
    }, delay)
  }
}
