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
    detail: '',
    bottomListLeft: [{
      icon: 'read',
      text: '我的书架'
    }, {
      icon: 'post',
      text: '' // 反馈/编辑
    }],
    bottomList: [{
      text: '加入书架',
      funName: 'openBookshelf',
      background: ''
    }, {
      text: '写记录',
      funName: 'addRecord',
      background: '#e3e3e3',
    }],
    // 书单
    showChooseBookshelf: false,
    bookshelfs: [],
    bookshelfs_checkedId: '-1',
    endTime: '',
    read_time: '',
    // 句子 推文
    tabs: ['句子', '推文'],
    current: 0,
    sentences: [],
    recommends: [],
    height: `calc(100vh - ${app.globalData.navHeight}rpx - 100rpx - 160rpx - ${app.globalData.isIphoneX?'0rpx' : '68rpx'})`
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
    // 更改底部组件配置
    let data1 = `bottomList[0].background`
    let data2 = `bottomListLeft[1].text`
    this.setData({
      [data1]: this.data.background,
      [data2]: this.data.user_info && this.data.user_info.role == 1 ? '编辑' : '反馈'
    })
    let {
      id,
      sentence_id,
      recommend_id,
    } = options
    this.setData({
      id
    })
    let data = {
      id,
      sentence_id,
      recommend_id,
    }
    this.getDetail(data)
    this.setData({
      endTime: utilTime.dateStrToFormat(new Date())
    })
  },
  onShow() {
    this.getSentences()
    this.getRecommends()
    this.getDetail({
      id: this.data.id
    })
  },
  async getDetail(data) {
    const res = await request('/getBook_detail', data, true)
    res.data.label_names = res.data.label_names != null ? res.data.label_names.split(',') : [];
    res.data.images = res.data.images != null ? res.data.images.split(',') : [];
    res.data.derive_names = res.data.derive_names != null ? res.data.derive_names.split(',') : [];
    this.setData({
      detail: res.data,
    })
    this.getHeight()
  },
  // 获取用户书单
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
  // 打开书单弹窗
  openBookshelf() {
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
        utilShow.showMyMsg('该书单已存在此书')
        return
      }
    }
    const res = await request('/bookshelfs_addBook', {
      user_id: _this.data.user_info.id,
      book_id: _this.data.id,
      read_time: checked_index == 0 ? _this.data.read_time : '',
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
  // 去记录
  addRecord(e) {
    
    let _this = this
    let {
      type
    } = e.currentTarget.dataset
    app.handleIsLogin(function () {
      if(_this.data.user_info.role != 1) {
        utilShow.showMyMsg('暂未开放')
        return
      }
      utilRoute.navigate('/pages/book/book_addRecord/book_addRecord', {
        id: _this.data.id,
        name: _this.data.detail.name,
        type: type ? type : _this.data.current == 0 ? 'sentence' : 'recommend'
      })
    })
  },

  // 推文 句子
  changeTab(e) {
    let current = e.currentTarget.dataset.index
    this.setData({
      current
    })
  },
  changeSwiper(e) {
    let current = e.detail.current
    this.setData({
      current
    })
  },
  getHeight() {
    let _this = this;
    var query = wx.createSelectorQuery();
    query.select(`.headTabs`).boundingClientRect(function (rect) {
      let num = (rect.height).toFixed(0)
      _this.setData({
        height: `calc(100vh - ${num}px - ${app.globalData.navHeight}rpx - 160rpx - ${app.globalData.isIphoneX?'0rpx' : '68rpx'})`
      })
    }).exec();
  },

  async getRecommends() {
    let _this = this
    const res = await request('/getBook_Recommends', {
      id: _this.data.id
    },true)
    let recommends = res.data
    this.setData({
      recommends
    })
  },

  async getSentences() {
    let _this = this
    const res = await request('/getBook_Sentences', {
      id: _this.data.id
    }, true)
    let sentences = res.data.map(it => {
      return {
        ...it,
        label_names: it.label_names != null ? it.label_names.split(',') : []
      }
    })
    this.setData({
      sentences
    })
  },

  submitBarTap(e) {
    let _this = this
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
    } else if (text == '反馈') {
      app.handleIsLogin(function () {
        utilRoute.navigate('/pages/user/suggestions/suggestions', {
          id: _this.data.detail.id,
          name: _this.data.detail.name
        })
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