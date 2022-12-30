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
      title: '书籍类型',
      return: true,
      home: true
    },
    background: '',
    types: [],
    manage: '' // 是否为管理员编辑模式
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getTypes()
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    if (prevPage.route == 'pages/user/manage/manage') {
      this.setData({
        manage: true
      })
    }
  },

  async getTypes() {
    let res = await request('/getBook_type')
    let types = res.data
    this.setData({
      types
    })
  },

  async moveType(e) {
    let type = e.currentTarget.dataset.type // 上移或者下移
    let index = e.currentTarget.dataset.index // 当前选中的下标
    let type_id = this.data.types[index].type_id // 当前选中的id
    let length = this.data.types.length
    let wei = 0
    if (type == 'up') {
      let topWei = this.data.types[index - 1].weight
      if (index == 1) {
        wei = topWei - 1
      } else {
        let toptopWei = this.data.types[index - 2].weight
        wei = toptopWei + (topWei - toptopWei) / 2
      }
    } else {
      let botWei = this.data.types[index + 1].weight
      if (index == length - 2) {
        wei = botWei + 1
      } else {
        let botbotWei = this.data.types[index + 2].weight
        wei = botWei + (botbotWei - botWei) / 2
      }
    }
    let res = await request('/move_type', {
      type_id,
      wei
    })
    if (res.code == 200) {
      this.getTypes()
    }
  },

  choose(e) {
    console.log('choss')
    let item = e.currentTarget.dataset.item
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2]; //上一页
    if (prevPage.route == 'pages/user/manage/manageBook/editBook') {
      prevPage.setData({
        'detail.type_name': item.type_name,
        'detail.type_id': item.type_id,
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