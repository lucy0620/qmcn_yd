// components/common/zBox/index.js
Component({

  /**
   * 使用全局样式
   */
  options: {
    addGlobalClass: true
  },

  /**
   * 组件的属性列表
   */
  properties: {
    // 标题
    title: {
      type: String,
      value: null
    },
    // 标题的字体大小
    titleSize:{
      type: String,
      value: ''
    },
    // 标题和跳转标题的字体颜色
    color: {
      type: String,
      value: ''
    },
    // 背景颜色
    background: {
      type: String,
      value: '#fff'
    },
    // 自定义class
    customClass: {
      type: String,
      value: ''
    },
    // 跳转标题
    skipText: {
      type: String,
      value: null
    },
    // 跳转链接
    url: {
      type: String,
      value: null
    },
    // 内容部分是否使用弹性布局flex
    flex: {
      type: Boolean,
      value: false
    },
    // 是否加边距
    margin: {
      type: Boolean,
      value: true
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
    toUrl(e){
      let url = e.currentTarget.dataset.url;
      let name = e.currentTarget.dataset.name;
      this.triggerEvent('toUrl', {
        url,
        name
      })
    },
  }
})