const app = getApp();
/**
 * 封装请求统一格式
 * @param {*} url 请求url
 * @param {*} params 请求参数
 * @param {*} loading 是否显示加载中
 * @param {*} contentType 请求头类型
 */
export const request = (url, params, noLoading, contentType = 'application/json') => {
  return new Promise((resolve, reject) => {
    if (!noLoading) {
      wx.showLoading({
        title: "加载中",
        mask: true,
      });
    }
    wx.request({
      url: app.globalData.baseUrl + url,
      data: params,
      header: {
        'Content-type': contentType,
      },
      success(res) {
        resolve(res.data);
      },
      fail(err) {
        reject(err);
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
      },
      complete(com) {
        wx.hideLoading();
        wx.stopPullDownRefresh()
      }
    })
  })
}