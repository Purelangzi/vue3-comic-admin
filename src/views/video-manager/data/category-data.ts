import { FormInstance } from 'element-plus'
import { TableType } from '@/components/Table/data'
import { FormType } from '@/components/Form/data'

export const formConfig: FormType = reactive({
  inline: true,
  // 表单配置项
  formItemColumn: [
    { type: 'input', label: '分类名称', prop: 'name', maxlength: 8 },
  ],
  // 表单检验规则
  formRules: {
    name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  },
})

export const tableConfig: TableType = reactive({
  loading: true,
  tableData: [],
  searchColumn: [
    // 搜索表单配置项
    { label: '分类名称', prop: 'name', maxlength: 8 },
  ],
  rules: {
    // // 搜索表单检验规则
    name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  },
  tableColumns: [
    // 表格配置项
    { attr: { label: '分类名称', prop: 'name' } },
    { slotName: 'cover_img', attr: { label: '封面', prop: 'cover_img' } },
    { attr: { label: '创建时间', prop: 'create_time' } },
    { attr: { label: '修改时间', prop: 'update_time' } },
    { slotName: 'status', attr: { label: '状态', prop: 'status' } },
    {
      slotName: 'operation',
      attr: { label: '操作', prop: 'operation', fixed: 'right' },
    },
  ],
  tableHeight: 'calc(100vh - 100px )', // 表格高度,
  paginationFlag: true,
  total: 0,
  dialogFlag: true,
  dialogTitle: '分类',
})

export const dialogVisible = ref(false)
export const ids = ref('') // 批量删除的id
export const isAdd = ref(1) // 1添加 0修改
export const dialogFormRef = ref<FormInstance>()
