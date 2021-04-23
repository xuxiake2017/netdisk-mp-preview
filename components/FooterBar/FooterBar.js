import commonBehaviors from '../../common/behaviors/commonBehaviors';

Component({

  behaviors: [
    commonBehaviors
  ],
  /**
   * 组件的属性列表
   */
  properties: {

  },

  options: {
    styleIsolation: 'shared'
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
    // 上传文件
    onUploadFile () {
      this.$emit('uploadFile')
    },
    // 选择文件
    onSelectFile () {
      this.$emit('selectFile')
    },
    // 分享文件
    onShareFile () {
      this.$emit('shareFile')
    },
  }
})
