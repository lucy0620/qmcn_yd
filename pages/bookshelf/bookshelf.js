// pages/bookshelf/bookshelf.js
const app = getApp();
import {
  request
} from '../../utils/request'
import * as utilRoute from "../../utils/route"
import * as utilStorage from "../../utils/storage"
import * as utilShow from "../../utils/show"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    app,
    isIphoneX: app.globalData.isIphoneX,
    background: '',
    user_info: '',
    navbarData: {
      type: 1,
      title: '我的书架',
      return: true,
      home: true
    },
    user_info: '',
    bookshelfs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      user_info: utilStorage.getKey('user_info'),
    })
    this.getBookshelfs()
  },

  // 获取我的书单
  async getBookshelfs() {
    let _this = this
    const res = await request('/getUser_bookshelfs', {
      user_id: _this.data.user_info.id
    }, true)
    let bookshelfs = res.data.map(it => {
      let book_ids = it.book_ids ? it.book_ids.split(',') : ''
      return {
        ...it,
        book_ids
      }
    })
    this.setData({
      bookshelfs
    })
  },

  // 新增书单
  async addBookshelf() {
    wx.showModal({
      title: '请输入书单名',
      editable: true,
      success: async (res) => {
        if (res.confirm) {
          if (res.content) {
            if (res.content.length > 10) {
              utilShow.showMyMsg('书单名称不能大于10个字')
              return
            }
            let _this = this
            const _res = await request('/add_bookshelf', {
              user_id: _this.data.user_info.id,
              name: res.content
            })
            if (_res.code == 200) {
              utilShow.showMyMsg('新增书单成功')
              setTimeout(() => {
                _this.getBookshelfs()
              }, 1000)
            }
          }
        }
      },
    })
  },

  goBookshelf_detail(e) {
    utilRoute.navigate('/pages/bookshelf/bookshelf_detail', {
      id: e.currentTarget.dataset.item.id,
      name: e.currentTarget.dataset.item.name,
      canEdit: e.currentTarget.dataset.index == 0 ? false : true
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
      user_info: utilStorage.getKey('user_info'),
    })
    this.getBookshelfs()
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
})