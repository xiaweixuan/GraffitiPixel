// pages/MY/works/works.js
var util = require('../../../utils/util.js');
const app = getApp()
Page({
  data: {
    worksList:[],
    pic:{}
	},
	details() {
		wx.navigateTo({url: '/pages/MY/details/details'})
  },
  onLoad: function (options) {
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
    wx.cloud.callFunction({
      name: 'database',
      data: {database: 'user'},
      success: res => {
        setTimeout(()=> {
          this.setData({load: false})
        }, 1000)
        for(var i=0;i<res.result.data.length;i++){
          if (app.globalData._id==res.result.data[i]._id){
            this.setData({
              worksList: res.result.data[i].works
            })
          }
        }
        var that=this
        for (var i = 0; i < that.data.worksList.length; i++) {
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
              that.drawTem(that.data.pic)
            })
          })(i)
        }
      }
    })
	},

  drawTem: function (el) {
    var n = 0;
    for (var i = 0; i < el.row; i++) {
      for (var j = 0; j < el.col; j++) {
        el.context.beginPath();
        el.context.fillStyle = el.drawDataMatrix[n];
        el.context.fillRect(j * el.cellW, i * el.cellH, el.cellW, el.cellH)
        el.context.closePath();
        n++;
      }
    }
  },

  initData: function (canvas,context, j) {
    //del
    var dataS = this.data.worksList[j].data;
    var dataM = app.globalData.drawingFn.strToData(dataS)
    var pic = {
      row: this.data.worksList[j].row, //行数
      col: this.data.worksList[j].col, //列数
      context: context,
      canvas: context.canvas,
      width: canvas.width || 300,
      height: canvas.height || 300,
      cellW: canvas.width / this.data.worksList[j].row || 6,
      cellH: canvas.height / this.data.worksList[j].col || 6,
      drawDataMatrix: dataM,
      color: '#000000',
    }
    this.setData({pic: pic})
    //画出网格
  },

  _greyShow: function (el) {
    var colorList = this._getColorList(el.drawDataMatrix)
    var greyList = this._getGrayColor(el.drawDataMatrix)
    var n = 0;
    for (var i = 0; i < el.row; i++) {
      for (var j = 0; j < el.col; j++) {
        if (el.drawDataMatrix_tem[n] === "#ffffff") {
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
  delete(e) {
    this.setData({loadModal:true})
    var that = this
    var abc = app.globalData._id
    var arr=[]
    var str=''
    if (app.globalData._id) {
      wx.cloud.database().collection('user').where({
        _id: app.globalData._id
      }).get({
        success: res => {
          for (var j = 0; j < res.data[0].works.length; j++) {
            if (e.currentTarget.dataset.test._id == res.data[0].works[j]._id) {
              that.data.worksList.splice(j, 1)
              res.data[0].works.splice(j, 1)
              app.globalData.worksdata.splice(j,1)
              arr=app.globalData.works.split("#")
              arr.splice(0,1)
              arr.splice(j,1)
              str=arr.join('#')
              app.globalData.works="#"+str
              wx.cloud.callFunction({
                name: 'delefield',
                data: {
                  database:'user',
                  _id: abc,
                  works: res.data[0].works
                },
                success: res => {
                  this.setData({worksList:[]})
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
    wx.cloud.callFunction({
      name: 'database',
      data: {database: 'drawing'},
      success: res => {
        for(var i=0;i<res.result.data.length;i++){
          if((app.globalData.works.indexOf("#"+res.result.data[i]._id)/33)==n){
            var dataS = res.result.data[i].data;
            var dataM = app.globalData.drawingFn.strToData(dataS)
            app.globalData.id = res.result.data[i]._id
            app.globalData.data = that.data.worksList[n].data
            app.globalData.drawing = {
              row: res.result.data[i].row, //行数
              col: res.result.data[i].col, //列数
              drawDataMatrix: dataM,
              coin: 0,
              ...app.globalData.drawingFn
            }
            break
          }
        }
        wx.navigateTo({url: '/pages/gallery/picDetail/picDetail'})
      }
    })
  },

  onShareAppMessage: (res) => {
    return {
      title: '涂鸦像素小程序',
      path: "/pages/MY/works/works"
    }
  }
})