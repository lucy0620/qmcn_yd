// pages/user/manage/manageBook/editBook.js
const app = getApp();
import {
  request
} from '../../../../utils/request'
import * as utilRoute from "../../../../utils/route"
import * as utilTime from "../../../../utils/time"
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
      title: '编辑',
      return: true,
      home: true
    },
    background: '',
    type: '',
    detail: {
      images: []
    },
    publish_websites: ['晋江', '长佩', '海棠', '废文', '爱奇艺','微博','其他'],
    publish_Index: 0,
    endTime: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let {
      type
    } = options
    this.setData({
      type
    })
    if (type == 'edit') {
      this.getDetail(options.id)
    } else {
      this.setData({
        'navbarData.title': '添加'
      })
    }

    this.setData({
      endTime: utilTime.getYearMonth(new Date())
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
    })
  },

  bindPickerChange(e) {
    let index = e.detail.value
    let publish_website = this.data.publish_websites[index]
    this.setData({
      'detail.publish_website': publish_website
    })
  },

  bindPickerChangeTime(e) {
    let time = e.detail.value
    this.setData({
      'detail.publish_time': time
    })
  },

  async getDetail(id) {
    let res = await request('/getBook_detail', {
      id
    })
    let detail = res.data;
    detail.images = res.data.images ? res.data.images.split(',') : []
    this.setData({
      detail
    })
  },

  chooseType() {
    utilRoute.navigate('/pages/user/manage/manageType/manageType')
  },

  chooseLabels() {
    let obj = {
      type: 'edit',
      label_ids: this.data.detail.label_ids ? this.data.detail.label_ids : ''
    }
    utilRoute.navigate('/pages/user/manage/manageLabels/manageLabels', obj)
  },

  chooseDerives() {
    let obj = {
      derive_ids: this.data.detail.derive_ids ? this.data.detail.derive_ids : ''
    }
    utilRoute.navigate('/pages/user/manage/manageLabels/manageDerives', obj)
  },

  // 更改评分
  editRadio(e) {
    let prop = e.currentTarget.dataset.prop
    this.setData({
      [`detail.${prop}`]: e.detail
    })
  },

  editValue(e) {
    let prop = e.currentTarget.dataset.prop
    let value = e.detail;
    this.setData({
      [`detail.${prop}`]: value
    })
  },

  async handleOperation(e) {
    let _this = this
    if (e.detail) {
      if (!this.data.detail.name) {
        utilShow.showMyMsg('请输入书名')
        return
      }
      if (!this.data.detail.author) {
        utilShow.showMyMsg('请输入作者')
        return
      }
      if (!this.data.detail.type_id) {
        utilShow.showMyMsg('请选择类型')
        return
      }
      this.data.detail.images = this.data.detail.images.join(',')
      let data = this.data.detail
      let url = this.data.type == 'add' ? '/addBook' : '/editBook'
      
      let res = await request(url, data)
      if(res.code == 200) {
        utilShow.showMyMsg(this.data.type == 'add' ? '新增成功' : '编辑成功')
        setTimeout(()=>{
          utilRoute.back()
        },1500)
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})