// components/operatingButton/index.js
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
    /**
     * 确定按钮提示
     */
    successText: {
      type: String,
      value: '确定'
    },
    /**
     * 取消按钮提示
     */
    cancelText: {
      type: String,
      value: '取消'
    },
    /**
     * 是否禁用按钮 (禁用样式)
     */
    disabled: {
      type: Boolean,
      value: false
    },
    /**
     * 激活按钮颜色
     */
    successBackground: {
      type: String,
      value: '#FD7055'
    },
    /**
     * 成功按钮禁用颜色 (禁用样式)
     */
    disabledBackground: {
      type: String,
      value: '#F0C4BC'
    },
    iphoneX: {
      type: Boolean,
      value: false
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
    /**
     *  成功返回
     */
    handleSave: function () {
      this.triggerEvent('handleOperation', true)
    },
    /**
     *  失败返回
     */
    handleCancle: function () {
      this.triggerEvent('handleOperation', false)
    }
  }
})