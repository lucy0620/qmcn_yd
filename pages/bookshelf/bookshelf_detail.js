// pages/bookshelf/bookshelf_detail.js
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
      title: '',
      return: true,
      home: true
    },
    user_info: '',
    books: [],
    id: '', // 书单id
    name: '', // 书单名
    canEdit: '',
    type: 'list'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      user_info: utilStorage.getKey('user_info'),
      id: options.id,
      name: options.name,
      canEdit: options.canEdit,
    })
    this.getBooks()
  },

  // 删除书单
  delete() {
    let _this = this
    utilShow.showMyModal('确认删除此书单?', '', true, () => {
      _this.deleteRequest()
    })
  },
  async deleteRequest() {
    let _this = this
    const res = await request('/bookshelf_del', {
      user_id: _this.data.user_info.id,
      id: _this.data.id,
    })
    if (res.code == 200) {
      utilShow.showMyMsg('删除成功')
      setTimeout(() => {
        utilRoute.back()
      }, 1000)
    }
  },
  // 改书单名字
  async edit() {
    let _this = this
    wx.showModal({
      title: '请输入新书单名',
      editable: true,
      success: async (res) => {
        if (res.confirm) {
          if (res.content) {
            if (res.content.length > 10) {
              utilShow.showMyMsg('书单名称不能大于10个字')
              return
            }
            if (res.content == _this.data.name) {
              return
            }
            const _res = await request('/bookshelf_edit', {
              user_id: _this.data.user_info.id,
              name: res.content,
              id: _this.data.id,
            })
            if (_res.code == 200) {
              utilShow.showMyMsg('已修改')
              _this.setData({
                name: res.content
              })
            }
          }
        }
      },
    })
  },
  // 切换浏览模式
  async changeType() {
    let _this = this
    this.setData({
      type: _this.data.type == 'list' ? 'photo' : 'list'
    })
  },

  // 删除书籍
  async delBook(e) {
    let _this = this
    const res = await request('/bookshelf_delBook', {
      user_id: _this.data.user_info.id,
      record_id: e.detail.record_id,
    })
    if (res.code == 200) {
      utilShow.showMyMsg('成功移除')
      setTimeout(() => {
        _this.getBooks()
      }, 1000)
    }
  },

  async getBooks() {
    let _this = this
    const res = await request('/getUser_bookshelf_detail', {
      user_id: _this.data.user_info.id,
      id: _this.data.id,
      sort: _this.data.canEdit == 'false' ? 1 : 0
    })
    let _data = res.data.map(it => {
      let imagesStr = it.images ? it.images : ''
      return {
        ...it,
        images: imagesStr.substr(imagesStr.indexOf('h'), imagesStr.indexOf('.j') == -1 ? imagesStr.indexOf('.p') : imagesStr.indexOf('.j') + 4)
      }
    })
    this.setData({
      books: _data
    })
  },

  goDetail(e) {
    utilRoute.navigate('/pages/book/book_detail/book_detail', {
      id: e.currentTarget.dataset.id
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