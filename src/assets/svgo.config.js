export default {
  multipass: true,
  plugins: [
    'preset-default', // 启用默认的内置插件
    {
      name: 'removeAttrs', // 移除的属性
      params: {
        attrs: ['fill', 'fill-rule'],
      },
    },
    {
      name: 'cleanupNumericValues', // 清理数值
      params: {
        floatPrecision: 2, // 设置小数点后保留的位数
        leadingZero: true, // 是否保留小数点前的零
      },
    },
  ],
}
