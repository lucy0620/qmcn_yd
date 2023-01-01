// pages/record/record.js
const app = getApp()
import {
  request
} from '../../utils/request'
import * as utilRoute from "../../utils/route"
import * as utilStorage from "../../utils/storage"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    app,
    isIphoneX: app.globalData.isIphoneX,
    background: '',
    navbarData: {
      type: 1,
      return: false,
      home: false,
      title: '随机找文'
    },
    tabs: ['句子', '推文'],
    current: 0,
    height: '',
    sentences: [],
    recommends: [],
    random: 5,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getHeight()
    this.getRecommends()
    this.getSentences()
  },
  getHeight() {
    let _this = this;
    var query = wx.createSelectorQuery();
    query.select(`.head`).boundingClientRect(function (rect) {
      let num = (rect.height).toFixed(0)
      _this.setData({
        height: `calc(100vh - ${num}px - ${app.globalData.navHeight}rpx - ${app.globalData.isIphoneX ? '178rpx' : '110rpx'} - 60rpx)`
      })
    }).exec();
  },
  changeTab(e) {
    let current = e.currentTarget.dataset.index
    this.setData({
      current
    })
  },
  changeSwiper(e) {
    let current = e.detail.current
    this.setData({
      current
    })
  },
  randomRes() {
    if (this.data.current == 0) {
      this.getSentences()
    } else {
      this.getRecommends()
    }
  },
  async getSentences() {
    const res = await request('/getBook_Sentences', {
      random: this.data.random
    })
    let sentences = res.data.map(it => {
      return {
        ...it,
        label_names: it.label_names.split(',')
      }
    })
    this.setData({
      sentences
    })
  },
  async getRecommends() {
    let _this = this
    const res = await request('/getBook_Recommends', {
      random: _this.data.random
    })
    let recommends = res.data
    this.setData({
      recommends
    })
  },
  goDetail(e) {
    let {
      id,
      sentence_id,
      recommend_id,
    } = e.currentTarget.dataset
    utilRoute.navigate('/pages/book/book_detail/book_detail', {
      id,
      sentence_id,
      recommend_id,
    })
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