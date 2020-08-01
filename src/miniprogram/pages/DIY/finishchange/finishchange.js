// pages/finishchange/finishchange.js
var util = require('../../../utils/util.js'); 
const app = getApp()
Page({
  data: {
  },
  onLoad: function (options) {
    var pic = app.globalData.drawing
    const query = wx.createSelectorQuery()
    query.select('#canvas').fields({
      node: true,
      size: true
    }).exec((res) => {
      var canvas = res[0].node;
      var context = canvas.getContext("2d")
      canvas.width = '300'
      canvas.height = '300'
      this.initData(context, canvas)
      this._greyShow(this.data.pic)
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
    this.setData({pic: pic})
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
  onShow: function () {
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
  },
  tochange:function(){
    wx.navigateTo({
      url:'../conversion/conversion'
    })
  }
})