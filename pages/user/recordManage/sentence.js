// pages/user/recordManage/sentence.js
const app = getApp()
import {
  request
} from '../../../utils/request'
import * as utilRoute from "../../../utils/route"
import * as utilShow from "../../../utils/show"
import * as utilStorage from "../../../utils/storage"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    app,
    navbarData: {
      type: 1,
      title: '句子轴',
      return: true,
      home: true
    },
    background: '',
    user_info: '',
    timeline: [],
    timeCount: 3, // 显示几个
    currentT: 0,
    status: 'loading'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      background: utilStorage.getKey('background') ? utilStorage.getKey('background') : app.globalData.background,
      user_info: utilStorage.getKey('user_info'),
    })
    this.getSentencesTimeline()
  },

  goDetail(e) {
    utilRoute.navigate('/pages/book/book_detail/book_detail', {
      id: e.currentTarget.dataset.id
    })
  },

  changeSwiper(e) {
    let currentT = e.detail.current
    if (e.detail.current == this.data.timeline.length) {
      currentT = this.data.timeline.length - 1
    }
    this.setData({
      currentT,
    })
  },

  onTimeline(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      currentT: index
    })
  },

  async getSentencesTimeline() {
    this.setData({
      status: 'loading'
    })
    const res = await request('/getUser_Sentences_timeline', {
      user_id: this.data.user_info.id
    })
    let timeline = res.data
    this.setData({
      timeline,
      status: 'empty'
    })
  },

  // 删除
  delete(e) {
    let {
      id
    } = e.currentTarget.dataset
    let _this = this
    utilShow.showMyModal('确认删除此句子?', '', true, () => {
      _this.deleteRequest(id)
    })
  },
  async deleteRequest(id) {
    const res = await request('/del_sentence', {
      id
    })
    if (res.code == 200) {
      utilShow.showMyMsg('已删除')
      this.getSentencesTimeline()
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


})