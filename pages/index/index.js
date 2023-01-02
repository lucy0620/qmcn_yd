const app = getApp();
import {
  request
} from '../../utils/request'
import * as utilRoute from "../../utils/route"
import * as utilStorage from "../../utils/storage"

Page({
  data: {
    app,
    isIphoneX: app.globalData.isIphoneX,
    navbarData: {
      type: 2,
      search: {
        placeholder: '输入书名,作者,cv姓名',
        disabled: true,
        path: app.globalData.searchUrl
      }
    },
    background: '',
    user_info: '',
    newbooks: [],
    bookshelfs: []
  },

  onLoad() {
    this.getNewbooks()
  },

  onShow() {
    this.setData({
      user_info: utilStorage.getKey('user_info'),
      background: utilStorage.getKey('background') ? utilStorage.getKey('background') : app.globalData.background,
    })
    wx.setBackgroundColor({
      backgroundColor: this.data.background
    })
    this.getBookshelfs()
  },

  onPullDownRefresh() {
    this.getBookshelfs()
    this.getNewbooks()
  },

  // 最新入库
  async getNewbooks() {
    let res = await request('/getBooks_new')
    res = res.data.map(it => {
      return {
        ...it,
        labels: it.label_names != null ? it.label_names.split(',') : [],
        images: it.images != null ? it.images.split(',') : []
      }
    })
    this.setData({
      newbooks: res
    })
  },

  goMore() {
    utilRoute.switchTo('/pages/book/book')
  },

  goDetail(e) {
    utilRoute.navigate('/pages/book/book_detail/book_detail', {
      id: e.currentTarget.dataset.id
    })
  },

  // 获取我的书架
  async getBookshelfs() {
    let _this = this

    if (!_this.data.user_info) {
      return
    }
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

  goBookshelf() {
    utilRoute.navigate('/pages/bookshelf/bookshelf')
  },

  onShareAppMessage: function (e) {
    let params = this.getParams('pages/dd/ss?ll=1&pp=2')
    console.log(params)
    return {
      path: '/pages/index/index?' + 'id=' + 1,
      title: "给你分享了叁仟院",
      desc: '找文推文/句子/心得记录',
      success: (ev) => {
        console.log(ev)
      }
    }
  },
  // 获取路径中的参数 todo
  getParams(urlq) {
    let theRequest = new Object()
    if (urlq.indexOf('?') != -1) {
      let str = urlq.substr(urlq.indexOf('?') + 1)
      let strs = str.split('&')
      for (let i = 0; i < strs.length; i++) {
        //unescape() 函数可对通过 escape() 编码的字符串进行解码
        theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
      }
    }
    return theRequest
  },
  // 获取当前页面 todo
  getPagePath() {
    let pages = getCurrentPages(); //获取加载的页面
    let currentPage = pages[pages.length - 1]; //获取当前页面的对象
    let url = currentPage.route; //当前页面url
    return url
  },
})