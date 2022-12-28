// pages/sentence/addSentence/addSentence.js
const app = getApp();
import {
  request
} from '../../../utils/request'
import * as utilRoute from "../../../utils/route"
import * as utilTime from "../../../utils/time"
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
      title: '添加记录',
      return: true,
      home: true
    },
    background: '',
    user_info: '',
    id: '',
    name: '',
    type: 'recommend', // 推文recommend 句子sentence
    title: '',
    content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let {
      id,
      name
    } = options

    this.setData({
      id,
      name
    })
  },

  editType(e) {
    this.setData({
      type: e.detail
    })
  },

  editValue(e) {
    let prop = e.currentTarget.dataset.prop
    this.setData({
      [prop]: prop == 'title' ? e.detail : e.detail.value
    })
  },

  async handleOperation(e) {
    let {
      type,
      content,
      title,
      id
    } = this.data
    if (e.detail) {
      if (type == 'recommend' && !title) {
        utilShow.showMyMsg('请输入推文标题')
        return
      }
      if (!content) {
        utilShow.showMyMsg('请输入' + (type == 'recommend' ? '推文' : '句子') + '内容')
        return
      }

      let data = {
        id,
        content
      }
      if (type == 'recommend') {
        data = {
          ...data,
          title
        }
      }
      console.log(data)
      return
      let url = type == 'recommend' ? '/book_add_recommend' : '/book_add_sentence'
      let res = await request(url, data)
      if (res.code == 200) {
        utilShow.showMyMsg(type == 'add' ? '新增推文成功' : '新增句子成功')
        setTimeout(() => {
          utilRoute.back()
        }, 1500)
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
    let _this = this
    this.setData({
      background: utilStorage.getKey('background') ? utilStorage.getKey('background') : app.globalData.background,
      user_info: utilStorage.getKey('user_info'),
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