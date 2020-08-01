// pages/MY/diy/diy.js
var util = require('../../../utils/util.js'); 
const app = getApp()
Page({
  data: {
    diy:[],
    diynumber:[],
    pic:{},
    imgPath:[],
    isAuthSavePhoto:false
	}, 
	details() {
		wx.navigateTo({url: '/pages/MY/details/details'})
  },
  onLoad: function (options) {
    this.setData({load:true})
  },
	onShow: function (options) {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
				app.globalData._openid=res.result.openid
    var time = util.formatTime(new Date());
    this.setData({time: time});
    if(this.data.time>18||this.data.time<4){
      this.setData({
        page:'https://6469-diandianhua-9krf5-1301722640.tcb.qcloud.la/japimage/25.gif?sign=9b56e7de487b60c6a2087f9fc1b61a07&t=1590686036'
      });
    }else{
      this.setData({
        page:'https://6469-diandianhua-9krf5-1301722640.tcb.qcloud.la/japimage/4.gif?sign=6e8b393c932051e1d843fb2ade59e874&t=1590686086'
      });
    }
    var that=this;
    var diy = [];
    wx.cloud.callFunction({
      name: 'database',
      data: {database: 'user'},
      success: res => {
        setTimeout(()=> {
          this.setData({load: false})
        }, 1000) 
        for (var i = 0; i < res.result.data.length; i++) {
          if (res.result.data[i]._openid == app.globalData._openid) {
            app.globalData._id = res.result.data[i]._id
            var diynumber = res.result.data[i].diy
            that.setData({diynumber:res.result.data[i].diy})
            wx.cloud.callFunction({
              name: 'database',
              data: {database: 'DIY'},
              success: res => {
                for(var m = 0; m < res.result.data.length; m++){
                  for(var b = 0;b < diynumber.length;b++){
                    if(res.result.data[m]._id == diynumber[b]){
                      diy.push(res.result.data[m])
                    }
                  }
                }
                that.setData({diy:diy})
                for (var n = 0; n < diy.length; n++) {
                  (function (j) {
                    const query = wx.createSelectorQuery()
                    query.select('#canvas' + j).fields({
                      node: true,
                      size: true,
                    }).exec((res) => {
                      var canvas = res[0].node;
                      var context = canvas.getContext("2d")
                      canvas.width = '150'
                      canvas.height='150'
                      that.initData(canvas,context, j)
                      that.drawSene(false)
                    })
                  })(n)
                }
              }
            }) 
            return;
          }
        }
      }
    })
  }
})
  },

  detebin:function(e){
    this.setData({loadModal:true})
    var that = this;
    var num = e.currentTarget.id.slice(4);
    if (app.globalData._id) {
      wx.cloud.database().collection('user')
      .where({
        _id: app.globalData._id
      }).get({
        success: res => {
          res.data[0].diy.splice(num, 1)
          wx.cloud.callFunction({
            name: 'delefield',
            data: {
              database:'user',
              _id:app.globalData._id,
              diy:res.data[0].diy
            },
            success: res => {
              wx.cloud.callFunction({
                name: 'delete',
                data: {
                  database: 'DIY',
                  _id: that.data.diynumber[num]
                },
                success: res => {
                  this.setData({diy: []})
                  this.onShow();
                  setTimeout(() => {
                    this.setData({loadModal: false})
                  }, 1000)
                }
              })
            }
          })
        }
      })
    }
  },

	initData: function (canvas,context, j) {
		//del
    var dataS = this.data.diy[j].data;
    var dataM = app.globalData.drawingFn.strToData(dataS)
    var pic = {
      row: this.data.diy[j].row, //行数
      col: this.data.diy[j].col, //列数
      context: context,
      canvas: canvas,
      width: canvas.width || 300,
      height: canvas.height || 300,
      cellW: canvas.width / this.data.diy[j].row || 6,
      cellH: canvas.height / this.data.diy[j].col || 6,
      drawDataMatrix: dataM,
      color: '#000000',
    }
    this.setData({pic: pic})
  },
  
  drawSene: function (all) {
    var that=this
    var el = that.data.pic;
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
      canvas: el.canvas,
      success: function (res) {
        var tempFilePath = that.data.imgPath;
        tempFilePath.push(res.tempFilePath)
        that.setData({
          imgPath: tempFilePath
        })
      }
    });
  },

  down(id){
    this.setData({
      loading:true
    });
    var that =this
    let filePath = this.data.imgPath[id];
    wx.saveImageToPhotosAlbum({
      filePath: filePath,
      success(res) {
        setTimeout(()=> {
          that.setData({loading: false})
        }, 1000)
      }
    })
  },
  onSaveToPhone(e) {
    let that = this
    this.getSetting().then((res) => {
      // 判断用户是否授权了保存到本地的权限
      if (!res.authSetting['scope.writePhotosAlbum']) {
        that.authorize().then(() => {
          that.down(e.currentTarget.id)
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
        that.down(e.currentTarget.id)
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
      title: '涂鸦像素小程序',
      path: "/pages/MY/diy/diy"
    }
  }
})