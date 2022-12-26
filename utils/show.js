/**
 * 轻提示
 * @param {*} title  提示的内容
 * @param {*} icon 图标样式 success/error/loading
 * @param {*} data 其他配置
 */
export function showMyMsg(title, icon = 'none', data = {}) {
  wx.showToast({
    title,
    icon,
    ...data
  })
}
/**
 * 转圈提示
 * @param {*} title  提示的内容
 * @param {*} mask 是否显示透明蒙层
 */
export function showMyLoading(title = '', mask = true) {
  wx.showLoading({
    title,
    mask
  })
}
/**
 * 关闭转圈提示
 */
export function hideMyLoading() {
  wx.hideLoading()
}
/**
 * 弹窗提示
 * @param {*} content  提示的内容
 * @param {*} title 提示的标题
 * @param {*} showCancel 是否显示取消按钮
 * @param {*} confirm 确认执行函数
 * @param {*} cancel 取消执行函数
 */
export function showMyModal(content = '', title = '提示', showCancel = true, confirm,cancel = () => {}) {
  wx.showModal({
    content,
    title,
    showCancel,
    complete: (res) => {
      if (res.confirm) {
        confirm()
      }
      if (res.cancel) {
        cancel()
      }
    }
  })
}