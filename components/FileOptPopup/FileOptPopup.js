// components/FileOptPopup/FIleOptPopup.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否展示文件操作弹窗
    show: {
      type: Boolean
    },
    // 要操作的文件
    file: {
      type: Object
    },
    // 文件操作选项
    fileOptions: {
      type: Array,
      value: [
        // {
        //   name: '分享',
        //   icon: 'icon-share',
        //   value: 'share'
        // },
        // {
        //   name: '复制',
        //   icon: 'icon-copy',
        //   value: 'copy'
        // },
        {
          name: '重命名',
          icon: 'icon-rename',
          value: 'rename'
        },
        {
          name: '删除',
          icon: 'icon-delete',
          value: 'delete'
        },
        {
          name: '移动',
          icon: 'icon-move',
          value: 'move'
        },
        {
          name: '下载',
          icon: 'icon-xiazai',
          value: 'download'
        },
      ],
    },
    safeAreaInsetBottom: {
      type: Boolean,
      value: true,
    },
  },

  options: {
    // 组件样式隔离 apply-shared 表示页面 wxss 样式将影响到自定义组件
    styleIsolation: 'apply-shared'
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
    // 文件操作对话框关闭
    onPopupClose() {
      this.triggerEvent('popup-close')
    },
    // 文件操作点击
    onOptClick(event) {
      const opt = event.currentTarget.dataset.opt
      this.triggerEvent('opt-click', { opt })
    },
  }
})
