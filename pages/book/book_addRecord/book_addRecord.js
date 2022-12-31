// pages/book/book_addRecord/book_addRecord.js
const app = getApp();
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
      title: '添加记录',
      return: true,
      home: true
    },
    background: '',
    user_info: '',
    id: '',
    name: '',
    type: 'recommend', // 推文recommend 句子sentence
    title: '',
    content: '',
    sentence_labels: [{
      title: '情话',
      checked: false
    }, {
      title: '刀',
      checked: false
    }, {
      title: '糖',
      checked: true
    }], //句子标签
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let {
      id,
      name,
      type
    } = options

    this.setData({
      id,
      name,
      type
    })

    this.getSentenceLabels()
  },

  editType(e) {
    this.setData({
      type: e.detail
    })
  },

  editValue(e) {
    let prop = e.currentTarget.dataset.prop
    this.setData({
      [prop]: prop == 'title' ? e.detail : e.detail.value
    })
  },
  async getSentenceLabels() {
    let res = await request('/get_SentenceLabels')
    let sentence_labels = res.data.map(it => {
      return {
        ...it,
        check: false
      }
    })
    this.setData({
      sentence_labels
    })
  },

  editLabel(e) {
    let {
      index,
    } = e.currentTarget.dataset
    let status = this.data.sentence_labels[index].checked
    let prop = `sentence_labels[${index}].checked`
    this.setData({
      [prop]: !status
    })
  },

  async handleOperation(e) {
    let {
      type,
      content,
      title,
      id,
      user_info,
    } = this.data
    let data = {
      user_id: user_info.id,
      id,
      content
    }
    if (e.detail) {
      if (type == 'recommend') {
        if (!title) {
          utilShow.showMyMsg('请输入标题')
          return
        }
        data = {
          ...data,
          title
        }
      }
      if (!content) {
        utilShow.showMyMsg('请输入' + (type == 'recommend' ? '内容' : '句子'))
        return
      }
      if (type == 'sentence') {
        let temp = []
        let label_ids = ''
        this.data.sentence_labels.forEach(it => {
          if (it.checked) {
            temp.push(it.label_id)
          }
        })
        label_ids = temp.join(',')
        if (!label_ids) {
          utilShow.showMyMsg('请选择句子标签')
          return
        }
        data = {
          ...data,
          label_ids
        }
      }
      let url = type == 'recommend' ? '/book_add_recommend' : '/book_add_sentence'
      let res = await request(url, data)
      if (res.code == 200) {
        utilShow.showMyMsg(type == 'recommend' ? '新增推文成功' : '新增句子成功')
        setTimeout(() => {
          utilRoute.back()
        }, 1500)
      }
    } else {
      utilRoute.back()
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