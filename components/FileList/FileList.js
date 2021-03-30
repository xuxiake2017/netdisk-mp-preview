// components/FileList.js
import { FILE_TYPE } from '../../utils/fileUtils'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    fileList: {
      type: Array
    }
  },
  options: {
    // 组件样式隔离 apply-shared 表示页面 wxss 样式将影响到自定义组件
    styleIsolation: 'apply-shared'
  },

  /**
   * 组件的初始数据
   */
  data: {
    FILE_TYPE,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onFileClick(event) {
      const file = event.currentTarget.dataset.file
      this.triggerEvent('file-click', { file })
    },
    fileOptHandler(event) {
      const file = event.currentTarget.dataset.file
      this.triggerEvent('file-opt', { file })
    },
  }
})
