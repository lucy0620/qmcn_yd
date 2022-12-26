// pages/user/manage/manageLabels/manageDerive.js
const app = getApp();
import {
  request
} from '../../../../utils/request'
import * as utilRoute from "../../../../utils/route"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    app,
    navbarData: {
      type: 1,
      title: '衍生作品',
      return: true,
      home: true
    },
    derive: [],
    derive_ids: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let derive_ids = options.derive_ids ? options.derive_ids.split(',') : []
    this.setData({
      derive_ids
    })
    this.getDerive()
  },

  async getDerive() {
    let res = await request('/getBook_derive')
    let derives = res.data
    this.setData({
      derives
    })
  },

  editValue(e) {
    this.setData({
      derive_ids: e.detail
    })
  },

  handleOperation(e) {
    let _this = this
    let derive_names = []
    this.data.derives.map(it=>{
      _this.data.derive_ids.filter(its=>{
        if(it.derive_id == its) {
          derive_names.push(it.derive_name)
        }
      })
    })
    if(e.detail) {
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2]; //上一页
      if(prevPage.route == 'pages/user/manage/manageBook/editBook') {
        prevPage.setData({
          'detail.derive_names' : derive_names.join(','),
          'detail.derive_ids' : this.data.derive_ids.join(','),
        })
        utilRoute.back()
      }
    } else {
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