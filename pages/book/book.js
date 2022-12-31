// pages/book/book.js
const app = getApp();
import {
  request
} from '../../utils/request'
import * as utilRoute from "../../utils/route"
import * as utilStorage from "../../utils/storage"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    app,
    isIphoneX: app.globalData.isIphoneX,
    background: '',
    navbarData: {
      type: 2,
      search: {
        placeholder: '输入书名,作者,cv姓名',
        disabled: false,
      }
    },
    books: [],
    page: 1,
    count: 20,
    status: 'loadmore',
    types: [],
    websites: [],
    labels: [],
    label_idsStr: '', //选中的字符串
    showLabels: false,
    sorts: ['热度最高', '收藏最多'],
    active: [-1, -1, -1], //选中的下标
    books_left: [],
    books_right: [],
    scrollTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getTypes()
    this.getWebsites()
    this.getLabels()
    this.getBooks()
  },

  onSearch(e) {
    if (!e.detail) {
      return
    }
    utilRoute.navigate(app.globalData.searchUrl, {
      keyWord: e.detail
    })
  },
  goDetail(e) {
    utilRoute.navigate('/pages/book/book_detail/book_detail', {
      id: e.currentTarget.dataset.id
    })
  },
  /* 
    说明：
    重置所有筛选结果 
  */
  onReset() {
    this.setData({
      active: ['-1', '-1', '-1'],
      label_idsStr: ''
    })
    let labels = this.data.labels
    labels.map(it => {
      it.child.filter(its => {
        if (its.checked) {
          its.checked = false
        }
      })
    })
    this.setData({
      labels
    })
    this.onClear()
  },
  /* 
    说明：
    进行任意筛选条件/下拉 只重置分页以及之前的搜索结果
    (新版页面改为禁止滚动以便适用于弹窗，下拉暂时关闭)
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
      books: []
    })
    this.getBooks()
  },
  filterTap(e) {
    let {
      index,
      prop
    } = e.currentTarget.dataset
    let _index = ''
    if (prop == 'type') {
      _index = 0
    } else if (prop == 'publish_website') {
      _index = 1
    } else if (prop == 'sort') {
      _index = 2
    }
    let _arr = `active[${_index}]`
    this.setData({
      [_arr]: index,
    })
    this.onClear()
  },
  async getTypes() {
    let res = await request('/getBook_type')
    let types = res.data
    this.setData({
      types
    })
  },
  async getWebsites() {
    let res = await request('/getBook_website')
    let websites = res.data
    this.setData({
      websites
    })
  },
  async getLabels() {
    let _this = this
    let res = await request('/getBook_label')
    let arr_after = res.data.map(it => {
      return {
        ...it,
        checked: false
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
  openLabels() {
    this.setData({
      showLabels: true
    })
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
  confirmLabels() {
    let label_ids = []
    this.data.labels.map(it => {
      it.child.filter(its => {
        if (its.checked) {
          label_ids.push(its.label_id)
        }
      })
    })
    let label_idsStr = label_ids.join(',')
    this.setData({
      label_idsStr,
      showLabels: false
    })
    this.onClear()
  },
  closeLabels() {
    this.setData({
      showLabels: false
    })
  },

  async getBooks() {
    let label_idsStr = this.data.label_idsStr
    let status = this.data.status
    let data = {
      page: this.data.page,
      count: this.data.count,
      type_id: this.data.active[0] == -1 ? -1 : this.data.types[this.data.active[0]].type_id,
      website_id: this.data.active[1] == -1 ? -1 : this.data.websites[this.data.active[1]].website_id,
      sort: this.data.active[2] == -1 ? '' : this.data.active[2] + 1,
      label_ids: label_idsStr
    }
    let res = await request('/getBooks_filter', data)
    if (res.data.length < this.data.count) {
      status = 'nomore'
    } else {
      status = 'loadmore'
    }
    let dataYet = res.data.map(it => {
      return {
        ...it,
        labels: it.label_names != null ? it.label_names.split(',') : [],
        images: it.images != null ? it.images.split(',') : []
      }
    })
    this.setData({
      books: [...this.data.books, ...dataYet],
    })
    if (this.data.books.length == 0) {
      status = 'empty'
    }
    this.setData({
      status
    })
    // 将books分为两组做瀑布流
    let left = []
    let leftImgCount = 0
    let rightImgCount = 0
    let right = []
    this.data.books.forEach((it, i) => {
      if (i % 2 == 0) {
        if (it.images[0]) {
          if (leftImgCount > rightImgCount) {
            right.push(it)
            rightImgCount++
          } else {
            left.push(it)
            leftImgCount++
          }
        } else {
          left.push(it)
        }
      } else {
        if (it.images[0]) {
          if (rightImgCount > leftImgCount) {
            left.push(it)
            leftImgCount++
          } else {
            right.push(it)
            rightImgCount++
          }
        } else {
          right.push(it)
        }
      }
    })
    this.setData({
      books_left: left,
      books_right: right,
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
   * (新版本页面改为禁止滚动以便适用于弹窗，下拉暂时关闭)
   */
  onPullDownRefresh() {
    this.onClear();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.status == 'loadmore') {
      this.setData({
        page: this.data.page + 1
      })
      this.getBooks()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})