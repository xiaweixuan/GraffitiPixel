// pages/creation/creation.js
const app = getApp()
var util = require('../../../utils/util.js'); 
let pic = {
  pictureData: [],
  col: 30,//宽
  row: 30,//高
  history:[]
}
let context = wx.createCanvasContext('firstCanvas');
let screenW = 0;
let touchX = 0;
let touchY = 0;
let pixelWH = 0;
let curColor = '#000000';
let canvasHeight = 0;
let page=undefined
Page({
  data: {
    tag:1,
    canvasHeight:0,
    cover: 1,// 设置尺寸
    set: 1,// 设置颜色
    setcolor: '',
    basiccontent: ['#000000', '#ffffff', '#6bbbec', '#fe0000', '#fff065', '#c30080', '#eea596'],
    historycontent: [],
    lefttop: 0,
    leftleft: 0,
    rightp: 0,
    r: 255,
    g: 1,
    b: 1,
    rc: 255,
    gc: 1,
    bc: 1,
    xl: 0,
    yl: 0,
    yr: 0,
    //画布相关属性
    pic: {},
    row: 0,
    col: 0,
    color: '#000000',
    canvasw: 300,
    canvash: 300,
    windowHeight: 0,
    windowWidth: 0,
    margintop: 0,
    marginleft: 0,
    footer:0
  },
  onShow: function() {
    page=this;
    var time = util.formatTime(new Date());
    pic.pictureData=[]
    pic.history=[]
    curColor = '#000000'
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
  //绘制开始
  touchStart: function (e) {
    touchX = e.touches[0].x; // 获取触摸时的原点  
    touchY = e.touches[0].y; // 获取触摸时的原点
    if (touchX > screenW || touchY > screenW) {
      return;
    }
    drawPixel(touchX, touchY);
  },
  //绘制过程中
  touchMove: function (e) {
    touchX = e.touches[0].x;
    touchY = e.touches[0].y;
    if (touchX > screenW || touchY > screenW) {
      return;
    }
    drawPixel(touchX, touchY);
  },
  //完成绘画
  endDraw: function () {
    app.globalData.drawing = {
      row: pic.row, //行数
      col: pic.col, //列数
      drawDataMatrix: pic.pictureData,
      history: [],
      ...app.globalData.drawingFn
    }
    wx.navigateTo({
      url: '../finish/finish',
      success: function () { }
    })
    this.setData({ cover: 0, set: 0, setcolor: 0, basiccolor: 1, palette: 0 })
    var that = this
    app.globalData.drawing.dataToStr(pic.pictureData)

  },
  recall:function(){
    var el = pic
    if (el.history.length === 1) return
    var history = [...el.history].slice(0, el.history.length - 1)
    var pictureData = [...history[history.length - 1]];
    pic.pictureData = pictureData
    pic.history=history
    context.clearRect(0, 0, screenW, canvasHeight)
    context.setLineWidth(0.5);
    context.setStrokeStyle('rgba(46,46,46, 0.5)');
    for (var i = 0; i <= pic.row; i++) {
      context.moveTo(0, i * pixelWH);
      context.lineTo(screenW, i * pixelWH);
    }
    for (var i = 0; i <= pic.col; i++) {
      context.moveTo(i * pixelWH, 0);
      context.lineTo(i * pixelWH, screenW);
    }
    context.stroke();
    context.draw(true);
    drawSene(false)
  },
  //输入高
  InputRow: function (e) {
    var row=Math.floor(e.detail.x/7)
    if(e.detail.x>208){
      row=30
    }
    this.setData({
      row: row,
      col:row
    })
  },
  blackDly: function () {
    wx.switchTab({
      url: '../diy',
      success: function () { }
    })
  },
  finishset: function () {
    this.setData({ set: 0, cover: 0 })
    pic.row = this.data.row
    pic.col = this.data.col
    this.init()
  },
  init:function(){
    pic.pictureData=[]
    for (var i = 0; i < pic.row * pic.col; i++) {
      pic.pictureData.push("#ffffff")
    }
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        screenW = res.screenWidth;
        var rectWH = (screenW / pic.col);
        pixelWH = rectWH;
        canvasHeight = screenW * pic.row / pic.col;
        that.setData({ canvasHeight: canvasHeight,footer:res.screenHeight-canvasHeight-73 })
        context.setFillStyle('white');
        context.fillRect(0, 0, screenW, screenW);
        context.setLineWidth(0.5);
        context.setStrokeStyle('rgba(46,46,46, 0.5)');
        for (var i = 0; i <= pic.row; i++) {
          context.moveTo(0, i * rectWH);
          context.lineTo(screenW, i * rectWH);
        }
        for (var i = 0; i <= pic.col; i++) {
          context.moveTo(i * rectWH, 0);
          context.lineTo(i * rectWH, canvasHeight);
        }
        context.stroke();
        context.draw(true);
      },
    })
  },
  opencolor: function () {
    this.setData({ cover: 1, setcolor: 1, basiccolor: 1, palette: 0 })
  },
  showbtn: function () {
    this.setData({ basiccolor: 1, palette: 0 })
  },
  palettebtn: function () {
    this.setData({ basiccolor: 0, palette: 1 })
  },
  choosecolor: function (e) {
    var historycolor = this.data.historycontent;
    var strcolor = this.data.basiccontent[e.currentTarget.dataset.id];
    historycolor.indexOf(strcolor) === -1 && historycolor.unshift(strcolor)
    if(historycolor.length>6){
      historycolor.splice(6,1)
    }
    this.setData({ historycontent: historycolor, color: strcolor })
    curColor = strcolor
  },
  chooseHistoryColor: function (e) {
    curColor=this.data.historycontent[e.currentTarget.dataset.id]
  },
  finishdraw: function () {
    wx.navigateTo({
      url: '../finish/finish'
    })
    this.setData({ cover: 0, set: 0, setcolor: 0, basiccolor: 1, palette: 0 })
  },
  // 拾色器
  onrightchange: function (e) {
    var y = e.detail.y;
    var change = 1;
    if (y <= 24.65) {
      change = parseInt(change * 255 * (y / 24.65));
      this.setData({ r: 255, g: change, b: 0 })
      this.onleftchange(e)
    }
    else if (y > 24.65 && y <= 47.85) {
      change = parseInt(change * 255 * (1 - ((y - 24.65) / 23.2)));
      this.setData({ r: change, g: 255, b: 0 })
      this.onleftchange(e)
    }
    else if (47.85 < y && y <= 72.5) {
      change = parseInt(change * 255 * ((y - 47.85) / 24.65));
      this.setData({ r: 0, g: 255, b: change })
      this.onleftchange(e)
    }
    else if (y > 72.5 && y <= 97.15) {
      change = parseInt(change * 255 * (1 - (y - 72.5) / 24.65));
      this.setData({ r: 0, g: change, b: 255 })
      this.onleftchange(e)
    }
    else if (y > 97.15 && y <= 120.35) {
      change = parseInt(change * 255 * ((y - 97.15) / 23.2));
      this.setData({ r: change, g: 0, b: 255 })
      this.onleftchange(e)
    }
    else if (y > 120.35 && y <= 145) {
      change = parseInt(change * 255 * (1 - (y - 120.35) / 24.65));
      this.setData({ r: 255, g: 0, b: change })
      this.onleftchange(e)
    }
    this.setData({
      yr: y
    })
  },
  onleftchange: function (e) {
    var y = e.detail.y;
    var x = e.detail.x;
    if (e.currentTarget.id == 'leftbox') {
      this.setData({
        lefttop: y,
        xl: x,
        yl: y,
      })
    }
    var r1 = parseInt(this.data.r * ((145 - this.data.lefttop) / 145));
    var g1 = parseInt(this.data.g * ((145 - this.data.lefttop) / 145));
    var b1 = parseInt(this.data.b * ((145 - this.data.lefttop) / 145));
    this.setData({
      rc: r1,
      gc: g1,
      bc: b1
    })
  },
  // 点击遮罩
  coverbox: function () {
    if (this.data.set == 1) {
    }
    else {
      this.setData({
        cover: 0, setcolor: 0, basiccolor: 1, palette: 0
      })
    }
  },
  //当前颜色
  changejinzhi: function (rgb) {
    var cmyk = ''
    cmyk = "" + rgb.toString(16)
    if (cmyk.length == 1) {
      cmyk = '0' + cmyk
      return cmyk;
    }
    else {
      return cmyk;
    }
  },
  nowcolor: function () {
    var historycolor = this.data.historycontent;
    var color = "#" + this.changejinzhi(this.data.rc) + this.changejinzhi(this.data.gc) + this.changejinzhi(this.data.bc)
    historycolor.indexOf(color) === -1 && historycolor.unshift(color)
    if(historycolor.length>6){
      historycolor.splice(6,1)
    }
    this.setData({ historycontent: historycolor, color: color })
    curColor = color
    if (this.data.set == 1) {
    }
    else {
      this.setData({
        cover: 0, setcolor: 0, basiccolor: 1, palette: 0
      })
    }
  }
})
//绘制像素点
function drawPixel(x, y) {
  // var px = x < pixelWH ? 0 : parseInt(x / pixelWH) * pixelWH;
  // var py = y < pixelWH ? 0 : parseInt(y / pixelWH) * pixelWH;
  // var col = Math.floor(px / pixelWH); //列
  // var row = Math.floor(py / pixelWH); //排

  var col = Math.floor(x / pixelWH); //列
  var row = Math.floor(y / pixelWH) ; //排
  var n = row * pic.col + col;
  if (pic.pictureData[n] === curColor) {
    // page.setData({
    //   tag: pic.pictureData[n] + curColor,
    //   pic: pic.pictureData.join(""),
    //   n:n,
    //   c:col,
    //   r:row
    // })
    return
  }
  // page.setData({
  //   tag: 1,
  //   pic: pic.pictureData.join(""),
  //   n:n,
  //   c: col,
  //   r: row
  // })
  // context.setFillStyle(curColor);
  context.beginPath()
  context.fillStyle = curColor
  // context.fillRect(px, py, pixelWH, pixelWH);
  context.fillRect(col * pixelWH, pixelWH*row, pixelWH, pixelWH);
  context.draw(true);

  
  //存储状态
  pic.pictureData[n] = curColor
  pic.history.push([...pic.pictureData])
}
function drawSene (all) {
  var el = pic;
  var n = 0;
  for (var i = 0; i < el.row; i++) {
    for (var j = 0; j < el.col; j++) {
      if (!all && el.pictureData[n] === "#ffffff") {
        n++;
        continue
      }
      context.setFillStyle(el.pictureData[n]);
      context.fillRect(j * pixelWH, i * pixelWH, pixelWH, pixelWH);
      context.draw(true);
      n++;
    }
  }
}