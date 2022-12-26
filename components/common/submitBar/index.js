// components/submitBar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isIphoneX: {
      value: false,
      type: Boolean
    },
    height: {
      value: '90rpx',
      type: String
    },
    bottomList: {
      value: [{
        text: '购买',
        background: '#555555',
        funName: '',
        data:''
      }]
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
    handleEvent(e) {
      let  funName= e.currentTarget.dataset.funname
      let  data= e.currentTarget.dataset.data
      this.triggerEvent(funName,data)
    }
  }
})
