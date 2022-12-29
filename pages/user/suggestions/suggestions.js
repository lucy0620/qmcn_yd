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
      title: '反馈',
      return: true,
      home: true
    },
    background: '',
    user_info: '',
    type: 'suggestion', // 书籍反馈report 建议suggestion 
    id: '',
    name: '',
    contact: '', // 联系方式
    content: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      id,
      name,
    } = options

    this.setData({
      id,
      name,
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
      contact,
      content,
      name,
      id,
      user_info,
    } = this.data
    let data = {
      user_id: user_info.id,
      contact,
      content
    }
    if (e.detail) {
      if (!content) {
        utilShow.showMyMsg('请输入反馈内容')
        return
      }
      if (type == 'report') {
        data = {
          ...data,
          id,
          name,
        }
      }
      let url = '/add_suggestion'
      let res = await request(url, data)
      if (res.code == 200) {
        utilShow.showMyMsg('已提交反馈')
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
  onReady: function () {
    if (this.data.name) {
      this.setData({
        type: 'report'
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      background: utilStorage.getKey('background') ? utilStorage.getKey('background') : app.globalData.background,
      user_info: utilStorage.getKey('user_info'),
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
  onPullDownRefresh: function () {

  },

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