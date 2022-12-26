// components/com/popup/popup.js
var app = getApp();

Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: '请选择'
    },
    funName: {
      type: String,
      value: ''
    },
    // 占窗口高度百分比
    height: {
      type: Number,
      value: 70
    },
    isEmpty: {
      type: Boolean,
      value: false
    },
    emptyDesc: {
      type: String,
      value: '暂无数据'
    },
    btnText: {
      type: String,
      value: '确认'
    },
    background: {
      type: String,
      value: app.globalData.background
    },
    showBtn: {
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
    onClose() {
      this.setData({
        show: false
      })
    },
    onSubmit (){
      this.triggerEvent(this.properties.funName)
    }
  }
})
