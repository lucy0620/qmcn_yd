// components/swipeoutL/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    btncBackground :{
      type: String,
      value: 'blue'
    },
    // 右滑按钮宽度px
    btnWidth: {
      type: Number,
      value: 70
    },
    btnText: {
      type: String,
      value: '删除'
    },
    // 操作对象
    obj: {
      type: Object,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _toggle: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击按钮触发回调
    delGoods(e) {
      this.setData({
        _toggle: this.data._toggle ? false : true
      })
      this.triggerEvent('handleBtn',e.currentTarget.dataset.obj)
    }
  }
})
