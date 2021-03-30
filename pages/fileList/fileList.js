import { GetFileList } from '../../api/file'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parentId: null,
    // 文件列表
    fileList: [],
    // 分页参数
    pagination: {
      total: 0,
      pageNum: 1,
      pageSize: 10
    },
    // 加载中
    loading: false,
    // 加载结束
    finished: false,
    pathname: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({ fileId }) {
    this.parentId = fileId
    this.getFileList()
  },
  goBack() {
    wx.navigateBack()
  },
  // 获取文件列表
  getFileList() {
    this.setData({
      loading: true
    })
    const params = {
      ...this.data.pagination,
      parentId: this.parentId
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
          finished,
          pathname: data.pathname
        })
      }).catch(res => {
        console.error(res)
      })
    }, 500)
  },
})