// pages/gallery/endDrawing/endDrawing.js
const app = getApp()
var util = require('../../../utils/util.js');  
Page({
  data: {
    pic:{},
    index: '',
    donelist:{},
    imgPath:'',
    coin:0,
    isAuthSavePhoto:false
  },
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData._openid=res.result.openid
        const query = wx.createSelectorQuery()
        query.select('#canvas').fields({
          node: true,
          size: true
        }).exec((res) => {
          var canvas = res[0].node;
          var context = canvas.getContext("2d")
          canvas.width='150'
          canvas.height='150'
          this.initData(context,canvas);
          this.drawSene(this.data.pic,true)
        })
        var that = this;
        wx.cloud.callFunction({
          name: 'database',
          data: {
            database: 'user'
          },
          success: res => {
            for (var i = 0; i < res.result.data.length; i++) {
              if (res.result.data[i]._openid == app.globalData._openid) {
                app.globalData._id = res.result.data[i]._id
                that.setData({
                  coin:res.result.data[i].integral
                })
                return;
              }
            }
          }
        }); 
      }
    })
  },
  initData: function (context,canvas) {
    var pic = {
      row: app.globalData.drawing.row, //行数
      col: app.globalData.drawing.col, //列数
      context: context,
      canvas: canvas,
      width: canvas.width || 300,
      height: canvas.height || 300,
      cellW: canvas.width / app.globalData.drawing.row || 6,
      cellH: canvas.height / app.globalData.drawing.col || 6,
      drawDataMatrix: app.globalData.drawing.drawDataMatrix,
      color: '#000000'
    }
    this.setData({pic: pic})
  },
  drawSene: function(el, all) {
    var that=this
    var n = 0;
    for (var i = 0; i < el.row; i++) {
      for (var j = 0; j < el.col; j++) {
        if (!all && el.drawDataMatrix[n] === "#ffffff") {
          n++;
          continue
        }
        el.context.beginPath();
        el.context.fillStyle = el.drawDataMatrix[n];
        el.context.fillRect(j * el.cellW, i * el.cellH, el.cellW, el.cellH)
        el.context.closePath();
        n++;
      }
    }
     wx.canvasToTempFilePath({
       x: 0,
       y: 0,
      canvas:el.canvas,
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        that.setData({
          imgPath: res.tempFilePath
        })
        app.globalData.imgUrl = res.tempFilePath
      }
    });
  },

  saveworks:function(){
    this.setData({load:true})
    if (app.globalData.works.indexOf(app.globalData.id)!=-1){
      if (app.globalData._id) {
        wx.cloud.database().collection('user').where({
          _id: app.globalData._id
        }).get({
          success: res => {
            setTimeout(()=> {
              this.setData({load: false})
            }, 1000)
            for (var j = 0; j < res.data[0].works.length; j++) {
              if (app.globalData.id == res.data[0].works[j]._id) {
                var pic = app.globalData.drawing
                if (app.globalData.initdata== app.globalData.drawingFn.dataToStr(pic.drawDataMatrix)) {
                  const db = wx.cloud.database()
                  db.collection('user').doc(app.globalData._id).update({
                    data: {
                      ['works.' + [j] + '.data']: app.globalData.drawingFn.dataToStr(pic.drawDataMatrix),
                      ['works.' + [j] + '.finish']: true
                    }
                  })
                  wx.switchTab({url: '../gallery'});
                }
                else{
                  const db = wx.cloud.database()
                  db.collection('user').doc(app.globalData._id).update({
                    data: {
                      ['works.' + [j] + '.data']: app.globalData.drawingFn.dataToStr(pic.drawDataMatrix),
                      ['works.' + [j] + '.finish']: false
                    }
                  })
                  wx.switchTab({url: '../gallery'});
                }
              }
            }
          }
        })
      }
    }
    else{
      var pic = app.globalData.drawing
      if (app.globalData.initdata== app.globalData.drawingFn.dataToStr(pic.drawDataMatrix)) {
        this.setData({
          doneList: { _id: app.globalData.id, row: pic.row, col: pic.col, data: app.globalData.drawingFn.dataToStr(pic.drawDataMatrix), finish: true }
        })
      } else {
        this.setData({
          doneList: { _id: app.globalData.id, row: pic.row, col: pic.col, data: app.globalData.drawingFn.dataToStr(pic.drawDataMatrix), finish: false }
        })
      }
      wx.cloud.callFunction({
        name: 'add',
        data: {
          database: 'user',
          _id: app.globalData._id,
          works: this.data.doneList,
        },
        success: res => {
          wx.switchTab({
            url: '../gallery'
          });
        }
      })
     }
  },

  down:function(){
    this.setData({
      loading:true
    });
    var that =this
     let filePath=this.data.imgPath;
     wx.saveImageToPhotosAlbum({
       filePath: filePath,
       success(res){
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
  onShareAppMessage: (res) => {
    return {
      title: '涂鸦像素',
      imageUrl: app.globalData.imgUrl
    }
  },
  onShow: function() {
    var time = util.formatTime(new Date());
    this.setData({
      time: time
    });
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
})