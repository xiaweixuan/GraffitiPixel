Page({
  data: {
    
  },

  sys: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowW: res.windowWidth,
          windowH: res.windowHeight
        })
      }
    })
  },

  bginfo: function () {
    var that = this; 
    wx.downloadFile({
      url: '图片链接',
      success: function (res) {
        that.setData({canvasimgbg: res.tempFilePath})
      }
    })
  },

  canvasdraw: function (canvas) {
    var that = this;
    var windowW = that.data.windowW;
    var windowH = that.data.windowH;
    var canvasimg1 = that.data.chooseimg;
    canvas.drawImage(canvasimg1, 0, 10, 200, 200);
    canvas.draw();
  },

  daochu: function () {
    var that = this;
    var windowW = that.data.windowW;
    var windowH = that.data.windowH;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: windowW,
      height: windowH,
      destWidth: windowW,
      destHeight: windowH,
      canvasId: 'canvas',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
          }
        })
        wx.previewImage({
          urls: [res.tempFilePath],
        })
      }
    })
  },

  chooseImage: function () {
    var that = this;
    var canvas = wx.createCanvasContext('canvas');
    wx.chooseImage({
      success: function (res) {
        that.setData({chooseimg: res.tempFilePaths[0]})
        that.canvasdraw(canvas);
      }
    })
  }
})