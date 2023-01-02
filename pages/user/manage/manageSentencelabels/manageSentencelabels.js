const app = getApp();
import {
  request
} from '../../../../utils/request'
import * as utilStorage from "../../../../utils/storage"
Page({

  /**
   * 页面的初始数据
   */

  data: {
    app,
    navbarData: {
      type: 1,
      title: '句子标签',
      return: true,
      home: true
    },
    background: '',
    sentence_labels: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getSentenceLabels()
    this.setData({
      background: utilStorage.getKey('background') ? utilStorage.getKey('background') : app.globalData.background,
    })
  },

  async getSentenceLabels() {
    let res = await request('/get_SentenceLabels')
    this.setData({
      sentence_labels: res.data
    })
  },

  async moveType(e) {
    let type = e.currentTarget.dataset.type // 上移或者下移
    let index = e.currentTarget.dataset.index // 当前选中的下标
    let label_id = this.data.sentence_labels[index].label_id // 当前选中的id
    let length = this.data.sentence_labels.length
    let wei = 0
    if (type == 'up') {
      let topWei = this.data.sentence_labels[index - 1].weight
      if (index == 1) {
        wei = topWei - 1
      } else {
        let toptopWei = this.data.sentence_labels[index - 2].weight
        wei = toptopWei + (topWei - toptopWei) / 2
      }
    } else {
      let botWei = this.data.sentence_labels[index + 1].weight
      if (index == length - 2) {
        wei = botWei + 1
      } else {
        let botbotWei = this.data.sentence_labels[index + 2].weight
        wei = botWei + (botbotWei - botWei) / 2
      }
    }
    let res = await request('/move_sentence_label', {
      label_id,
      wei
    })
    if (res.code == 200) {
      this.getSentenceLabels()
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