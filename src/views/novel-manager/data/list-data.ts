import { FormInstance } from 'element-plus'
import { TableType } from '@/components/Table/data'
import { FormType } from '@/components/Form/data'

export const searchFormConfig: FormType = reactive({
  inline: true,
  // 表单配置项
  formItemColumn: [
    { type: 'input', label: '小说名称', prop: 'name', maxlength: 22 },
  ],
  // 表单检验规则
  formRules: {
    name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  },
})

export const tableConfig: TableType = reactive({
  loading: true,
  tableData: [], // 表格数据
  // 表格配置项
  tableColumns: [
    { attr: { label: '小说名称', prop: 'name' } },
    { attr: { label: '简介', prop: 'intro' } },
    {
      slotName: 'cover_lateral',
      attr: { label: '封面', prop: 'cover_lateral' },
    },
    { attr: { label: '阅读量', prop: 'read' } },
    { attr: { label: '点赞量', prop: 'fabulous' } },
    { attr: { label: '价格', prop: 'price' } },
    { slotName: 'is_vip', attr: { label: '是否收费', prop: 'is_vip' } },
    {
      slotName: 'operation',
      attr: {
        label: '操作',
        prop: 'operation',
        fixed: 'right',
        width: '200px',
      },
    },
  ],
  tableHeight: 'calc(100vh - 100px )', // 表格高度,
  paginationFlag: true, // 分页器开关
  total: 0, // 分页器总数
  dialogFlag: true,
  dialogTitle: '分类',
})

export const dialogVisible = ref(false)
export const dialogEditVisible = ref(false)
export const ids = ref('') // 批量删除的id
export const isAdd = ref(0) // 1添加 0修改
export const dialogFormRef = ref<FormInstance>()

export const excelTableColumns = [
  // 导出的表格列
  { label: '小说名称', prop: 'name' },
  { label: '简介', prop: 'intro' },
  { label: '封面', prop: 'cover_lateral' },
  { label: '阅读量', prop: 'read' },
  { label: '点赞量', prop: 'fabulous' },
  { label: '价格', prop: 'price' },
  { label: '阅读量', prop: 'read' },
  { label: '是否收费', prop: 'is_vip' },
]
