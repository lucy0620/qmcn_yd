// pages/user/manage/manageLabels/manageLabels.js
const app = getApp();
import {
  request
} from '../../../../utils/request'
import * as utilRoute from "../../../../utils/route"
import * as utilStorage from "../../../../utils/storage"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    app,
    navbarData: {
      type: 1,
      title: '书籍标签',
      return: true,
      home: true
    },
    background: '',
    type: '', // edit为编辑书籍模式
    labels: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let label_ids = []
    if (options.type && options.type == 'edit') {
      label_ids = options.label_ids ? options.label_ids.split(',') : []
      this.setData({
        type: 'edit'
      })
    }
    console.log(label_ids)
    this.getLabels(label_ids)
  },

  async getLabels(label_ids) {
    let _this = this
    let res = await request('/getBook_label')
    let arr_after = res.data.map(it => {
      if (label_ids.findIndex((v) => {
          return v == it.label_id
        }) == -1) {
        return {
          ...it,
          checked: false
        }
      } else {
        return {
          ...it,
          checked: true
        }
      }
    })
    let labels = _this.groupList(arr_after)
    this.setData({
      labels
    })
  },
  // 数组合并相同项函数
  groupList(arr) {
    var beforeData = arr;
    let tempArr = [];
    let afterData = [];
    for (let i = 0; i < beforeData.length; i++) {
      if (tempArr.indexOf(beforeData[i].label_type_id) === -1) {
        afterData.push({
          label_type_id: beforeData[i].label_type_id,
          label_type_name: beforeData[i].label_type_name,
          child: [beforeData[i]]
        });
        tempArr.push(beforeData[i].label_type_id);
      } else {
        for (let j = 0; j < afterData.length; j++) {
          if (afterData[j].label_type_id == beforeData[i].label_type_id) {
            afterData[j].child.push(beforeData[i]);
            break;
          }
        }
      }
    }
    return afterData
  },

  checkedItem(e) {
    let it = e.currentTarget.dataset.it
    let index = e.currentTarget.dataset.index
    let i = e.currentTarget.dataset.i
    let status = it.checked
    this.setData({
      [`labels[${index}].child[${i}].checked`]: !status
    })
  },

  handleOperation(e) {
    let _this = this
    if (e.detail) {
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2]; //上一页
      if (prevPage.route == 'pages/user/manage/manageBook/editBook') {

        let label_names = []
        let label_ids = []
        _this.data.labels.map(it => {
          it.child.filter(its => {
            if (its.checked) {
              label_names.push(its.label_name)
              label_ids.push(its.label_id)
            }
          })
        })

        prevPage.setData({
          'detail.label_names': label_names.join(','),
          'detail.label_ids': label_ids.join(','),
        })
        utilRoute.back()
      }
    } else {
      utilRoute.back()
    }
  },

  async moveType(e) {
    let type = e.currentTarget.dataset.type // 上移或者下移
    let index = e.currentTarget.dataset.index
    let i = e.currentTarget.dataset.i // 当前选中的下标
    let label_id = this.data.labels[index].child[i].label_id // 当前选中的id
    let length = this.data.labels[index].child.length
    let wei = 0
    if (type == 'up') {
      let topWei = this.data.labels[index].child[i - 1].weight
      if (i == 1) {
        wei = topWei - 1
      } else {
        let toptopWei = this.data.labels[index].child[i - 2].weight
        wei = toptopWei + (topWei - toptopWei) / 2
      }
    } else {
      let botWei = this.data.labels[index].child[i + 1].weight
      if (i == length - 2) {
        wei = botWei + 1
      } else {
        let botbotWei = this.data.labels[index].child[i + 2].weight
        wei = botWei + (botbotWei - botWei) / 2
      }
    }
    let res = await request('/move_label', {
      label_id,
      wei
    })
    if (res.code == 200) {
      this.getLabels([])
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