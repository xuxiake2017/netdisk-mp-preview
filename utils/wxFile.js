const fileManager = wx.getFileSystemManager()

export const isFileExist = (filePath) => {
  try {
    fileManager.accessSync(filePath)
    // 文件（夹）存在
    return true
  } catch(e) {
    // 文件（夹）不存在
    return false
  }
}

export const removeFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fileManager.unlink({
      filePath,
      success: res => resolve(res),
      fail: err => reject(err),
    })
  })
}

export const mkDir = (filePath) => {
  if (!isFileExist(filePath)) {
    fileManager.mkdirSync(filePath, true)
  }
}

export const removeDir = (dirPath) => {
  return new Promise((resolve, reject) => {
    fileManager.rmdir({
      dirPath,
      recursive: true,
      success: res => resolve(res),
      fail: err => reject(err),
    })
  })
}