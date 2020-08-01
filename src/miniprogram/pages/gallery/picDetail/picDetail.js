// pages/gallery/PicDetail/picDetail.js
var util = require('../../../utils/util.js'); 
const app = getApp()
Page({
  data: {
    pic:{},
    integral:0,
    modalName:null,
    done:0,
    marginleft:0,
    // 是否购买
    isbuy:0,
    // 是否免费
    isfree:0,
    coin:0,
    history:""
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  onLoad: function(options) {
    this.setData({load:true})
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
				app.globalData._openid=res.result.openid
    this.setData({isfree:0,isbuy:0})
    var that = this;
    wx.cloud.callFunction({
      name: 'database',
      data: {
        database: 'drawing',
      },
      success: res => {
        for(var i = 0;i<res.result.data.length; i++){
          if(app.globalData.id == res.result.data[i]._id){
            that.setData({
              coin:res.result.data[i].coin,
              history:res.result.data[i].history
            })
            if(res.result.data[i].coin == 0){
              that.setData({
                isfree:1
              })
            }
            setTimeout(()=> {
              this.setData({load: false})
            }, 1000)
          }
        }
      }
    })
    if(app.globalData.data){
      that.setData({done:1})
    }
    wx.cloud.callFunction({
      name: 'database',
      data: {
        database: 'user',
      },
      success: res => {
        for (var i = 0; i < res.result.data.length; i++) {
          if (res.result.data[i]._openid == app.globalData._openid) {
            app.globalData._id = res.result.data[i]._id;
            for(var j=0;j<res.result.data[i].isisbuy.length;j++){
              if(app.globalData.id == res.result.data[i].isisbuy[j]){
                that.setData({
                  isbuy:1
                })
              }
            }
            that.setData({
              integral:res.result.data[i].integral
            }) 
            return;
          }
        }
      }
    })
    var pic = app.globalData.drawing
    const query = wx.createSelectorQuery()
    query
      .select('#canvas')
      .fields({
        node: true,
        size: true,
      })
      .exec((res) => {
        var canvas = res[0].node;
        var context = canvas.getContext("2d")
        canvas.width = '300'
        canvas.height = '300'
        this.initData(context, canvas)
        this._greyShow(this.data.pic)
      })
      wx.getSystemInfo({
        success:res=>{
          var marginleft = parseInt((res.windowWidth-300)/2)
          that.setData({
            marginleft:marginleft
          })
        }
      })
    }
  })
  },
  initData: function (context, canvas) {
    var pic = {
      row: app.globalData.drawing.row, //行数
      col: app.globalData.drawing.col, //列数
      context: context,
      canvas: context.canvas,
      width: canvas.width || 300,
      height: canvas.height || 300,
      cellW: canvas.width / app.globalData.drawing.row || 6,
      cellH: canvas.height / app.globalData.drawing.col || 6,
      drawDataMatrix: app.globalData.drawing.drawDataMatrix,
      color: '#000000'
    }
    this.setData({
      pic: pic
    })
  },
  _greyShow: function (el) {
    var colorList = this._getColorList(el.drawDataMatrix)
    var greyList = this._getGrayColor(el.drawDataMatrix)
    var n = 0;
    for (var i = 0; i < el.row; i++) {
      for (var j = 0; j < el.col; j++) {
        if (el.drawDataMatrix[n] === "#ffffff") {
          n++;
          continue
        }
        el.context.beginPath();
        el.context.fillStyle = greyList[colorList.indexOf(el.drawDataMatrix[n])];
        el.context.fillRect(j * el.cellW, i * el.cellH, el.cellW, el.cellH)
        el.context.closePath();
        n++;
      }
    }
  },
  _getColorList: function (arr) {
    var result = []
    for (var i = 0; i < arr.length; i++) {
      result.indexOf(arr[i]) === -1 && result.push(arr[i])
    }
    return result
  },
  _getGrayColor: function (arr) {
    //需要多少种颜色
    var n = this._getColorList(arr).length;
    var result = [];
    var interval = Math.floor(128 / n);
    var initialColor = 80; //0x50的十进制为80

    for (var i = 0; i < n; i++) {
      result.push(initialColor.toString(16))
      initialColor += interval
    }
    for (var i = 0; i < result.length; i++) {
      var x = result[i];
      result[i] = '#' + x + x + x;
    }
    return result
  },
  start:function(e){
    var that = this;
    if(this.data.isbuy == 0 && this.data.isfree == 0){
      if(parseInt(that.data.integral)>=that.data.coin){
        const db = wx.cloud.database()
        db.collection('user').doc(app.globalData._id).update({
          data: {
            integral: parseInt(that.data.integral) - app.globalData.drawing.coin,
          }
        })
        // 向user表添加数据
        wx.cloud.callFunction({
          name: 'add',
          data: {
              database: 'user',
              _id:app.globalData._id,
              isisbuy:app.globalData.id,
          }
        })
        wx.navigateTo({
          url: '../picDrawing/picDrawing'
        })
      } 
      else{
        this.setData({
          modalName: e.currentTarget.dataset.target
        })
      }
    }
    else{
      wx.navigateTo({
        url: '../picDrawing/picDrawing',
        // url: '../test/test',
      })
    }
    this.setData({
      isbuy:0,
      isfree:0
    })
  },
  initData: function (context, canvas) {
    var pic = {
      row: app.globalData.drawing.row, //行数
      col: app.globalData.drawing.col, //列数
      context: context,
      canvas: context.canvas,
      width: canvas.width || 300,
      height: canvas.height || 300,
      cellW: canvas.width / app.globalData.drawing.row || 6,
      cellH: canvas.height / app.globalData.drawing.col || 6,
      drawDataMatrix_tem: app.globalData.drawing.drawDataMatrix,
      color: '#000000'
    }
    this.setData({
      pic: pic
    })
  },
  _greyShow: function (el) {
    var colorList = this._getColorList(el.drawDataMatrix_tem)
    var greyList = this._getGrayColor(el.drawDataMatrix_tem)
    var n = 0;
    for (var i = 0; i < el.row; i++) {
      for (var j = 0; j < el.col; j++) {
        if (el.drawDataMatrix_tem[n] === "#ffffff") {
          n++;
          continue
        }
        el.context.beginPath();
        el.context.fillStyle = greyList[colorList.indexOf(el.drawDataMatrix_tem[n])];
        el.context.fillRect(j * el.cellW, i * el.cellH, el.cellW, el.cellH)
        el.context.closePath();
        n++;
      }
    }
  },
  _getColorList: function (arr) {
    var result = []
    for (var i = 0; i < arr.length; i++) {
      result.indexOf(arr[i]) === -1 && result.push(arr[i])
    }
    return result
  },
  _getGrayColor: function (arr) {
    //需要多少种颜色
    var n = this._getColorList(arr).length;
    var result = [];
    var interval = Math.floor(128 / n);
    var initialColor = 80; //0x50的十进制为80

    for (var i = 0; i < n; i++) {
      result.push(initialColor.toString(16))
      initialColor += interval
    }
    for (var i = 0; i < result.length; i++) {
      var x = result[i];
      result[i] = '#' + x + x + x;
    }
    return result
  },
  onShow: function() {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
				app.globalData._openid=res.result.openid
    var time = util.formatTime(new Date());
    this.setData({
      time: time,
      isfree:0,
      isbuy:0
    });
    var that = this;
    if (this.data.time > 18 || this.data.time < 4) {
      this.setData({
        page: 'https://6469-diandianhua-9krf5-1301722640.tcb.qcloud.la/japimage/25.gif?sign=9b56e7de487b60c6a2087f9fc1b61a07&t=1590686036'
      });
    } else {
      this.setData({
        page: 'https://6469-diandianhua-9krf5-1301722640.tcb.qcloud.la/japimage/4.gif?sign=6e8b393c932051e1d843fb2ade59e874&t=1590686086'
      });
    } 
    wx.cloud.callFunction({
      name: 'database',//云函数接口名称database
      data: {//向接口传递参数'user'，'user'为数据库名称，另一个数据库名为'drawing'
        database: 'drawing',
      },
      success: res => {
        for(var i = 0;i<res.result.data.length; i++){
          if(app.globalData.id == res.result.data[i]._id){
            that.setData({coin:res.result.data[i].coin})
            if(res.result.data[i].coin == 0){
              that.setData({
                isfree:1
              })
            }
          }
        }
      },
      fail: err => {
        
      }
    })
    if(app.globalData.data){
      that.setData({done:1})
    }
    wx.cloud.callFunction({
      name: 'database',
      data: {
        database: 'user',
      },
      success: res => {
        for (var i = 0; i < res.result.data.length; i++) {
          if (res.result.data[i]._openid == app.globalData._openid) {
            app.globalData._id = res.result.data[i]._id;
            for(var j=0;j<res.result.data[i].isisbuy.length;j++){
              if(app.globalData.id == res.result.data[i].isisbuy[j]){
                that.setData({
                  isbuy:1
                })
              }
            }
            return;
          }
        }
      },
      fail: err => {
        
      }
    })
  }
})
  },
  onShareAppMessage: (res) => {
    return {
      title: '涂鸦像素小程序',
      path: "/pages/gallery/picDetail/picDetail"
    }
  },
})