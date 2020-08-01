// pages/gallery/picDrawing/picDrawing.js
const app = getApp()
var util = require('../../../utils/util.js');
var canvas0 = null;
var n, row, col;
var isDraw = false
var isAnimate=false
var id;
Page({
  data: {
    pic: {}, //画布的操作
    colorList: [], //用到的颜色
    choosecolor: [],
    scale: 1,
    d: 1,
    width: 300,
    height: 300,
    widthOrigin: 300,
    heightOrigin: 300,
    enabled: false,
    canvas: null,
    num: 1
  },
  onShow: function () {
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
  onLoad: function (options) {

    var choosecolor = []
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
        // canvas0=canvas;
        canvas.width = '300'
        canvas.height = '300'
        this.initData(context, canvas)
        this._showNumber()

        this.drawSene(false)
        var color = this._getColorList(this.data.pic.drawDataMatrix_tem);
        for (var i = 0; i < color.length; i++) {
          if (color[i] == "#ffffff") {
            color.splice(i, 1)
          }
        }
        for (var i = 0; i < color.length; i++) {
          if (i == 0) {
            choosecolor.push(1)
          } else {
            choosecolor.push(0)
          }
        }
        this.data.pic.color = color[0]
        this.setData({
          colorList: color,
          choosecolor: choosecolor,
          canvas: canvas
        })
      })
  },
  initData: function (context, canvas) {
    //del
    var dataMM = app.globalData.drawing.drawDataMatrix;
    var dataSS = app.globalData.data
    var dataM = app.globalData.drawingFn.strToData(dataSS)
    var pic = {
      row: app.globalData.drawing.row, //行数
      col: app.globalData.drawing.col, //列数
      context: context,
      canvas: context.canvas,
      width: canvas.width || 300,
      height: canvas.height || 300,
      cellW: canvas.width / app.globalData.drawing.row || 6,
      cellH: canvas.height / app.globalData.drawing.col || 6,
      drawDataMatrix: dataM,
      drawDataMatrix_tem: dataMM,
      color: '#000000',
      // history: [],
      left: 0,
      top: 0,
      x: 0,
      y: 0,
      action: 'move',
      scale: 1,
    }
    if (!dataM.length) {
      for (var i = 0; i < pic.row * pic.col; i++) {
        pic.drawDataMatrix[i] = "#ffffff"
      }
    }

    // pic.history.push([...pic.drawDataMatrix])
    this.setData({
      pic: pic
    })
  },
  drawSene: function (all) {
    var el = this.data.pic;
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
  },
  _greyShow: function (el) {
    var colorList = this._getColorList(this.data.pic.drawDataMatrix_tem)
    var greyList = this._getGrayColor()

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
  _showNumber: function () {
    var el = this.data.pic;
    var numberDataMatrix = this._getNumberMatrix()
    var colorList = this._getColorList(el.drawDataMatrix_tem)
    var greyList = this._getGrayColor(el.drawDataMatrix_tem)
    var n = 0;
    el.context.font = 3 / 4 * el.cellW + 'px Arial';
    el.context.fillStyle = "rgb(119, 110, 110)";
    for (let i = 0; i < el.row; i++) {
      for (let j = 0; j < el.col; j++) {
        if (numberDataMatrix[n] === 0) {
          n++;
          continue;
        }
        if (el.drawDataMatrix[n] === el.drawDataMatrix_tem[n]) {
          n++;
          continue;
        }
        el.context.beginPath();
        if (el.cellH > 15) {
          if (numberDataMatrix[n] == this.data.num) {
            el.context.clearRect(j * el.cellW - 1, i * el.cellH - 1, el.cellW + 2, el.cellH + 2)
            el.context.fillText(numberDataMatrix[n], j * el.cellW + 1 / 4 * el.cellW, i * el.cellH + 3 / 4 * el.cellH);
            el.context.strokeRect(j * el.cellW, i * el.cellH, el.cellW, el.cellH);
            el.context.strokeStyle = '#000000';
            el.context.lineWidth = 1
            el.context.fillStyle = "#b7b1b1";
            el.context.fillRect(j * el.cellW, i * el.cellH, el.cellW, el.cellH);
          } else {
            el.context.fillStyle = "rgb(119, 110, 110)";
            el.context.clearRect(j * el.cellW - 1, i * el.cellH - 1, el.cellW + 2, el.cellH + 2)
            el.context.fillText(numberDataMatrix[n], j * el.cellW + 1 / 4 * el.cellW, i * el.cellH + 3 / 4 * el.cellH);
            el.context.strokeRect(j * el.cellW, i * el.cellH, el.cellW, el.cellH);
            el.context.strokeStyle = '#000000';
            el.context.lineWidth = 1
          }
        } else {
          el.context.fillStyle = greyList[colorList.indexOf(el.drawDataMatrix_tem[n])];
          el.context.fillRect(j * el.cellW, i * el.cellH, el.cellW, el.cellH)
        }
        el.context.closePath();
        n++;
      }
    }
  },
  _getNumberMatrix: function () {
    var el = this.data.pic
    var colorList = this._getColorList(el.drawDataMatrix_tem)
    let result = []
    for (let i = 0; i < el.drawDataMatrix_tem.length; i++) {
      for (let j = 0; j < colorList.length; j++) {
        if (el.drawDataMatrix_tem[i] == colorList[j]) {
          result[i] = j;
          break;
        }
      }
    }
    return result;
  },
  tap: function (e) {
    var el = this.data.pic;
    var x = e.touches[0].pageX - e.currentTarget.offsetLeft;
    var y = e.touches[0].pageY - e.currentTarget.offsetTop;
    var col = Math.floor(x / el.cellW); //列
    var row = Math.floor(y / el.cellH); //排
    var n = row * el.col + col;
    //如果颜色与现在上的颜色相同，则不上色
    if (el.drawDataMatrix[n] === el.color) return
    else if (el.drawDataMatrix[n] !== "#ffffff") return
    else if (el.drawDataMatrix_tem[n] !== el.color) {
      el.drawDataMatrix[n] = '#ffffff';
      return

    } else {
      el.drawDataMatrix[n] = el.color;
      el.context.fillStyle = el.color;
      el.context.fillRect(col * el.cellW, row * el.cellH, el.cellW, el.cellH);
      // this._addHistory()
    }
  },
  touchmove: function (e) {
    var el = this.data.pic;
    if (e.touches.length === 1) {
      if (this.data.pic.action === 'draw') {
        //画图
        isDraw = true
        
        var x = e.touches[0].pageX - e.currentTarget.offsetLeft;
        var y = e.touches[0].pageY - e.currentTarget.offsetTop;
        col = Math.floor(x / el.cellW); //列
        row = Math.floor(y / el.cellH); //排
        n = row * el.col + col;
        if(!isAnimate) this.animate()
        

      } else {
        //拖动

        var _x = e.changedTouches[0].clientX - this.data.pic.x;
        var _y = e.changedTouches[0].clientY - this.data.pic.y;
        if (this.data.pic.x == 0 && this.data.pic.y == 0) {
          _x = 0;
          _y = 0
        }
        var lname = "pic.left"
        var tname = "pic.top"
        var xname = "pic.x"
        var yname = "pic.y"
        this.setData({
          [lname]: this.data.pic.left + _x,
          [tname]: this.data.pic.top + _y,
          [xname]: e.changedTouches[0].clientX,
          [yname]: e.changedTouches[0].clientY
        })


      }
    }
  },
  longtap: function () {
    var name = "pic.action"
    this.setData({
      [name]: 'draw'
    })
  },
  touchend: function (e) {
    this.stop()
    isDraw = false
    this.rendering()
    var name = "pic.action"
    var xname = "pic.x"
    var yname = "pic.y"
    this.setData({
      [name]: 'move',
      [xname]: 0,
      [yname]: 0,
    })
  },
  large: function () {
    var scale = this.data.scale * 1.3
    var that = this
    var width = "pic.canvas.width"
    var height = "pic.canvas.height"
    var cw = "pic.cellW"
    var ch = "pic.cellH"
    var w = "canvas.width"
    var h = "canvas.height"
    this.setData({
      width: Math.floor(scale * that.data.widthOrigin),
      height: Math.floor(scale * that.data.heightOrigin),
      scale: scale,
      [width]: Math.floor(scale * that.data.widthOrigin),
      [height]: Math.floor(scale * that.data.heightOrigin),
      [cw]: parseFloat(scale * that.data.widthOrigin / app.globalData.drawing.col).toFixed(2),
      [ch]: parseFloat(scale * that.data.heightOrigin / app.globalData.drawing.row).toFixed(2),
      [w]: Math.floor(scale * that.data.widthOrigin),
      [h]: Math.floor(scale * that.data.heightOrigin),
    })
    that.clearSene()
    that._showNumber()

    that.drawSene(false)
  },
  small: function () {
    var scale = this.data.scale * 0.7
    var that = this
    var width = "pic.canvas.width"
    var height = "pic.canvas.height"
    var cw = "pic.cellW"
    var ch = "pic.cellH"
    var w = "canvas.width"
    var h = "canvas.height"
    this.setData({
      width: Math.floor(scale * that.data.widthOrigin),
      height: Math.floor(scale * that.data.heightOrigin),
      scale: scale,
      [width]: Math.floor(scale * that.data.widthOrigin),
      [height]: Math.floor(scale * that.data.heightOrigin),
      [cw]: parseFloat(scale * that.data.widthOrigin / app.globalData.drawing.col).toFixed(2),
      [ch]: parseFloat(scale * that.data.heightOrigin / app.globalData.drawing.row).toFixed(2),
      [w]: Math.floor(scale * that.data.widthOrigin),
      [h]: Math.floor(scale * that.data.heightOrigin),
    })
    that.clearSene()
    that._showNumber()

    that.drawSene(false)
  },



  endDraw: function (pic) {
    var drawDataMatrix = this.data.pic.drawDataMatrix;
    var history = this.data.pic.history;
    app.globalData.drawing = {
      row: this.data.pic.row, //行数
      col: this.data.pic.col, //列数
      drawDataMatrix: drawDataMatrix,
      history: history,
      ...app.globalData.drawingFn
    }
    wx.navigateTo({
      url: '../endDrawing/endDrawing',
      success: function () {}
    })
  },
  redraw: function () {
    var el = this.data.pic
    this.clearSene()
    var dm = "pic.drawDataMatrix";
    // var hty = "pic.history";
    var drawDataMatrix = [];
    // var history = []
    for (var i = 0; i < el.row * el.col; i++) {
      drawDataMatrix[i] = "#ffffff"
    }
    // history.push([...drawDataMatrix])
    this.setData({
      [dm]: drawDataMatrix,
      // [hty]: history
    })
    this._drawTable()
  },
  clearSene: function () {
    var el = this.data.pic
    el.context.clearRect(0, 0, el.canvas.width, el.canvas.height)
  },
  listTap: function (e) {
    var str = "pic.color"
    this.setData({
      [str]: e.target.id
    })
  },
  changecolor: function (e) {
    var el = this.data.pic;
    var choosecolor = []
    for (var i = 0; i < this.data.colorList.length; i++) {
      if (i == e.currentTarget.id) {
        choosecolor.push(1)
      } else {
        choosecolor.push(0)
      }
    }
    this.setData({
      choosecolor: choosecolor
    })
    this.setData({
      num: parseInt(e.currentTarget.id) + 1
    })
    el.color = this.data.colorList[e.currentTarget.id]
    console.log(this.data.num)
    this.clearSene()
    this._showNumber()
    this.drawSene(false)
  },




  //自行封装动画
  requestAnimationFrame: function (callback, lastTime) {
    var lastTime;
    if (typeof lastTime === 'undefined') {
      lastTime = 0
    }
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 30 - (currTime - lastTime));
    lastTime = currTime + timeToCall;
    var id = setTimeout(function () {
      callback(lastTime);
    }, timeToCall);
    return id;
  },
  cancelAnimationFrame: function (id) {
    clearTimeout(id);
  },

  animate: function (lastTime) {
    if (!isDraw) return
    console.log(1)
    isAnimate=true
    id = setInterval(() => {
      var el = this.data.pic;
      console.log(3)
      if (el.drawDataMatrix[n] === el.color) return
      else if (el.drawDataMatrix[n] !== "#ffffff") return
      else if (el.drawDataMatrix_tem[n] !== el.color) {
        el.drawDataMatrix[n] = '#ffffff';
        return
      } else {
        el.drawDataMatrix[n] = el.color;
        el.context.fillStyle = el.color;
        el.context.fillRect(col * el.cellW, row * el.cellH, el.cellW, el.cellH);
        // this._addHistory()
      }
    }, 50)
  },
  stop: function () {
    setTimeout(() => {
      console.log(2)
      clearInterval(id)
      isAnimate=false
    }, 0)
  },
  onShareAppMessage: (res) => {
    return {
      title: '涂鸦像素小程序',
      path: "/pages/gallery/picDrawing/picDrawing",
      success: (res) => {


      },
      fail: (res) => {

      }
    }
  },
  rendering: function (col, row, n) {
    console.log(1)
    var el = this.data.pic;
    if (el.drawDataMatrix[n] === el.color) return
    else if (el.drawDataMatrix[n] !== "#ffffff") return
    else if (el.drawDataMatrix_tem[n] !== el.color) {
      el.drawDataMatrix[n] = '#ffffff';
      return
    } else {
      el.drawDataMatrix[n] = el.color;
      el.context.fillStyle = el.color;
      el.context.fillRect(col * el.cellW, row * el.cellH, el.cellW, el.cellH);
      // this._addHistory()
    }
  }




})