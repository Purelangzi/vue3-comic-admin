/**
 * 判断当前的时间段
 * @returns 上午|下午|晚上
 */
export function useTimePeriod() {
  const currentTime = ref(new Date())
  const timePeriod = computed<string>(() => {
    const currentHour = currentTime.value.getHours()
    if (currentHour < 12) {
      return '上午'
    } else if (currentHour < 18) {
      return '下午'
    } else {
      return '晚上'
    }
  })
  let timer: NodeJS.Timeout
  const updateCurrentTime = () => {
    currentTime.value = new Date()
    timer = setTimeout(updateCurrentTime, 1000)
  }
  onMounted(() => {
    updateCurrentTime()
  })
  onUnmounted(() => {
    clearTimeout(timer)
  })
  return {
    timePeriod,
  }
}
