import { ElMessage } from 'element-plus'

// 匹配assets里面所有的资源
const assetsModules: any = import.meta.glob('./src/assets/**/*.{png,svg,jpg}', {
  import: 'default',
  eager: true
})

// 动态绑定图片src
export const getImageUrl = (name: string) => {
  const path = `../assets/${name}`
  return assetsModules[path]
}

// 千分位
export const addThousand = (num: any) => {
  if (num) {
    num = Number(num).toFixed(2)
  }
  if ((!num && num !== 0) || num == 'NaN') return '--'
  const regForm = /(\d{1,3})(?=(\d{3})+(?:$|\.))/g
  num = num.toString().replace(regForm, '$1,')
  let i = num.length - 1
  while (num[i] == 0) {
    num = num.slice(0, -1)
    i--
    if (num[i] == '.') {
      return num.slice(0, -1)
    }
  }
  return num
}

// 日期格式化
export function parseTime(time: string | number, pattern: string) {
  if (arguments.length === 0 || !time) {
    return null
  }
  // {y}-{m}-{d} {h}:{i}:{s}
  const format = pattern || '{y}-{m}-{d}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    } else if (typeof time === 'string') {
      time = time
        .replace(new RegExp(/-/gm), '/')
        .replace('T', ' ')
        .replace(new RegExp(/\.[\d]{3}/gm), '')
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj: any = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

// 下载
export function download(file: any, fileType: string, fileName?: string) {
  if (!fileName) {
    const timeStr = new Date().getTime()
    fileName = `${timeStr}`
  }
  const type = formatFileType(fileType)
  if (!type) return ElMessage.warning('暂不支持其他格式!')
  const blob = new Blob([file], { type })
  const downloadElement = document.createElement('a')
  const href = window.URL.createObjectURL(blob) // 创建下载的链接
  downloadElement.href = href
  downloadElement.download = fileName // 下载后文件名
  document.body.appendChild(downloadElement)
  downloadElement.click() // 点击下载
  document.body.removeChild(downloadElement) // 下载完成移除元素
  window.URL.revokeObjectURL(href) // 释放掉blob对象
}

// 格式化文件类型
export function formatFileType(fileFormat: string) {
  const enums = [
    { code: 'png', type: 'image/png' },
    { code: 'jpg', type: 'image/jpeg' },
    { code: 'jpeg', type: 'image/jpeg' },
    { code: 'pdf', type: 'application/pdf' },
    { code: 'doc', type: 'application/msword' },
    {
      code: 'docx',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    },
    {
      code: 'xlsx',
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    },
    {
      code: 'xls',
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  ]
  const findVal: any = enums.find((item) => item.code === fileFormat) || {}
  return findVal.type
}

/**
 * 复制方法
 * @param value 传入要复制的值
 */
export function copy(value: string) {
  if (!value) {
    return ElMessage.error('复制失败')
  }
  const tag = document.createElement('textarea')
  tag.value = value
  document.body.appendChild(tag)
  tag.select()
  document.execCommand('copy')
  ElMessage.success('复制成功')
  tag.remove()
  return value
}
