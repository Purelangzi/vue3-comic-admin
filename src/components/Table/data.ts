import { CSSProperties } from 'vue'

export interface TableType {
  searchModuleFlag?: boolean
  loading: boolean
  tableData: Array<any>
  tableColumns: Array<any>
  rowStyle?: CSSProperties
  stripe?: boolean
  cellStyle?: CSSProperties
  headerCellStyle?: CSSProperties
  height?: number | string
  selectionFlag?: boolean
  paginationFlag?: boolean
  page?: number
  pageSize?: number
  pageSizes?: number[]
  total?: number
  dialogFlag?: boolean
  dialogVisible?: boolean
  dialogTitle?: string
  dialogWidth?: string | number
  isAdd?: number
  drawerFlag?: boolean
  drawerVisible?: boolean
  drawerTitle?: string
  drawerDirection?: 'ltr' | 'rtl' | 'ttb' | 'btt'
  showClose?: boolean
  drawerSize?: number | string
}
