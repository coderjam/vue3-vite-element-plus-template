export function useInterval() {
  const timerArray: any[] = []

  const stopInterval = () => {
    // eslint-disable-next-line no-console
    console.log('定时器结束')
    const length = timerArray.length
    timerArray.forEach((item) => {
      item && clearInterval(item)
    })
    // 清空数组
    timerArray.splice(0, length)
  }
  // 是否清除之前的定时器
  const startInterval = (callback: (...args: any[]) => void, delay = 1000, isClear = true) => {
    const length = timerArray.length
    // eslint-disable-next-line no-console
    console.log('定时器开始', timerArray, length)
    if (isClear) {
      stopInterval()
      timerArray[0] = setInterval(callback, delay)
    } else {
      timerArray[length] = setInterval(callback, delay)
    }
  }

  onBeforeUnmount(stopInterval)
  return { startInterval, stopInterval }
}
