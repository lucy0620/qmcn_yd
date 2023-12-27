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
    isIphoneX: app.globalData.isIphoneX,
    background: '',
    user_info: '',
    navbarData: {
      type: 1,
      return: true,
      home: true,
      title: '逆水寒捏脸'
    },
    height: '',
    faces: [],
    page: 1,
    count: 8,
    status: 'loadmore',
    types: [],
    // sorts: ['热度最高', '收藏最多'],
    sorts: ['热度最高'],
    active: [-1, -1], //选中的下标
    scrollTop: 0,
    triggered: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getTypes()
    this.getFaces()
    this.setData({
      user_info: utilStorage.getKey('user_info')
    })
  },

  getHeight() {
    let _this = this;
    var query = wx.createSelectorQuery();
    query.select(`.filter_wrap`).boundingClientRect(function (rect) {
      let num = (rect.height).toFixed(0)
      _this.setData({
        height: `calc(100vh - ${app.globalData.navHeight}rpx - ${num}px)`
      })
    }).exec();
  },

  /* 
    说明：
    点击重置/下拉 重置所有筛选结果 
  */
  onReset() {
    this.setData({
      active: ['-1', '-1'],
    })
    this.onClear()
  },

  /* 
    说明：
    进行任意筛选条件 只重置分页以及之前的搜索结果
  */
  onClear() {
    // wx.pageScrollTo({
    //   scrollTop: 0
    // });
    this.setData({
      scrollTop: 0
    })
    this.setData({
      page: 1,
      status: 'loadmore',
      faces: []
    })
    this.getFaces()
  },

  filterTap(e) {
    let {
      index,
      prop
    } = e.currentTarget.dataset
    let _index = ''
    if (prop == 'type') {
      _index = 0
    } else if (prop == 'sort') {
      _index = 1
    }
    let _arr = `active[${_index}]`
    this.setData({
      [_arr]: index,
    })
    this.onClear()
  },
  async getTypes() {
    let res = await request('/get_nshFace_type')
    let types = res.data
    this.setData({
      types
    })
    this.getHeight()
  },

  async getFaces() {
    let status = this.data.status
    let data = {
      page: this.data.page,
      count: this.data.count,
      type_id: -1,
      type_id: this.data.active[0] == -1 ? '-1' : this.data.types[this.data.active[0]].type_id,
      sort: this.data.active[1] == -1 ? '' : this.data.active[1] + 1
    }
    let res = await request('/get_nshFace', data)
    if (res.data.length < this.data.count) {
      status = 'nomore'
    } else {
      status = 'loadmore'
    }
    let dataYet = res.data.map(it => {
      return {
        ...it,
        images: it.images != null ? it.images.split(',') : []
      }
    })
    this.setData({
      faces: [...this.data.faces, ...dataYet],
    })
    if (this.data.faces.length == 0) {
      status = 'empty'
    }
    this.setData({
      status
    })
    this.setData({
      triggered: false,
    })
  },

  add() {
    app.handleIsLogin(() => {
      utilRoute.navigate('/pages/market/nsh/face/addFace', {
        type: 'add'
      })
    })

  },

  handleCopy(e) {
    let _this = this
    wx.setClipboardData({
      data: `${e.target.dataset.data}`,
      success: function (res) {
        utilShow.hideMyLoading() // 隐藏自带的提示
        _this.add_nshFace_like(e.target.dataset.id)
      }
    })
  },

  async add_nshFace_like(id) {
    let res = await request('/add_nshFace_like', {
      id
    }, true)
    utilShow.showMyMsg('已复制到粘贴板')
  },

  edit(e) {
    let id = e.target.dataset.id
    utilRoute.navigate('/pages/market/nsh/face/addFace', {
      id,
      type: 'edit'
    })
  },

  delete(e) {
    let _this = this
    let id = e.target.dataset.id
    utilShow.showMyModal('确认删除此捏脸?', '', true, () => {
      _this.deleteRequest(id)
    })

  },

  async deleteRequest(id) {
    let res = await request('/del_nshFace', {
      id
    })
    if (res.code == 200) {
      utilShow.showMyMsg('删除成功')
      setTimeout(() => {
        this.onReset()
      }, 1500)
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
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.status == 'loadmore') {
      this.setData({
        page: this.data.page + 1
      })
      this.getFaces()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})