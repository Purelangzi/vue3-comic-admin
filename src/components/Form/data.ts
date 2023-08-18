import { CSSProperties } from 'vue'
import type { FormRules } from 'element-plus'

export interface FormType {
  width?: string
  formRules?: FormRules
  size?: '' | 'large' | 'default' | 'small'
  inline?: boolean
  labelWidth?: string | number
  formItemColumn?: Array<any>
  formFooterFlag?: boolean
  formFooterStyle?: CSSProperties
  formFooter?: {
    submit: {
      text: string
      loading?: boolean
    }
    cancel: {
      text: string
    }
  }
}
