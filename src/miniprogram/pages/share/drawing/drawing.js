// const Drawing = require('../../../util/drawing.js')
const app = getApp()
Page({
  data: {
    x: 0, //中间变量
    y: 0, //中间变量
    pic: {}, //画布的操作
    action: 'move', //现在状态
    left: 0, //画布偏移量
    top: 0, //画布偏移量
    color: '#000000',
    animationData:{}
  },
  
  onLaunch: function() {
    if (!wx.cloud) {
      
    } else {
      wx.cloud.init({
        env: 'diandianhua-9krf5',
        traceUser: true,
      })
    }

  },
  onLoad: function() {
    wx.cloud.init()
    wx.cloud.callFunction({
      name: 'login',
      data: {}
    }).then(console.log)

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
        this.initData({
          col: 30,
          row: 15,
          context,
          canvas
        })
      })
  },
  tap: function(e) {

    var el = this.data.pic;
    var x = e.touches[0].pageX - e.currentTarget.offsetLeft;
    var y = e.touches[0].pageY - e.currentTarget.offsetTop;
    var col = Math.floor(x / el.cellW); //列
    var row = Math.floor(y / el.cellH); //排
    var n = row * el.col + col;
    //如果颜色与现在上的颜色相同，则不上色
    el.drawDataMatrix[n] = el.color;
    el.context.fillStyle = el.color;
    el.context.fillRect(col * el.cellW, row * el.cellH, el.cellW, el.cellH);
    this._addHistory()
  },
  drawSene: function(all) {
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
  touchstart: function(e) {
    this.setData({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    })
  },
  onShow: function () {
    this.animation = wx.createAnimation({
      duration: 0,
      timingFunction: 'ease',
    })
  },
  touchmove: function(e) {
    var el = this.data.pic;
    if (e.touches.length === 1) {
      if (this.data.action === 'draw') {
        //画图
        var x = e.touches[0].x;
        var y = e.touches[0].y;
        var col = Math.floor(x / el.cellW); //列
        var row = Math.floor(y / el.cellH); //排
        var n = row * el.col + col;
        if (el.drawDataMatrix[n] === el.color) return
        el.drawDataMatrix[n] = el.color;
        el.context.fillStyle = el.color;
        el.context.fillRect(col * el.cellW, row * el.cellH, el.cellW, el.cellH);
        this._addHistory()
      } else {
        //拖动
        this.setData({
          left: this.data.left + e.touches[0].clientX - this.data.x,
          top: this.data.top + e.touches[0].clientY - this.data.y,
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        })
      }
    } else {
      
    

    }
  },
  longtap: function() {
    this.data.action = 'draw'
  },
  touchend: function(e) {
    this.data.action = 'move'
  },
  endDraw: function(pic) {
    app.globalData.drawing = {
      row: this.data.pic.row, //行数
      col: this.data.pic.col, //列数
      drawDataMatrix: this.data.pic.drawDataMatrix,
      history: this.data.pic.history,
      ...app.globalData.drawingFn
    }
    var that = this
    
  },

  bindinput: function(e) {
    this.setData({
      color: e.detail.value
    })
  },
  changeColor: function() {
    
    // this.data.pic.color=this.data.color
    var str = "pic.color"
    this.setData({
      [str]: this.data.color
    })

  },
  redraw: function() {
    var el = this.data.pic
    this.clearSene()
    var dm = "pic.drawDataMatrix";
    var hty = "pic.history";
    var drawDataMatrix = [];
    var history = []
    for (var i = 0; i < el.row * el.col; i++) {
      drawDataMatrix[i] = "#ffffff"
    }
    history.push([...drawDataMatrix])
    this.setData({
      [dm]: drawDataMatrix,
      [hty]: history
    })
    this.drawTable()
  },
  drawTable: function() {
    //绘制表格
    var el = this.data.pic
    for (var i = 0; i <= el.row; i++) {
      el.context.beginPath();
      el.context.moveTo(0, el.cellH * i);
      el.context.lineTo(el.width, el.cellH * i);
      el.context.strokeStyle = 'grey';
      el.context.stroke();
      el.context.closePath();
    }
    for (var i = 0; i <= el.col; i++) {
      el.context.beginPath();
      el.context.moveTo(el.cellW * i, 0);
      el.context.lineTo(el.cellW * i, el.height);
      el.context.strokeStyle = 'grey';
      el.context.stroke();
      el.context.closePath();
    }
  },
  clearSene: function() {
    var el = this.data.pic
    el.context.clearRect(0, 0, el.canvas.width, el.canvas.height)
  },
  initData: function(opt, context) {

    var pic = {
      row: opt.row, //行数
      col: opt.col, //列数
      context: opt.context,
      canvas: opt.canvas,
      width: opt.canvas.width,
      height: opt.canvas.height,
      cellW: opt.canvas.width / opt.col || 6,
      cellH: opt.canvas.height / opt.row || 3,
      // left: opt.canvas.getBoundingClientRect().left,
      // top: opt.canvas.getBoundingClientRect().top,
      drawDataMatrix: [],
      color: '#000000',
      history: [],
      scale: 1,
    }
    for (var i = 0; i < pic.row * pic.col; i++) {
      pic.drawDataMatrix[i] = "#ffffff"
    }
    pic.history.push([...pic.drawDataMatrix])
    this.setData({
      pic: pic
    })
    // 画出网格
    this.drawTable(this)

  },
  recall: function() {
    var el = this.data.pic
    if (el.history.length === 1) return
    var dm = "pic.drawDataMatrix";
    var hty = "pic.history";
    var history = [...el.history].slice(0, el.history.length - 1)
    var drawDataMatrix = [...history[history.length - 1]];
    this.setData({
      [dm]: drawDataMatrix,
      [hty]: history
    }, () => {
      this.clearSene()
      this.drawTable()
      this.drawSene(false)
    })

  },
  _addHistory: function() {
    var el = this.data.pic
    var hsy = 'pic.history'
    var history = el.history
    history.push([...el.drawDataMatrix])
    this.setData({
      [hsy]: history
    })

  },
  topic: function() {
    this.endDraw()
    wx.navigateTo({
      url: '/pages/share/picture/picture',
    })
  },
  test: function(opt, canvas) {
    
    opt.context.fillStyle = 'black'
    opt.context.fillRect(0, 0, 100, 100)
  },
  numAdd: function(num1, num2) {
    let baseNum, baseNum1, baseNum2;
    try {
      baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
      baseNum1 = 0;
    }
    try {
      baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
      baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    return (num1 * baseNum + num2 * baseNum) / baseNum;
  }





})