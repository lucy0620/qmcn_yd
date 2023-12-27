// pages/market/nsh/face/addFace.js
const app = getApp();
import {
  request
} from '../../../../utils/request'
import * as utilRoute from "../../../../utils/route"
import * as utilShow from "../../../../utils/show"
import * as utilStorage from "../../../../utils/storage"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    app,
    navbarData: {
      type: 1,
      title: '新增捏脸',
      return: true,
      home: true
    },
    background: '',
    user_info:'',
    type: 'add',
    types: [],
    detail: {
      images: [],
      data: '',
      type_id: '',
      type_name: ''
    },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      background: utilStorage.getKey('background') ? utilStorage.getKey('background') : app.globalData.background,
      user_info: utilStorage.getKey('user_info'),
    })
    let {
      type
    } = options
    this.setData({
      type
    })
    if (type == 'edit') {
      this.getDetail(options.id)
      this.setData({
        'navbarData.title': '编辑捏脸'
      })
    }
    this.getTypes()
  },

  async getDetail(id) {
    let res = await request('/get_nshFace_detail', {
      id
    })
    let detail = res.data;
    detail.images = res.data.images ? res.data.images.split(',') : []
    this.setData({
      detail
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

  },

  async getTypes() {
    let res = await request('/get_nshFace_type')
    let types = res.data.map(it => {
      return it.type_name
    })
    this.setData({
      types
    })
  },

  chooseType: function (e) {
    this.setData({
      [`detail.type_id`]: parseInt(e.detail.value) + 1,
      [`detail.type_name`]: this.data.types[e.detail.value],
    })
  },

  editValue(e) {
    let prop = e.currentTarget.dataset.prop
    let value = e.detail;
    this.setData({
      [`detail.${prop}`]:  prop == 'data' ? value.value : value
    })
  },

  async handleOperation(e) {
    if (e.detail) {
      if (!this.data.detail.name) {
        utilShow.showMyMsg('请输入捏脸名称')
        return
      }
      if (!this.data.detail.type_id) {
        utilShow.showMyMsg('请选择捏脸类型')
        return
      }
      this.data.detail.images = this.data.detail.images.join(',')
      if (!this.data.detail.images) {
        utilShow.showMyMsg('请上传图片')
        return
      }
      if (!this.data.detail.data) {
        utilShow.showMyMsg('请输入数据文本')
        return
      }
      this.data.detail.user_id = this.data.user_info.id
      let data = this.data.detail
      let url = this.data.type == 'add' ? '/add_nshFace' : '/edit_nshFace'
      let res = await request(url, data)
      if (res.code == 200) {
        utilShow.showMyMsg(this.data.type == 'add' ? '新增成功' : '编辑成功')
        setTimeout(() => {
          utilRoute.back()
        }, 1500)
      }
    } else {
      utilRoute.back()
    }
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