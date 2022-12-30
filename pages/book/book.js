// pages/book/book.js
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
    isIphoneX: app.globalData.isIphoneX,
    background: '',
    navbarData: {
      type: 2,
      search: {
        placeholder: '输入书名,作者,cv姓名',
        disabled: false,
      }
    },
    books: [],
    page: 1,
    count: 20,
    status: 'loadmore',
    types: [],
    websites: [],
    sorts: ['热度最高','收藏最多'],
    active: [-1, -1 ,-1],
    books_left: [],
    books_right: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getTypes()
    this.getWebsites()
    this.getBooks()
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
  onSearch(e) {
    if (!e.detail) {
      return
    }
    utilRoute.navigate(app.globalData.searchUrl, {
      keyWord: e.detail
    })
  },
  goDetail(e) {
    utilRoute.navigate('/pages/book/book_detail/book_detail', {
      id: e.currentTarget.dataset.id
    })
  },
  onClear() {
    wx.pageScrollTo({
      scrollTop: 0
    });
    this.setData({
      page: 1,
      status: 'loadmore',
      books: []
    })
    this.getBooks()
  },
  filterTap(e) {
    wx.pageScrollTo({
      scrollTop: 0
    });
    let {
      index,
      prop
    } = e.currentTarget.dataset
    let _index = ''
    if (prop == 'type') {
      _index = 0
    } else if (prop == 'publish_website') {
      _index = 1
    } else if (prop == 'sort') {
      _index = 2
    }
    let _arr = `active[${_index}]`
    this.setData({
      [_arr]: index,
    })
    this.onClear()
  },
  async getTypes() {
    let res = await request('/getBook_type')
    let types = res.data
    this.setData({
      types
    })
  },
  async getWebsites() {
    let res = await request('/getBook_website')
    let websites = res.data
    this.setData({
      websites
    })
  },
  async getBooks() {
    let status = this.data.status
    let data = {
      page: this.data.page,
      count: this.data.count,
      type_id: this.data.active[0] == -1 ? -1 : this.data.types[this.data.active[0]].type_id,
      website_id: this.data.active[1] == -1 ? -1 : this.data.websites[this.data.active[1]].website_id,
      sort: this.data.active[2] == -1 ? '' : this.data.active[2] + 1
    }
    let res = await request('/getBooks_filter', data)
    if (res.data.length < this.data.count) {
      status = 'nomore'
    } else {
      status = 'loadmore'
    }
    let dataYet = res.data.map(it => {
      return {
        ...it,
        labels: it.label_names != null ? it.label_names.split(',') : [],
        images: it.images != null ? it.images.split(',') : []
      }
    })
    this.setData({
      books: [...this.data.books, ...dataYet],
    })
    if (this.data.books.length == 0) {
      status = 'empty'
    }
    this.setData({
      status
    })
    // 将books分为两组做瀑布流
    let left = []
    let leftImgCount = 0
    let rightImgCount = 0
    let right = []
    this.data.books.forEach((it, i) => {
      if (i % 2 == 0) {
        if (it.images[0]) {
          if (leftImgCount > rightImgCount) {
            right.push(it)
            rightImgCount++
          } else {
            left.push(it)
            leftImgCount++
          }
        } else {
          left.push(it)
        }
      } else {
        if (it.images[0]) {
          if (rightImgCount > leftImgCount) {
            left.push(it)
            leftImgCount++
          } else {
            right.push(it)
            rightImgCount++
          }
        } else {
          right.push(it)
        }
      }
    })
    this.setData({
      books_left: left,
      books_right: right,
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