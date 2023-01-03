// pages/user/recordManage/recordManage.js
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
      title: '我的发布',
      return: true,
      home: true
    },
    background: '',
    user_info: '',
    sentences: [],
    recommends: [],
    tabs: ['句子', '推文'],
    page: [0, 0],
    count: [10, 10],
    status: ['loadmore', 'loadmore'],
    current: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      background: utilStorage.getKey('background') ? utilStorage.getKey('background') : app.globalData.background,
      user_info: utilStorage.getKey('user_info'),
    })
    wx.setBackgroundColor({
      backgroundColor: this.data.background
    })
  },

  goDetail(e) {
    utilRoute.navigate('/pages/book/book_detail/book_detail', {
      id: e.currentTarget.dataset.id
    })
  },

  onTab(e) {
    let current = e.currentTarget.dataset.index
    if (current == this.data.current) {
      this.onTop()
      return
    }
    this.setData({
      current: current == undefined ? this.data.current : current
    })
    wx.pageScrollTo({
      scrollTop: 0
    });
    this.onPullDownRefresh()
  },

  onTop() {
    wx.pageScrollTo({
      scrollTop: 0
    });
  },

  async getSentences() {
    let current = 0
    let status = this.data.status[current]
    let data = {
      page: this.data.page[current],
      count: this.data.count[current],
      user_id: this.data.user_info.id,
    }
    const res = await request('/getBook_Sentences', data,true)
    if (res.data.length < this.data.count[current]) {
      status = 'nomore'
    } else {
      status = 'loadmore'
    }
    let sentences = res.data.map(it => {
      return {
        ...it,
        label_names: it.label_names ? it.label_names.split(',') : []
      }
    })
    this.setData({
      sentences: [...this.data.sentences, ...sentences]
    })
    if (this.data.sentences.length == 0) {
      status = 'empty'
    }
    this.setData({
      [`status[${current}]`]: status
    })
  },

  async getRecommends() {
    let current = 1
    let status = this.data.status[current]
    let data = {
      page: this.data.page[current],
      count: this.data.count[current],
      user_id: this.data.user_info.id,
    }
    const res = await request('/getBook_Recommends', data,true)
    if (res.data.length < this.data.count[current]) {
      status = 'nomore'
    } else {
      status = 'loadmore'
    }
    let recommends = res.data
    this.setData({
      recommends: [...this.data.recommends, ...recommends]
    })
    if (this.data.recommends.length == 0) {
      status = 'empty'
    }
    this.setData({
      [`status[${current}]`]: status
    })
  },

  // 删除
  delete(e) {
    let current = this.data.current
    let tabs = this.data.tabs
    let {
      id
    } = e.currentTarget.dataset
    let _this = this
    utilShow.showMyModal('确认删除此' + tabs[current] + '?', '', true, () => {
      _this.deleteRequest(id)
    })
  },
  async deleteRequest(id) {
    let current = this.data.current
    let url = current == 0 ? '/del_sentence' : '/del_recommend'
    const res = await request(url, {
      id
    })
    if (res.code == 200) {
      utilShow.showMyMsg('已删除')
      this.onPullDownRefresh()
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
    this.onPullDownRefresh()
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
    let current = this.data.current
    this.setData({
      [`page[${current}]`]: 1,
      [`status[${current}]`]: 'loadmore',
      [`${current==0 ? 'sentences': 'recommends'}`]: []
    })
    if (current == 0) {
      this.getSentences()
    } else {
      this.getRecommends()
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let current = this.data.current
    let page = this.data.page[current]
    if (this.data.status[current] == 'loadmore') {
      this.setData({
        [`page[${current}]`]: page + 1
      })
      if (current == 0) {
        this.getSentences()
      } else {
        this.getRecommends()
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})