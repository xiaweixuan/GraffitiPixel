// pages/conversion/conversion.js
var util = require('../../../utils/util.js');
const app = getApp()
Page({
  data: {
    finish:0,
    ctx: {},
    imgwidth: 0,
    imgheight: 0,
    showwidth: 300,
    showheight: 0,
    imgPath:'',
    path:'',
    box:false,
    enlarge:1,
    definition:0.5,
    fixedwidth:0,
    fixedheight:0,
    beleft:0,
    img:false,
    imgw:0,
    imgh:0,
    imgleft:0,
    isAuthSavePhoto: false,
  },
  onLoad: function(options) {
    var that = this;
    const ctx = wx.createCanvasContext('myCanvas')
    that.setData({ctx: ctx})
  },
  onShow: function() {
    var time = util.formatTime(new Date());
    this.setData({time: time});
    if (this.data.time > 18 || this.data.time < 4) {
      this.setData({
        page: 'https://6469-diandianhua-9krf5-1301722640.tcb.qcloud.la/japimage/25.gif?sign=9b56e7de487b60c6a2087f9fc1b61a07&t=1590686036'
      });
    } else {
      this.setData({
        page: 'https://6469-diandianhua-9krf5-1301722640.tcb.qcloud.la/japimage/4.gif?sign=6e8b393c932051e1d843fb2ade59e874&t=1590686086'
      });
    }
  },

  choosepic: function() {
    var tag;
    var ctx = this.data.ctx
    var that = this
    var minwidth;
    wx.getSystemInfo({
      success:res=>{
        minwidth = res.windowWidth;
      }
    })
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var path = res.tempFilePaths[0]
        wx.getImageInfo({
          src: path,
          success: function(res) {
            var w=res.width/100
            var h=res.height/100
            if(w>h){
              if(w<=1){tag=1}
              else if(w>1&&w<=5){
                tag=0.2
              } else if (w > 5 && w <= 10) {
                tag = 0.1
              }else{tag=0.05}
            }else{
              if (h<=1) {tag = 1}
              else if (w > 1 && w <= 5) {tag = 0.2}
              else if (h>5&&h<=10) {tag = 0.1}
              else{tag =0.05}
            }
            that.setData({
              imgwidth: Math.floor(res.width * tag),
              imgheight: Math.floor(res.height * tag),
              fixedwidth: Math.floor(res.width * tag),
              fixedheight: Math.floor(res.height * tag),
              path:path,
              finish:1,
              img:true,
              imgw: 300,
              imgh:300*res.height/res.width,
              imgleft: parseInt((minwidth -300)/2)
            }, () => {
              ctx.drawImage(path, 0, 0, that.data.imgwidth, that.data.imgheight)
              ctx.draw()
            })
          }
        })
      }
    })
  },

  draw:function(){
    var that=this
    wx.canvasGetImageData({
      canvasId: 'myCanvas',
      x: 0,
      y: 0,
      width: that.data.imgwidth,
      height: that.data.imgheight,
      success(res) {
        var imgData = res.data
        var arr = []
        for (var i = 0; i < imgData.length; i += 4) {
          var str = 'rgb(' + imgData[i] + ',' + imgData[i + 1] + ',' + imgData[i + 2] + ')'
          arr.push(that.colorRGB2Hex(str))
        }
        that.canvasdraw(arr, that.data.imgheight, that.data.imgwidth)
      }
    })
  },
  colorRGB2Hex: function(color) {
    var rgb = color.split(',');
    var r = parseInt(rgb[0].split('(')[1]);
    var g = parseInt(rgb[1]);
    var b = parseInt(rgb[2].split(')')[0]);
    var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
  },

  canvasdraw: function(arr, r, c) {
    var that=this;
    var minwidth;
    wx.getSystemInfo({
      success:res=>{minwidth = res.windowWidth;}
    })
    const query = wx.createSelectorQuery()
    query
      .select('#showCanvas')
      .fields({
        node: true,
        size: true,
      })
      .exec((res) => {
        var canvas = res[0].node;
        var context = canvas.getContext("2d")
        var width = that.data.showwidth;
        var row= r; //行数
        var col=c;//列数
        var cellW= Math.floor(width / c);
        var cellH= Math.floor(width / c);
        var height= Math.floor(Math.floor(width / c) * r);
        var n = 0;
        that.setData({
          beleft:parseInt((minwidth-300)/2),
          showheight:height
        },()=>{
          context.clearRect(0, 0, that.data.showwidth, that.data.showwidth)
          canvas.width = that.data.showwidth
          canvas.height=that.data.showheight
          that.drawSene(col,row,arr,context,cellW,cellH,false)
          that.save(canvas)
          that.setData({
            finish:2,
            box: true,
            img:false
          })
        })
      })
  },
  drawSene: function (col,row,arr,context,cellW,cellH,all) {
    var that = this
    var n = 0;
    for (var i = 0; i < row; i++) {
      for (var j = 0; j < col; j++) {
        if (!all && arr[n] === "#ffffff") {
          n++;
          continue
        }
        context.beginPath();
        context.fillStyle = arr[n];
        context.fillRect(j * cellW, i * cellH,cellW, cellH)
        context.closePath();
        n++;
      }
    }
  },
  save:function(canvas){
    var that=this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      canvas: canvas,
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        that.setData({
          imgPath: res.tempFilePath
        })
        app.globalData.imgUrl = res.tempFilePath
      }
    })
  },
  down: function () {
    this.setData({
      loading:true
    });
    var that =this
    let filePath = this.data.imgPath;
    wx.saveImageToPhotosAlbum({
      filePath: filePath,
      success(res) {
        setTimeout(()=> {
          that.setData({loading: false})
        }, 1000)
      }
    })
  },
  onSaveToPhone() {
    let that = this
    this.getSetting().then((res) => {
      // 判断用户是否授权了保存到本地的权限
      if (!res.authSetting['scope.writePhotosAlbum']) {
        that.authorize().then(() => {
          that.down()
          that.setData({
            isAuthSavePhoto: false
          })
        }).catch(() => {
          wx.showToast({
            title: '您拒绝了授权,请再次点击进行授权',
            icon: 'none',
            duration: 1500
          })
          that.setData({
            isAuthSavePhoto: true
          })
        })
      } else {
        that.down()
      }
    })
  },
  // 获取用户已经授予了哪些权限
  getSetting() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: res => {
          resolve(res)
        }
      })
    })
  },
  // 发起首次授权请求
  authorize() {
    return new Promise((resolve, reject) => {
      wx.authorize({
        scope: 'scope.writePhotosAlbum',
        success: () => {
          resolve()
        },
        fail: res => { //这里是用户拒绝授权后的回调
          reject()
        }
      })
    })
  },
  showModal() {
    wx.showModal({
      title: '检测到您没有打开保存到相册的权限，是否前往设置打开？',
      success: (res) => {
        if (res.confirm) {
          this.onOpenSetting() // 打开设置页面          
        } else if (res.cancel) {
        }
      }
    })
  },
  //打开设置，引导用户授权
  onOpenSetting() {
    wx.openSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.showToast({
            title: '您未授权',
            icon: 'none',
            duration: 1500
          })
          this.setData({// 拒绝授权
            isAuthSavePhoto: true
          })
        } else {// 接受授权
          this.setData({
            isAuthSavePhoto: false
          })
          this.onSaveToPhone() // 接受授权后保存图片
        }
      }
    })
  },
  large:function(){
    this.setData({
      imgwidth: Math.floor(this.data.fixedwidth*this.data.enlarge),
      imgheight: Math.floor(this.data.fixedheight * this.data.enlarge)
    },()=>{
      this.data.ctx.drawImage(this.data.path, 0, 0, this.data.imgwidth, this.data.imgheight)
      this.data.ctx.draw()
    })
  },
  tagchange(e){
    if (e.detail.x<31.4){
      this.setData({
        definition:0.1,
        enlarge:0.2
      })
    }else if(e.detail.x<62.8){
      this.setData({
        definition: 0.2,
        enlarge:0.4
      })
    } else if (e.detail.x<94.2){
      this.setData({
        definition: 0.3,
        enlarge: 0.6
      })
    } else if (e.detail.x<125.6) {
      this.setData({
        definition: 0.4,
        enlarge: 0.8
      })
    } else if (e.detail.x<157) {
      this.setData({
        definition: 0.5,
        enlarge: 1
      })
    }else if (e.detail.x<188.4) {
      this.setData({
        definition: 0.6,
        enlarge: 1.2
      })
    } else if (e.detail.x <219.8) {
      this.setData({
        definition: 0.7,
        enlarge: 1.4
      })
    } else if (e.detail.x < 251.2) {
      this.setData({
        definition: 0.8,
        enlarge: 1.6
      })
    } else if (e.detail.x <282.6) {
      this.setData({
        definition: 0.9,
        enlarge: 1.8
      })
    } else{
      this.setData({
        definition: 1,
        enlarge: 2
      })
    }
  },
  onShareAppMessage: (res) => {
    return {
      title: '涂鸦像素小程序',
      path: "/pages/DIY/conversion/conversion"
    }
  },
})