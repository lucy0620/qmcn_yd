// pages/user/manage/manageLabels/manageLabels.js
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
      title: '书籍标签',
      return: true,
      home: true
    },
    background: '',
    type: '',
    label: [],
    label_ids: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options.type && options.type == 'edit') {
      let label_ids = options.label_ids ? options.label_ids.split(',') : []
      this.setData({
        label_ids,
        type: 'edit'
      })
    }
    this.getLabel()
  },

  async getLabel() {
    let res = await request('/getBook_label')
    let labels = res.data
    this.setData({
      labels
    })
  },

  editValue(e) {
    this.setData({
      label_ids: e.detail
    })
  },

  handleOperation(e) {
    let _this = this
    let label_names = []
    this.data.labels.map(it=>{
      _this.data.label_ids.filter(its=>{
        if(it.label_id == its) {
          label_names.push(it.label_name)
        }
      })
    })
    if(e.detail) {
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2]; //上一页
      if(prevPage.route == 'pages/user/manage/manageBook/editBook') {
        prevPage.setData({
          'detail.label_names' : label_names.join(','),
          'detail.label_ids' : this.data.label_ids.join(','),
        })
        utilRoute.back()
      }
    } else {
      utilRoute.back()
    }
  },

  async moveType(e) {
    let type = e.currentTarget.dataset.type // 上移或者下移
    let index = e.currentTarget.dataset.index // 当前选中的下标
    let label_id = this.data.labels[index].label_id // 当前选中的id
    let length = this.data.labels.length
    let wei = 0
    if (type == 'up') {
      let topWei = this.data.labels[index - 1].weight
      if (index == 1) {
        wei = topWei - 1
      } else {
        let toptopWei = this.data.labels[index - 2].weight
        wei = toptopWei + (topWei - toptopWei) / 2
      }
    } else {
      let botWei = this.data.labels[index + 1].weight
      if (index == length - 2) {
        wei = botWei + 1
      } else {
        let botbotWei = this.data.labels[index + 2].weight
        wei = botWei + (botbotWei - botWei) / 2
      }
    }
    let res = await request('/move_label', {
      label_id,
      wei
    })
    if (res.code == 200) {
      this.getLabel()
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