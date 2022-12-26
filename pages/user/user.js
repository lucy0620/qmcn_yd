const app = getApp()
import * as utilStorage from '../../utils/storage'
import * as utilRoute from '../../utils/route'
import * as utilShow from '../../utils/show'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    app,
    baseUrl: app.globalData.baseUrl,
    isIphoneX: app.globalData.isIphoneX,
    // 菜单列表
    menuList: [{
      title: '管理员录入',
      link: true,
      url: '/pages/user/manage/manage',
      auth: true,
      show: false
    }, {
      title: '主题设置',
      link: true,
      show: true
    }, {
      title: '反馈',
      link: true,
      url: '/pages/user/suggestions/suggestions',
      auth: true,
      show: true
    }, {
      title: '退出',
      link: true,
      show: ''
    }],
    background: '',
    user_info: '',
    showBackground: false,
  },

  // 点击登录
  loginTap() {
    utilRoute.navigate(app.globalData.authorizeUrl)
  },
  // 切换颜色
  changeBackground(e) {
    let background = e.detail
    utilStorage.setKey('background', background)
    this.setData({
      showBackground: false,
      background,
    })
    utilShow.showMyMsg('设置主题色成功')
  },
  // 点击菜单
  menuTap(e) {
    let item = e.currentTarget.dataset.item
    if (item.title == '反馈') {
      utilShow.showMyMsg('暂未开放')
      return
    }
    if (item.url) {
      if (item.auth) {
        app.handleIsLogin(function () {
          utilRoute.navigate(item.url)
        })
      } else {
        utilRoute.navigate(item.url)
      }
    } else {
      if (item.title == '退出') {
        utilStorage.removeKey('user_info');
        this.onShow()
      } else if (item.title == '主题设置') {
        this.setData({
          showBackground: true
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let user_info = utilStorage.getKey('user_info');
    let index_exit = this.data.menuList.findIndex(item =>
      item.title == '退出')
    let index_book = this.data.menuList.findIndex(item =>
      item.title == '管理员录入')
    let menu_exit = `menuList[${index_exit}].show`
    let menu_book = `menuList[${index_book}].show`
    if (user_info) {
      this.setData({
        user_info,
        [menu_exit]: true,
        [menu_book]: user_info.role == 1 ? true : false
      })
    } else {
      this.setData({
        user_info,
        [menu_exit]: false,
        [menu_book]: false
      })
    }
    this.setData({
      background: utilStorage.getKey('background') ? utilStorage.getKey('background') : app.globalData.background,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})