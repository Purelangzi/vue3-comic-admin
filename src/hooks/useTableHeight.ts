/**
 * @param height 减去的高度
 * @returns 表格高度
 */
export default function useTableHeight(height?: number) {
  const tableHeight = ref(0)
  const computedTableHeight = () => {
    tableHeight.value =
      document.documentElement.clientHeight ||
      document.body.clientHeight - (height ? height : 0)
    console.log(tableHeight.value, '55555555')
  }
  const handleResize = () => {
    computedTableHeight()
  }
  onMounted(() => {
    computedTableHeight()
    window.addEventListener('resize', handleResize)
  })
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
  return {
    tableHeight,
  }
}
