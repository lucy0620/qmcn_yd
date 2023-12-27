// 滚动到底方法
function toViewBottomFun() {
  wx.createSelectorQuery().select('#chatBox').boundingClientRect(function (rect) {
    wx.pageScrollTo({
      scrollTop: rect.height,
      duration: 100 // 滑动速度
    })
  }).exec();
}

// 复制
handleCopy: (e) => {
  wx.setClipboardData({
    data: `${e.target.dataset.data}`,
    success: function (res) {
      utilShow.showMyMsg('已复制到粘贴板')
    }
  })
}