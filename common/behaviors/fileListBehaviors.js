import {
  GetFileList,
  ReName,
  GetFileMediaInfo,
  MkDir,
  CheckMd5,
  UploadMD5,
  fileUploadAction,
  DeleteFile
} from '../../api/file'
import { behavior as computedBehavior } from 'miniprogram-computed';
import commonBehaviors from './commonBehaviors';
import { verifyFileName } from '../../utils/validate';
import { getToken } from '../../conf/index';
const app = getApp()

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
  computed: { // 注意： computed 函数中不能访问 this ，只有 data 对象可供访问
    // 对话框标题
    optDialogTitle: data => {
      switch (data.dialogAction) {
        case 'reName':
          return '重命名'
        case 'makeDir':
          return '新建文件夹'
      }
    },
    showEmpty: data => {
      return !data.loading && data.fileList.length === 0
    },
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
    },
    resetFileList () {
      this.setData({
        'pagination.pageNum': 1,
        fileList: [],
      })
      this.getFileList()
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
      console.log(e);
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
        case 'delete':
          this.DeleteFileWrap()
          break
        case 'move':
          app.globalData.moveOptFile = this.data.optFile
          wx.navigateTo({
            url: '/pages/fileMove/fileMove'
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
    },
    onUploadPopupClose () {
      this.setData({
        uploadPopupShow: false
      })
    },
    /**
     * 检查文件MD5
     * @param {String} tempFilePath 文件临时路径
     * @param {String} md5Hex 文件MD5值
     * @param {Number} fileSize 文件大小
     * @param {String} fileRealName 文件名
     */
    async checkMd5Wrap (tempFilePath, md5Hex, fileSize, fileRealName = '') {
      const checkMd5Result = await CheckMd5({ md5Hex })
      if (checkMd5Result.data === 20033) { // 不存在该MD5值
        const formData = {
          md5Hex,
          parentId: this.data.filters.parentId,
          lastModifiedDate: new Date().getTime(),
          fileRealName
        }
        const token = await getToken()
        const header = {
          'X-Token': token
        }
        wx.uploadFile({
          url: fileUploadAction,
          filePath: tempFilePath,
          name: 'file',
          formData,
          header,
          success: res => {
            const result = JSON.parse(res.data)
            if (result.code === 20000) {
              this.$toast.success('上传成功！')
              this.resetFileList()
            } else {
              this.$toast(result.msg || '上传失败！')
            }
          }
        })
      } else if (checkMd5Result.data === 20034) { // 存在该MD5值
        const params = {
          md5Hex,
          fileSize,
          parentId: this.data.filters.parentId,
          fileRealName
        }
        UploadMD5(params).then((result) => {
          this.$toast.success('上传成功！')
          this.resetFileList()
        }).catch((err) => {
          this.$toast(err.msg || '上传失败！')
        });
      }
    },
    onUploadItemClick (e) {
      this.setData({
        uploadPopupShow: false
      })
      const type = e.detail.type
      switch (type) {
        case 'pic':
          wx.chooseImage({
            success: res => {
              const tempFilePaths = res.tempFilePaths
              tempFilePaths.forEach(tempFilePath => {
                const fileRealName = tempFilePath.split('http://tmp/')[1] // 小程序无法取到文件的真实名称（wx.chooseMessageFile可以）
                wx.getFileInfo({
                  filePath: tempFilePath,
                  success: res => {
                    this.checkMd5Wrap(tempFilePath, res.digest, res.size, fileRealName)
                  }
                })
              })
            }
          })
          break
        case 'video':
          wx.chooseVideo({
            sourceType: ['album','camera'],
            maxDuration: 60,
            camera: 'back',
            success: res => {
              const tempFilePath = res.tempFilePath
              const fileRealName = tempFilePath.split('http://tmp/')[1] // 小程序无法取到文件的真实名称（wx.chooseMessageFile可以）
              wx.getFileInfo({
                filePath: tempFilePath,
                success: res => {
                  this.checkMd5Wrap(tempFilePath, res.digest, res.size, fileRealName)
                }
              })
            }
          })
          break
        case 'dir':
          this.setData({
            dialogAction: 'makeDir',
            optDialogShow: true,
          })
          break
        case 'wechat':
          wx.chooseMessageFile({
            count: 10,
            type: 'all',
            success: res => {
              const tempFilePaths = res.tempFiles
              tempFilePaths.forEach(({
                name,
                path,
                size,
              }) => {
                wx.getFileInfo({
                  filePath: path,
                  success: res => {
                    this.checkMd5Wrap(path, res.digest, size, name)
                  }
                })
              })
            }
          })
          break
      }
    },
    // 文件删除
    DeleteFileWrap () {
      this.$showModal('提示', '确认删除该文件？').then(() => {
        const params = {
          fileKey: this.data.optFile.key
        }
        DeleteFile(params).then((result) => {
          this.$toast.success('删除成功！')
          this.resetFileList()
        }).catch((err) => {
          this.$toast('删除失败！')
        });
      }).catch((err) => {
      });
    }
  }
})