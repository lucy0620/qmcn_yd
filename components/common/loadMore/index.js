// components/common/loadMore/index.js
Component({
  /**
   * 使用全局样式
   */
  options: {
    addGlobalClass: true
  },
  lifetimes: {
    attached: function() {
    },
  },
  /**
   * 组件的属性列表
   */
  properties: {
    //加载状态 nomore loading loadmore empty
    status: {
      type: String,
      value: '',
      observer(v){
        // console.log('obs',v)
      }
    },
    // empty图片类型
    type:{
      type: String,
      value: 'error'
    },
    // empty文字提示
    descriptionValue:{
      type: String,
      value: '暂无数据'
    },
    iphoneX: {
      type: Boolean,
      value: false
    },

    // 其他状态文字提示 哼😕~我也是有底线的哈！~
    nomoreText: {
      type: String,
      value: '没有更多了'
    },
    loadingText: {
      type: String,
      value: '正在加载中'
    },
    loadmoreText: {
      type: String,
      value: '下拉加载更多'
    },
    // 组件背景色
    bgColor: {
      type: String,
      value: 'transparent'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
