const app = getApp()
import * as utilRoute from "../../utils/route"
import * as utilStorage from "../../utils/storage"
import * as utilShow from "../../utils/show"

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
        path: '/pages/market/nsh/face/face'
      }, {
        title: '衣服',
        desc: '时装查看 配色分享',
        path: '/'
      }, {
        title: '发型',
        desc: '',
        path: '/'
      }, {
        title: '坐骑'
      }, {
        title: '庄园',
        desc: '主题分享',
        path: '/'

      }, {
        title: '捏图',
        desc: '',
        path: '/'

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
        desc: 'MBCC欢迎你',
        path: '/'
      }]
    }, {
      name: '花果山捞月',
      child: [{
        title: '花诏录',
        desc: '',
        path: '/'
      }, {
        title: '共享',
        desc: '明雍学院报到处',
        path: '/'
      }]
    }, {
      name: '灵猫传',
      child: [{
        title: '花笺',
        desc: '尚京F4',
        path: '/'
      }, {
        title: '共享',
        desc: '云绣纺搬砖日志',
        path: '/'
      }]
    }, {
      name: '三国杀',
      child: [{
        title: '点将台',
        desc: '',
        path: '/'
      }, {
        title: '共享',
        desc: '进来坐牢',
        path: '/'
      }]
    }, {
      name: '食物语',
      child: [{
        title: '食魂谱',
        desc: '',
        path: '/'
      }, {
        title: '共享',
        desc: '空桑少主历险记',
        path: '/'
      }]
    }, {
      name: '食之契约',
      child: [{
        title: '飨灵百科',
        desc: '',
        path: '/'
      }, {
        title: '共享',
        desc: '御侍爆肝实录',
        path: '/'
      }]
    }, {
      name: '忘川风华录',
      child: [{
        title: '名士谱',
        desc: '',
        path: '/'
      }, {
        title: '共享',
        desc: '',
        path: '/'
      }]
    }, {
      name: '遇见逆水寒',
      child: [{
        title: '花笺',
        desc: '',
        path: '/'
      }, {
        title: '共享',
        desc: '我在大宋捡破烂',
        path: '/'
      }]
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

  onItem(e) {
    let path = e.currentTarget.dataset.url
    if (path == '/') {
      utilShow.showMyMsg('暂未开放')
    } else {
      utilRoute.navigate(path)
    }
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