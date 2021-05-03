import {
  GetFileList,
  ReName,
  GetFileMediaInfo,
  MkDir,
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
    loading: true,
    // 加载结束
    finished: false,
    optFile: {
      fileName: ''
    },
    optDialogShow: false,
    // dialog行为（重命名reName；新建文件夹makeDir）
    dialogAction: 'reName',
    fileName: '',
    uploadPopupShow: false
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
          this.setData({
            loading: false
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
        fileName,
        key: fileKey,
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
        case getApp().globalData.FILE_TYPE.FILE_TYPE_OF_VIDEO: // 视频
          console.log('video')
          GetFileMediaInfo({ fileKey }).then(res => {
            const previewUrl =  res.data.fileOrigin.previewUrl
            const poster =  res.data.fileMedia.thumbnailUrl
            wx.previewMedia({
              sources: [
                {
                  url: previewUrl,
                  type: 'video',
                  poster: poster
                }
              ]
            })
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
          this.makeDirHandler()
          break
      }
    },
    // 对话框点击取消
    onDialogCancel () {
      this.setData({
        optDialogShow: false,
        fileName: ''
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
    // 新建文件夹操作
    makeDirHandler () {
      try {
        verifyFileName(this.data.fileName)
        const params = {
          parentId: this.data.filters.parentId,
          fileName: this.data.fileName,
        }
        MkDir(params).then(res => {
          this.$toast.success('新建文件夹成功！')
          this.setData({
            'pagination.pageNum': 1,
            fileList: [],
          })
          this.setData({
            optDialogShow: false
          })
          this.getFileList()
        }).catch(res => {
          this.$toast(res.msg || '新建文件夹失败！')
        })
      } catch (error) {
        console.log(error.message);
        this.$toast(error.message)
      }
    },
    onUploadFile () {
      this.setData({
        uploadPopupShow: true
      })
      // wx.chooseImage({
      //   success (res) {
      //     const tempFilePaths = res.tempFilePaths
      //     console.log(tempFilePaths);

      //     wx.getFileInfo({
      //       filePath: tempFilePaths[0],
      //       success (res) {
      //         console.log(res.size)
      //         console.log(res.digest)
      //       }
      //     })
      //     // wx.uploadFile({
      //     //   url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
      //     //   filePath: tempFilePaths[0],
      //     //   name: 'file',
      //     //   formData: {
      //     //     'user': 'test'
      //     //   },
      //     //   success (res){
      //     //     const data = res.data
      //     //     //do something
      //     //   }
      //     // })
      //   }
      // })
    },
    onUploadPopupClose () {
      this.setData({
        uploadPopupShow: false
      })
    },
    onUploadItemClick (e) {
      this.setData({
        uploadPopupShow: false
      })
      const type = e.detail.type
      switch (type) {
        case 'pic':
          break
        case 'video':
          break
        case 'dir':
          this.setData({
            dialogAction: 'makeDir',
            optDialogShow: true,
          })
          break
        case 'wechat':
          break
      }
    }
  }
})