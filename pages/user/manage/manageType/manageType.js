// pages/user/manage/manageType/manageType.js
const app = getApp();
import {
  request
} from '../../../../utils/request'
import * as utilRoute from "../../../../utils/route"
import * as utilStorage from "../../../../utils/storage"
Page({

  /**
   * 页面的初始数据
   */

  data: {
    app,
    navbarData: {
      type: 1,
      title: '书籍标签管理',
      return: true,
      home: true
    },
    background: '',
    types: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getType()
  },

  async getType() {
    let res = await request('/getBook_type')
    let types = res.data
    this.setData({
      types
    })
  },

  choose(e) {
    let item = e.currentTarget.dataset.item
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2]; //上一页
    if(prevPage.route == 'pages/user/manage/manageBook/editBook') {
      prevPage.setData({
        'detail.type_name' : item.name,
        'detail.type_id' : item.type_id,
      })
      utilRoute.back()
    }
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