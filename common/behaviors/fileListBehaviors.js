import { GetFileList } from '../../api/file'
export default Behavior({
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
    onOptClick (e) {
      const opt = e.detail.opt
      console.log('onOptClick', opt)
    },
    // 文件点击事件处理
    onFileClick(event) {
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
  }
})