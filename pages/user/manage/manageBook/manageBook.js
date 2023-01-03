// pages/user/manage/manageBook/manageBook.js
const app = getApp();
import {
  request
} from '../../../../utils/request'
import * as utilRoute from "../../../../utils/route"
import * as utilStorage from "../../../../utils/storage"
import * as utilShow from "../../../../utils/show"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    app,
    navbarData: {
      type: 1,
      title: '书籍管理',
      return: true,
      home: true
    },
    background: '',
    books: [],
    page: 1,
    count: 15,
    keyword: '',
    status: 'loadmore'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getBooks()
    this.setData({
      background: utilStorage.getKey('background') ? utilStorage.getKey('background') : app.globalData.background,
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

  },
  onClear() {
    this.setData({
      keyword: '',
      page: 1,
      status: 'loadmore',
      books: []
    })
    this.getBooks()
  },
  onSearch(e) {
    this.setData({
      keyword: e.detail,
      page: 1,
      status: 'loadmore',
      books: []
    })
    this.getBooks()
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

  edit(e) {
    let id = e.currentTarget.dataset.id
    utilRoute.navigate('/pages/user/manage/manageBook/editBook', {
      id,
      type: 'edit'
    })
  },

  add() {
    utilRoute.navigate('/pages/user/manage/manageBook/editBook', {
      type: 'add'
    })
  },


  del(e) {
    let id = e.currentTarget.dataset.id
    let _this = this
    utilShow.showMyModal('确认删除此书?', '', true, () => {
      _this.deleteRequest(id)
    })
  },
  async deleteRequest(id) {
    const res = await request('/del_book', {
      id
    })
    if (res.code == 200) {
      utilShow.showMyMsg('已删除')
      this.onClear()
    }
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
    this.onClear();
  },

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
  onShareAppMessage() {

  }
})