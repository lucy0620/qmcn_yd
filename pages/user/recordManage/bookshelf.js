// pages/user/recordManage/bookshelf.js
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
      title: '读书轴',
      return: true,
      home: true
    },
    id: '',
    background: '',
    user_info: '',
    timeline: [],
    timeCount: 3, // 显示几个
    currentT: 0,
    status: 'loading'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      id: 4
    })
    this.setData({
      background: utilStorage.getKey('background') ? utilStorage.getKey('background') : app.globalData.background,
      user_info: utilStorage.getKey('user_info'),
    })
    this.getBookshelfTimeline()
  },

  goDetail(e) {
    utilRoute.navigate('/pages/book/book_detail/book_detail', {
      id: e.currentTarget.dataset.id
    })
  },

  changeSwiper(e) {
    let currentT = e.detail.current
    if (e.detail.current == this.data.timeline.length) {
      currentT = this.data.timeline.length - 1
    }
    this.setData({
      currentT,
    })
  },

  onTimeline(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      currentT: index
    })
  },

  async getBookshelfTimeline() {
    this.setData({
      status: 'loading'
    })
    const res = await request('/getUser_bookshelf_timeline', {
      id: this.data.id
    })
    let _data = res.data.map(it => {
      let child = it.child.map(v => {
        let images = v.images ? v.images : ''
        images = images.substr(images.indexOf('h'), images.indexOf('.j') == -1 ? images.indexOf('.p') : images.indexOf('.j') + 4)
        return {
          ...v,
          images
        }
      });
      return {
        ...it,
        child
      }
    })
    this.setData({
      timeline: _data,
      status: 'empty'
    })
  },

  // 删除
  delete(e) {
    let {
      id
    } = e.currentTarget.dataset
    let _this = this
    utilShow.showMyModal('确认删除此句子?', '', true, () => {
      _this.deleteRequest(id)
    })
  },
  async deleteRequest(id) {
    const res = await request('/del_sentence', {
      id
    })
    if (res.code == 200) {
      utilShow.showMyMsg('已删除')
      this.getBookshelfTimeline()
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


})