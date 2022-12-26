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
    user_info:'',
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

  // 获取我的书架
  async getBookshelfs() {
    let _this = this
    const res = await request('/getUser_bookshelfs_index', {
      user_id: _this.data.user_info.id
    }, true)
    let _data = res.data.map(it => {
      let imagesStr = it.images ? it.images : ''
      return {
        ...it,
        images: imagesStr.substr(imagesStr.indexOf('h'), imagesStr.indexOf('.j') == -1 ? imagesStr.indexOf('.p') : imagesStr.indexOf('.j') + 4)
      }
    })
    this.setData({
      bookshelfs: _this.groupList(_data)
    })
  },
  // 数组合并相同项函数
  groupList(arr) {
    var beforeData = arr;
    let tempArr = [];
    let afterData = [];
    for (let i = 0; i < beforeData.length; i++) {
      if (tempArr.indexOf(beforeData[i].id) === -1) {
        afterData.push({
          id: beforeData[i].id,
          name: beforeData[i].name,
          child: beforeData[i].book_id ? [beforeData[i]] : [] // 过滤掉空
        });
        tempArr.push(beforeData[i].id);
      } else {
        for (let j = 0; j < afterData.length; j++) {
          if (afterData[j].id == beforeData[i].id) {
            afterData[j].child.push(beforeData[i]);
            break;
          }
        }
      }
    }
    return afterData
  },

  goDetail(e) {
    utilRoute.navigate('/pages/book/book_detail/book_detail', {
      id: e.currentTarget.dataset.id
    })
  },

  // 新增书单
  async addBookshelf() {
    let _this = this
    const res = await request('/add_bookshelf', {
      user_id: _this.data.user_info.id,
      name: '测试书单2'
    })
    if (res.code == 200) {
      utilShow.showMyMsg('新增书单成功')
      _this.getBookshelfs()
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})