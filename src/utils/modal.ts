import {
  ElMessage,
  ElMessageBox,
  ElNotification,
  ElLoading
} from 'element-plus'
import { LoadingInstance } from 'element-plus/es/components/loading/src/loading'

let loadingInstance: LoadingInstance

export default {
  // 消息提示
  msg(content: string) {
    ElMessage.info(content)
  },
  // 错误消息
  msgError(content: string) {
    ElMessage.error(content)
  },
  // 成功消息
  msgSuccess(content: string) {
    ElMessage.success(content)
  },
  // 警告消息
  msgWarning(content: string) {
    ElMessage.warning(content)
  },
  // 弹出提示
  alert(content: string, title = '提示', params?: any) {
    ElMessageBox.alert(content, title, params)
  },
  // 错误提示
  alertError(content: string, title = '提示', params?: any) {
    ElMessageBox.alert(content, title, { type: 'error', ...params })
  },
  // 成功提示
  alertSuccess(content: string, title = '提示', params?: any) {
    ElMessageBox.alert(content, title, { type: 'success', ...params })
  },
  // 警告提示
  alertWarning(content: string, title = '提示', params?: any) {
    ElMessageBox.alert(content, title, { type: 'warning', ...params })
  },
  // 通知提示
  notify(content: string) {
    ElNotification.info(content)
  },
  // 错误通知
  notifyError(content: string) {
    ElNotification.error(content)
  },
  // 成功通知
  notifySuccess(content: string) {
    ElNotification.success(content)
  },
  // 警告通知
  notifyWarning(content: string) {
    ElNotification.warning(content)
  },
  // 确认窗体
  confirm(content: string, title = '提示', params?: any) {
    return ElMessageBox.confirm(content, title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      ...params
    })
  },
  // 提交内容
  prompt(content: string, title = '提示', params?: any) {
    return ElMessageBox.prompt(content, title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      ...params
    })
  },
  // 打开遮罩层
  loading(content: string, config?: any) {
    loadingInstance = ElLoading.service({
      lock: true,
      text: content,
      background: 'rgba(0, 0, 0, 0.7)',
      ...config
    })
  },
  // 关闭遮罩层
  closeLoading() {
    loadingInstance.close()
  }
}
