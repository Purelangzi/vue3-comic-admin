/**
 * @description 自适应表格高度
 * @param height 减去的高度
 * @returns 表格高度
 */
export const getTableHeight = (height: number) => {
  const res =
    document.documentElement.clientHeight || document.body.clientHeight - height
  console.log(res)

  return res
}

/**
 * 重置数据，把对象的属性都设置为空字符串
 * @param data reactive对象
 */
export const resetData = (data: any) => {
  Object.keys(data).forEach((item) => {
    data[item] = ''
  })
}

/**
 *分割换行符存储在一个数组，
  去除每个字符串两端的空白字符，过滤掉数组中的空字符串返回最终数组
 * @param {string} key 
 * @returns 
 */
export function handleKey(key: string) {
  return key
    .split('\n')
    .map((item) => {
      return item.replace(/(^\s*)|(\s*$)/g, '')
    })
    .filter((item) => item != '')
}
/**
 * 复制字符串
 * @param {string} copytext 复制内容
 */
export function copyText(copytext: any) {
  // 如果浏览器支持这个新API
  if (navigator.clipboard) {
    navigator.clipboard.writeText(copytext)
    ElMessage.success('复制成功')
  } else {
    const text = document.createElement('input') // 创建节点
    text.setAttribute('readonly', 'readonly')
    text.value = copytext // 赋值
    document.body.appendChild(text) // 插入节点
    text.setSelectionRange(0, text.value.length)
    text.select() // 选中节点
    document.execCommand('copy') // 执行浏览器复制方法,该方法已弃用
    if (document.body.removeChild(text)) {
      ElMessage.success('复制成功!')
    } else {
      ElMessage.error('复制失败!')
    }
  }
}
