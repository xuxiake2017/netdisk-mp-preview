import {
  GetFileList,
  ReName
} from '../../api/file'
import { behavior as computedBehavior } from 'miniprogram-computed';
import commonBehaviors from './commonBehaviors';
import { verifyFileName } from '../../utils/validate';

export default Behavior({
  behaviors: [
    computedBehavior,
    commonBehaviors,
  ],
  data: {
    // 文件列表
    fileList: [],
    // 分页参数
    pagination: {
      total: 0,
      pageNum: 1,
      pageSize: 10
    },
    // 查询过滤条件
    filters: {
      parentId: -1,
      fileRealName: ''
    },
    // 是否展示文件操作弹窗
    show: false,
    // 加载中
    loading: false,
    // 加载结束
    finished: false,
    optFile: {
      fileName: ''
    },
    optDialogShow: false,
    // dialog行为（重命名reName；新建文件夹makeDir）
    dialogAction: 'reName',
    fileName: '',
  },
  computed: {
    // 对话框标题
    optDialogTitle: data => {
      switch (data.dialogAction) {
        case 'reName':
          return '重命名'
        case 'makeDir':
          return '新建文件夹'
      }
    }
  },
  methods: {
    // 获取文件列表
    getFileList() {
      this.setData({
        loading: true
      })
      const params = {
        ...this.data.pagination,
        ...this.data.filters
      }
      setTimeout(() => {
        GetFileList(params).then(res => {
          this.setData({
            loading: false
          })
          const data = res.data
          const {
            list,
            pageNum,
            pageSize,
            total
          } = data.pageInfo
          let finished = false
          // 判断是否结束加载
          if(pageNum * pageSize >= total) {
            finished = true
          }
          this.setData({
            fileList: [ ...this.data.fileList, ...list ],
            pagination: {
              pageNum,
              pageSize,
              total
            },
            finished
          })
          if (this.data.hasOwnProperty('pathname')) {
            this.setData({
              pathname: data.pathname
            })
          }
        }).catch(res => {
          console.error(res)
          this.setData({
            loading: false,
            finished: true
          })
        })
      }, 500)
    },
    // 对文件进行操作
    fileOptHandler(event) {
      const optFile = event.detail.file
      this.setData({
        show: true,
        optFile
      })
    },
    // 文件操作对话框关闭
    onPopupClose() {
      this.setData({
        show: false
      })
    },
    // 文件操作项点击
    onOptClick (e) {
      this.setData({
        show: false,
      })
      const opt = e.detail.opt
      switch (opt.value) {
        case 'rename':
          this.setData({
            dialogAction: 'reName',
            optDialogShow: true,
            fileName: this.data.optFile.fileName
          })
          break
      }
    },
    // 文件点击事件处理
    onFileClick (event) {
      const file = event.detail.file
      const {
        id,
        fileType,
        fileName
      } = file
      switch(fileType) {
        case getApp().globalData.FILE_TYPE.FILE_TYPE_OF_DIR:  // 文件夹
          wx.navigateTo({
            url: `/pages/fileList/fileList?fileId=${id}`
          })
          break
        case getApp().globalData.FILE_TYPE.FILE_TYPE_OF_PIC: // 图片
          console.log('pic')
          wx.previewImage({
            urls: [
              file.thumbnailUrl
            ]
          })
          break
      }
    },
    // 对话框点击确认
    onDialogConfirm () {
      switch (this.data.dialogAction) {
        case 'reName':
          this.reNameHandler()
          break
        case 'makeDir':
          break
      }
    },
    // 对话框点击取消
    onDialogCancel () {
      this.setData({
        optDialogShow: false
      })
    },
    // 对话框关闭（点击遮罩层触发）
    onDialogClose () {
    },
    // 重命名操作
    reNameHandler () {
      try {
        verifyFileName(this.data.fileName)
        const params = {
          parentId: this.data.filters.parentId,
          key: this.data.optFile.key,
          fileName: this.data.fileName,
          isDir: this.data.optFile.isDir
        }
        ReName(params).then(res => {
          this.$toast.success('重命名成功！')
          this.setData({
            'pagination.pageNum': 1,
            fileList: [],
          })
          this.setData({
            optDialogShow: false
          })
          this.getFileList()
        }).catch(res => {
          this.$toast(res.msg || '重命名失败！')
        })
      } catch (error) {
        console.log(error.message);
        this.$toast(error.message)
      }
    },
  }
})