import { TableType } from '@/components/Table/data'
import { FormType } from '@/components/Form/data'
export const drawerVisible = ref(false)
export const ids = ref('') // 批量删除的id
export const isAdd = ref(1) // 1添加 0修改

export const loading = ref(false)

export const searchFormConfig: FormType = reactive({
  inline: true,
  // 表单配置项
  formItemColumn: [
    { type: 'input', label: '角色名称', prop: 'role_name', maxlength: 8 },
  ],
  // 表单检验规则
  formRules: {
    role_name: [{ required: true, message: '角色名不能为空', trigger: 'blur' }],
  },
})
export const drawerFormConfig: FormType = reactive({
  width: '80%',
  size: 'large',
  formFooterFlag: true,
  formFooterStyle: {
    paddingTop: '16px',
    paddingLeft: '24px',
  },
  formFooter: {
    submit: {
      text: '提交',
      loading: false,
    },
    cancel: {
      text: '取消',
    },
  },
  inline: true,
  // labelWidth:'65px',
  // 表单配置项
  formItemColumn: [
    { type: 'input', label: '角色名称', prop: 'role_name', maxlength: 8 },
    { type: 'input', label: '角色值', prop: 'role_value', maxlength: 18 },
    {
      type: 'switch',
      label: '状态',
      prop: 'role_status',
      slotName: 'switchSlot',
    },
    { type: 'textarea', label: '备注', prop: 'remark', maxlength: 30 },
    { type: 'tree', label: '菜单分配', slotName: 'treeSlot', prop: 'menus' },
  ],
  // 表单检验规则
  formRules: {
    role_name: [
      { required: true, message: '角色名称不能为空', trigger: 'blur' },
    ],
    role_value: [
      { required: true, message: '角色值不能为空', trigger: 'blur' },
    ],
    role_id: [{ required: true, message: '角色不能为空', trigger: 'blur' }],
  },
})
export const tableConfig: TableType = reactive({
  loading: true,
  tableData: [],
  // 表格配置项
  tableColumns: [
    { attr: { label: '角色名称', prop: 'role_name' } },
    { attr: { label: '角色值', prop: 'role_value' } },
    { slotName: 'role_status', attr: { label: '状态', prop: 'role_status' } },
    { attr: { label: '创建时间', prop: 'create_time' } },
    { attr: { label: '修改时间', prop: 'update_time' } },
    { attr: { label: '备注', prop: 'remark' } },
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
  tableHeight: 'calc(100vh - 100px )',
  paginationFlag: true,
  total: 0,
  drawerFlag: true,
  drawerTitle: '角色',
})
