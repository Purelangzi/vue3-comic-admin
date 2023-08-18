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
    { type: 'input', label: '用户名', prop: 'username', maxlength: 10 },
    { type: 'input', label: '手机号', prop: 'phone', maxlength: 11 },
  ],
  // 表单检验规则
  formRules: {
    username: [{ required: false, message: '用户名不能为空', trigger: 'blur' }],
    phone: [{ required: false, message: '手机号不能为空', trigger: 'blur' }],
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
  labelWidth: '65px',
  // 表单配置项
  formItemColumn: [
    { type: 'input', label: '用户名', prop: 'username', maxlength: 10 },
    {
      type: 'input',
      label: '密码',
      prop: 'password',
      password: true,
      maxlength: 14,
    },
    {
      type: 'select',
      label: '角色',
      prop: 'role_id',
      options: [
        { label: '超级管理员', value: 1 },
        { label: '管理员', value: 3 },
        { label: '影视用户', value: 5 },
        { label: '小说用户', value: 6 },
        { label: '漫画用户', value: 13 },
      ],
      placeholder: '请选择角色',
    },
    { type: 'input', label: '手机', prop: 'phone', maxlength: 11 },
    { type: 'input', label: '邮箱', prop: 'email', maxlength: 18 },
    { type: 'avatar', label: '头像', slotName: 'uploadSlot', prop: 'avatar' },
  ],
  // 表单检验规则
  formRules: {
    username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
    password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
    role_id: [{ required: true, message: '角色不能为空', trigger: 'blur' }],
    phone: [{ required: true, message: '手机不能为空', trigger: 'blur' }],
    email: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }],
  },
})
export const tableConfig: TableType = reactive({
  loading: true,
  tableData: [],
  // 表格配置项
  tableColumns: [
    { attr: { label: '用户名', prop: 'username' } },
    { attr: { label: '邮箱', prop: 'email' } },
    { attr: { label: '手机号', prop: 'phone' } },
    { slotName: 'role_id', attr: { label: '角色', prop: 'role_id' } },
    {
      attr: { label: '创建时间', prop: 'create_time' },
    },
    {
      attr: { label: '修改时间', prop: 'update_time' },
    },
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
  drawerTitle: '账号',
})

export const uploadConfig = {
  avatarFlag: true,
  width: '148px',
  height: '148px',
}
