// pages/search/search.js
const app = getApp();
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
    navbarData: {
      type: 1,
      title: '搜索页',
      home: true,
      return: true
    },
    background: '',
    books: [],
    page: 1,
    count: 15,
    keyword: '',
    status: 'loadmore',
    keys: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      background: utilStorage.getKey('background') ? utilStorage.getKey('background') : app.globalData.background,
    })
    wx.setBackgroundColor({
      backgroundColor: this.data.background
    })
    let keys = utilStorage.getKey('search')
    keys = keys ? JSON.parse(keys) : []
    this.setData({
      keys
    })
    if (options.keyWord) {
      this.onSearch({
        detail: options.keyWord
      })
    }
  },
  goDetail(e) {
    utilRoute.navigate('/pages/book/book_detail/book_detail', {
      id: e.currentTarget.dataset.id
    })
  },
  clearHis() {
    this.setData({
      keys: []
    })
    utilStorage.removeKey('search')
  },
  searchHis(e) {
    let value = e.currentTarget.dataset.value
    this.onSearch({
      detail: value
    })
  },

  onClear() {
    this.setData({
      keyword: '',
      page: 1,
      status: 'loadmore',
      books: []
    })
  },
  onSearch(e) {
    this.setData({
      keyword: e.detail,
      page: 1,
      status: 'loadmore',
      books: []
    })
    this.getBooks()
    // 存搜索记录
    let keys = this.data.keys
    let _index = keys.findIndex(item =>
      item == e.detail)
    if (_index == -1) {
      keys.push(e.detail)
      this.setData({
        keys
      })
      utilStorage.setKey('search', JSON.stringify(keys))
    }
  },

  async getBooks() {
    let status = this.data.status
    let data = {
      page: this.data.page,
      count: this.data.count,
      keyword: this.data.keyword,
    }
    let res = await request('/getBooks', data)
    if (res.data.length < this.data.count) {
      status = 'nomore'
    } else {
      status = 'loadmore'
    }
    this.setData({
      books: [...this.data.books, ...res.data],
    })
    if (this.data.books.length == 0) {
      status = 'empty'
    }
    this.setData({
      status
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.status == 'loadmore') {
      this.setData({
        page: this.data.page + 1
      })
      this.getBooks()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})