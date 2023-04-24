export interface ITableOptions {
  // ***** 自定义列模板的插槽名 此属性有值时 只需要关注el-form-item绑定的prop的key值以及editRule
  slotName?: string
  // 此属性有值时 el-form-item 则不生效
  compName?: string
  // 表头
  label: string
  // 字段名称
  prop?: string
  // 对应列的宽度
  width?: string | number
  minWidth?: string | number
  // 对齐方式
  align?: 'left' | 'center' | 'right'
  fixed?: true | 'left' | 'right'
  showOverflowTooltip?: boolean
  // 是否可编辑
  noEdit?: boolean
  // 表单类型 比如输入框、选择器、开关、单选框、多选框等
  editType?: IEditType
  // v-model的key，默认为prop，editKey有值则绑定此属性，一般用于select
  editKey?: string
  // 各种表单项的Attributes
  editAttrs?: object
  // 表单项的子元素 一般出现于select、checkbox等
  editChildren?: {
    name: string
    code: string | number
    type: IEditType
    [name: string]: any
  }[]
  // 表单项的验证规则
  editRule?: any
}

type IEditType =
  | 'checkbox'
  | 'checkbox-group'
  | 'checkbox-button'
  | 'color-picker'
  | 'date-picker'
  | 'input'
  | 'input-number'
  | 'radio'
  | 'radio-group'
  | 'radio-button'
  | 'rate'
  | 'select'
  | 'option'
  | 'slider'
  | 'switch'
  | 'time-picker'
  | 'time-select'
  | 'transfer'
  | 'upload'
