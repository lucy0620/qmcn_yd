const app = getApp()
import * as utilRoute from "../../utils/route"
import * as utilStorage from "../../utils/storage"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    background: '',
    navbarData: {
      type: 1,
      return: false,
      home: false,
      title: '爱好园'
    },
    // cateList: [{
    //   name: '入坑必看'
    // }, {
    //   name: '新文速递'
    // }, {
    //   name: '冷门佳作',
    // }, {
    //   name: '精品广播剧'
    // }, {
    //   name: '清冷受'
    // }, {
    //   name: '禁欲攻'
    // }],
    cateList: [{
      name: '逆水暖暖',
      child: [{
        title: '捏脸',
        desc: '各职业体型 宝宝捏脸',
        path: '/'
      }, {
        title: '衣服',
        desc: '',
        path: '/'
      }, {
        title: '发型'
      }, {
        title: '坐骑'
      }, {
        title: '庄园'
      }, {
        title: '捏图'
      }, {
        title: '映画'
      }]
    }, {
      name: '无期徒刑',
      child: [{
        title: '诫典',
        desc: '',
        path: '/'
      }, {
        title: '共享',
        desc: '',
        path: '/'
      }]
    }, {
      name: '花果山捞月',
      child: [{
        title: '花昭录',
        desc: '',
        path: '/'
      }, {
        title: '共享',
        desc: '',
        path: '/'
      }]
    }, {
      name: '灵猫传',
      child: [{
        title: '花箴',
        desc: '尚京四美',
        path: '/'
      }, {
        title: '共享',
        desc: '我在古代当店长',
        path: '/'
      }]
    }, {
      name: '三国杀',
      child: [{
        title: '天牢',
        desc: '有空来坐坐',
        path: '/'
      }]
    }, {
      name: '食之契约',
      child: [{
        title: '食谱',
        desc: '飨灵录',
        path: '/'
      }, {
        title: '共享',
        desc: '',
        path: '/'
      }]
    }, {
      name: '食物语'
    }, {
      name: '忘川风华录'
    }, {
      name: '芋泥'
    }],
    active: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  changeCate(e) {
    console.log(e.detail)
    this.setData({
      active: e.detail.active
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
    this.setData({
      background: utilStorage.getKey('background') ? utilStorage.getKey('background') : app.globalData.background,
    })
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
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})