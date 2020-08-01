// pages/MY/collection/collection.js
var util = require('../../../utils/util.js');
const app = getApp()
Page({
  data: {
    list:[],
    listdetail:[],
    pic:{},
    done:[]
  },
	details() {
		wx.navigateTo({url: '/pages/MY/details/details'})
  },
  onLoad:function (options) {
    this.setData({load:true})
  },
	onShow: function (options) {
    app.globalData.data = ''
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
    var that = this
    var listcollection = []
    var listdetail=[]
    var done=[]
    wx.cloud.callFunction({
      name: 'database',
      data: {database: 'drawing'},
      success: res => {
        setTimeout(()=> {
          this.setData({load: false})
        }, 1000)
        for (var i = 0; i < app.globalData.collection.length; i++) {
          for (var j = 0; j < res.result.data.length; j++) {
            if (app.globalData.collection[i] == res.result.data[j]._id) {
              listdetail.push(res.result.data[j])
              that.setData({listdetail: listdetail})
              break;
            }
          }
        }
        for (var i = 0; i < app.globalData.collection.length; i++) {
          (function (j) {
            const query = wx.createSelectorQuery()
            query.select('#canvas' + j).fields({
              node: true,
              size: true,
            }).exec((res) => {
              var canvas = res[0].node;
              var context = canvas.getContext("2d")
              canvas.width='150'
              canvas.height='150'
              that.initData(canvas,context, j)
              if (app.globalData.works.indexOf(that.data.listdetail[j]._id) != -1) {
                var num = app.globalData.works.indexOf("#"+that.data.listdetail[j]._id) / 33
                that.drawTem(that.data.pic[j], num)
                done.push(j)
                var coin = 'listdetail[' + j + '].coin'
                that.setData({[coin]:0})
              }else{
                that._greyShow(that.data.pic[j])
              }
              that.setData({done:done})
            })
          })(i)
        }
      }
    })
	},
  initData: function (canvas,context, j) {
    //del
    var dataS = this.data.listdetail[j].data;
    var dataM = app.globalData.drawingFn.strToData(dataS)
    var pic = {
      row: this.data.listdetail[j].row, //行数
      col: this.data.listdetail[j].col, //列数
      context: context,
      canvas: canvas,
      width: canvas.width || 300,
      height: canvas.height || 300,
      cellW: canvas.width / this.data.listdetail[j].row || 6,
      cellH: canvas.height / this.data.listdetail[j].col || 6,
      drawDataMatrix: dataM,
      color: '#000000',
    }
    var p = this.data.pic
    p[j] = pic
    this.setData({pic: p})
    //画出网格
  },
  drawTem: function (el, num) {
    var dataS = app.globalData.worksdata[num].data
    var dataM = app.globalData.drawingFn.strToData(dataS)
    var n = 0;
    for (var i = 0; i < el.row; i++) {
      for (var j = 0; j < el.col; j++) {
        el.context.beginPath();
        el.context.fillStyle = dataM[n];
        el.context.fillRect(j * el.cellW, i * el.cellH, el.cellW, el.cellH)
        el.context.closePath();
        n++;
      }
    }
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
  delete(e){
    this.setData({loadModal:true})
    var that=this
    var abc = app.globalData._id
    if (app.globalData._id) {
      wx.cloud.database().collection('user').where({
        _id: app.globalData._id
      }).get({
        success: res => {
          for (var j = 0; j < res.data[0].collection.length; j++) {
            if (e.currentTarget.dataset.test._id==res.data[0].collection[j]) {
              app.globalData.collection.splice(j, 1)
              res.data[0].collection.splice(j, 1)
              wx.cloud.callFunction({
                name: 'delefield',
                data: {
                  database:'user',
                  _id:abc,
                  collection: res.data[0].collection
                },
                success: res => {
                  this.setData({listdetail:[]})
                  this.onShow();
                  setTimeout(()=> {
                    this.setData({loadModal: false})
                  }, 1000)
                }
              })
            }
          }
        }
      })
    }
  },

  picDetail: function (e) {
      var that = this
      var str = e.currentTarget.id.toString()
      var n = str.split("")[str.length - 1]
      var dataS;
      var dataM;
      for (var i = 0; i < that.data.done.length; i++) {
        if (that.data.done[i] == n) {
          for (var j = 0; j < app.globalData.worksdata.length; j++) {
            if (that.data.listdetail[n]._id == app.globalData.worksdata[j]._id) {
              app.globalData.data = app.globalData.worksdata[j].data
              break;
            }
          }
          break;
        }
      }

      wx.navigateTo({
        url: '/pages/gallery/picDetail/picDetail',
        success: function () {
          var dataS = that.data.listdetail[n].data;
          var dataM = app.globalData.drawingFn.strToData(dataS)
          app.globalData.id = that.data.listdetail[n]._id
          app.globalData.drawing = {
            row: that.data.listdetail[n].row, //行数
            col: that.data.listdetail[n].col, //列数
            drawDataMatrix: dataM,
            coin: that.data.listdetail[n].coin,
            ...app.globalData.drawingFn
          }
       }
    })
  },
  onShareAppMessage: (res) => {
    return {
      title: '涂鸦像素小程序',
      path: "/pages/MY/collection/collection"
    }
  }
})