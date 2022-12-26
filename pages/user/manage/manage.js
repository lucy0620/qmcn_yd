// pages/user/manage/manage.js
const app = getApp();
import * as utilRoute from '../../../utils/route'
import * as utilStorage from '../../../utils/storage'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbarData: {
      type: 1,
      title: '管理员录入',
      return: true,
      home: true
    },
    background: '',
    menuList: [{
      title: '书籍类型管理',
      url: '/pages/user/manage/manageType/manageType',
    },{
      title: '书籍标签管理',
      url: '/pages/user/manage/manageLabels/manageLabels',
    },{
      title: '书籍管理',
      url: '/pages/user/manage/manageBook/manageBook',
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      background: utilStorage.getKey('background') ? utilStorage.getKey('background') : app.globalData.background,
    })
  },

  menuTap(e) {
    let item = e.currentTarget.dataset.item
    utilRoute.navigate(item.url)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})