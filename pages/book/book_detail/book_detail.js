// pages/book/book_detail/book_detail.js
const app = getApp()
import {
  request
} from '../../../utils/request'
import * as utilShow from '../../../utils/show'
import * as utilRoute from '../../../utils/route'
import * as utilStorage from '../../../utils/storage'
import * as utilTime from "../../../utils/time"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    app,
    navbarData: {
      type: 1,
      title: '',
      return: true,
      home: true
    },
    user_info: '',
    background: '',
    id: '',
    detail: {},
    bottomListLeft: [{
      icon: 'read',
      text: '我的书架'
    }, {
      icon: 'post',
      text: ''
    }],
    bottomList: [{
      text: '加入书架',
      funName: 'addBookshelf',
      background: ''
    }, {
      text: '写记录',
      funName: 'addBookshelf',
      background: '#e3e3e3'
    }],
    showChooseBookshelf: false,
    bookshelfs: [],
    bookshelfs_checkedId: '-1',
    endTime: '',
    read_time: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      id: options.id
    })
    this.getDetail(options.id)
    this.setData({
      endTime: utilTime.dateStrToFormat(new Date())
    })
  },
  onShow() {
    let _this = this
    this.setData({
      background: utilStorage.getKey('background') ? utilStorage.getKey('background') : app.globalData.background,
      user_info: utilStorage.getKey('user_info'),
    })
    // 更改底部组件配置
    let data = `bottomList[0].background`
    let data2 = `bottomListLeft[1].text`
    this.setData({
      [data]: _this.data.background,
      [data2]: _this.data.user_info && _this.data.user_info.role == 1 ? '编辑' : '反馈'
    })
  },
  async getDetail(id) {
    const res = await request('/getBook_detail', {
      id
    })
    res.data.label_names = res.data.label_names != null ? res.data.label_names.split(',') : [];
    res.data.images = res.data.images != null ? res.data.images.split(',') : [];
    res.data.derive_names = res.data.derive_names != null ? res.data.derive_names.split(',') : [];
    this.setData({
      detail: res.data,
    })
  },
  async getBookshelfs() {
    let _this = this
    const res = await request('/getUser_bookshelfs', {
      user_id: _this.data.user_info.id
    })
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
  // 打开书单弹窗
  addBookshelf() {
    let _this = this
    app.handleIsLogin(function () {
      _this.getBookshelfs()
      _this.setData({
        showChooseBookshelf: true
      })
    })
  },
  // 选择书架
  chooseBookshelf(e) {
    this.setData({
      bookshelfs_checkedId: e.detail
    })
  },
  // 选择日期
  bindPickerChangeTime(e) {
    let time = e.detail.value
    this.setData({
      'read_time': time
    })
  },
  // 确认选择书架
  async confirmBookshelf() {
    let _this = this
    let bookshelfs = this.data.bookshelfs
    let bookshelfs_checkedId = this.data.bookshelfs_checkedId
    if (bookshelfs_checkedId == '-1') {
      return
    }
    let checked_index = bookshelfs.findIndex(item =>
      item.id == bookshelfs_checkedId)
    // 若为默认书单需要选择日期，否则清空日期
    if (checked_index == 0) {
      if (!this.data.read_time) {
        utilShow.showMyMsg('请选择阅读日期')
        return
      }
    } else {
      _this.setData({
        read_time: ''
      })
    }
    // 判断是否已存在
    if (bookshelfs[checked_index].book_ids) {
      let _index = bookshelfs[checked_index].book_ids.findIndex(item =>
        item == _this.data.id)
      if (_index != -1) {
        utilShow.showMyMsg('该书架已存在此书')
        return
      }
    }
    const res = await request('/bookshelfs_addBook', {
      user_id: _this.data.user_info.id,
      book_id: _this.data.id,
      read_time: _this.data.read_time,
      id: bookshelfs_checkedId
    })
    if (res.code == 200) {
      _this.setData({
        showChooseBookshelf: false
      })
      utilShow.showMyMsg('加入书单成功')
      setTimeout(() => {
        _this.getBookshelfs()
      }, 1500)
    }
  },

  submitBarTap(e) {
    let text = e.currentTarget.dataset.text
    if (text == '编辑') {
      let id = this.data.id
      utilRoute.navigate('/pages/user/manage/manageBook/editBook', {
        id,
        type: 'edit'
      })
    } else if (text == '我的书架') {
      app.handleIsLogin(function () {
        utilRoute.navigate('/pages/bookshelf/bookshelf')
      })
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

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