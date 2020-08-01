// pages/gallery/picDrawing/picDrawing.js
const app = getApp()
let pic = {
  drawDataMatrix: [],
  drawDataMatrix_tem: [],
  col: 30, //宽
  row: 30, //高
  history:[]
}
let context = wx.createCanvasContext('firstCanvas');
let timeId;
let touchX = 0;
let touchY = 0;
let pixelWH = 0;
let curColor = '#ffffff';
let canvasHeight = 300;
let canvasWidth = 300
let tag='move'//nomarl画画 move正在拖动 scale正在放大
let isMove=false
let isAnimate=false
let isAsynchronous=false
let canvasLeft = 0
let canvasTop=0
// let moveX = 0
// let moveY = 0
let count=123
let top,left;
let d=0;
let scale=1
Page({
  data: {
    moveX:0,
    moveY:0,
    canvasWidth: 300,
    canvasHeight: 300,
    canvasLeft:0,
    canvasTop:0,
    pic: {}, //画布的操作
    colorList: [], //用到的颜色
    choosecolor: [],
    scale: 1,
    d: 1,
    width: 300,
    height: 300,
    left: 0,
    top: 0,
    widthOrigin: 300,
    heightOrigin: 300,
    enabled: false,
    canvas: null
  },
  onLoad: function(options) {
    var choosecolor=[]
    var dataMM = app.globalData.drawing.drawDataMatrix;
    var dataSS = app.globalData.data
    var dataM = app.globalData.drawingFn.strToData(dataSS)
    pic.row = app.globalData.drawing.row
    pic.col = app.globalData.drawing.col
    pic.drawDataMatrix = dataM
    pic.drawDataMatrix_tem = dataMM
    console.log(pic)
    pixelWH = canvasWidth / pic.col
    canvasHeight = pixelWH * pic.row
    this.setData({
      canvasHeight: canvasHeight,
      canvasWidth: canvasWidth
    })
    this._showNumber()
    drawSene(false)
    var color = this._getColorList(pic.drawDataMatrix_tem);
    for (var i = 0; i < color.length; i++) {
          if (color[i] == "#ffffff") {
            color.splice(i, 1)
          }
        }
        for (var i = 0; i < color.length; i++) {
          if (i ==0) {
            choosecolor.push(1)
          } else {
            choosecolor.push(0)
          }
        }
        curColor=color[0]
        this.setData({
          colorList: color,
          choosecolor: choosecolor
        })
    // drawSene(false)
  },
  
  _showNumber: function() {
    var numberDataMatrix = this._getNumberMatrix()
    console.log(pic, pic.drawDataMatrix_tem)
    // var colorList = this._getColorList(pic.drawDataMatrix_tem)
    // var greyList = this._getGrayColor(pic.drawDataMatrix_tem)
    var n = 0;
    context.font = 3 / 4 * pic.cellW + 'px Arial';
    context.fillStyle = "rgb(119, 110, 110)";
    for (let i = 0; i < pic.row; i++) {
      for (let j = 0; j < pic.col; j++) {
        if (numberDataMatrix[n] === 0) {
          n++;
          continue;
        }
        if (pic.drawDataMatrix[n] === pic.drawDataMatrix_tem[n]) {
          n++;
          continue;
        }
        context.beginPath();
        if (pic.cellH > 10) {
          console.log(pic.cellH)
          context.clearRect(j * pic.cellW - 1, i * pic.cellH - 1, pic.cellW + 2, pic.cellH + 2)
          context.fillText(numberDataMatrix[n], j * pic.cellW + 1 / 4 * pic.cellW, i * pic.cellH + 3 / 4 * pic.cellH);
          context.strokeRect(j * pic.cellW, i * pic.cellH, pic.cellW, pic.cellH);
          context.strokeStyle = '#000000';
          context.lineWidth = 1
        } else {
          context.fillStyle = greyList[colorList.indexOf(pic.drawDataMatrix_tem[n])];
          context.fillRect(j * pic.cellW, i * pic.cellH, pic.cellW, pic.cellH)
        }
        context.closePath();
        n++;
      }
    }
  },
  _showNumber: function() {
    var numberDataMatrix = this._getNumberMatrix()
    var colorList = this._getColorList(pic.drawDataMatrix_tem)
    var greyList = this._getGrayColor(pic.drawDataMatrix_tem)
    var n = 0;
    context.font = 3 / 4 * pixelWH + 'px Arial';
    context.fillStyle = "rgb(119, 110, 110)";
    for (let i = 0; i < pic.row; i++) {
      for (let j = 0; j < pic.col; j++) {
        if (numberDataMatrix[n] === 0) {
          n++;
          continue;
        }
        if (pic.drawDataMatrix[n] === pic.drawDataMatrix_tem[n]) {
          n++;
          continue;
        }
        context.beginPath();
        if(pixelWH>10){ 
          console.log(pixelWH)
          context.clearRect(j * pixelWH-1, i * pixelWH-1, pixelWH+2, pixelWH+2)
          context.fillText(numberDataMatrix[n], j * pixelWH + 1 / 4 * pixelWH, i * pixelWH + 3 / 4 * pixelWH);
          context.strokeRect(j * pixelWH, i * pixelWH, pixelWH, pixelWH);
          context.strokeStyle = '#000000';
          context.lineWidth=1
          context.draw(true);
        }else{
          context.fillStyle = greyList[colorList.indexOf(pic.drawDataMatrix_tem[n])];
          context.fillRect(j * pixelWH, i * pixelWH, pixelWH, pixelWH)
          context.draw(true);
        }
        context.closePath();
        n++;
      }
    }
  },
  _getNumberMatrix: function() {
    var colorList = this._getColorList(pic.drawDataMatrix_tem)
    let result = []
    for (let i = 0; i < pic.drawDataMatrix_tem.length; i++) {
      for (let j = 0; j < colorList.length; j++) {
        if (pic.drawDataMatrix_tem[i] == colorList[j]) {
          result[i] = j;
          break;
        }
      }
    }
    return result;
  },
  _getColorList: function(arr) {
    var result = []
    for (var i = 0; i < arr.length; i++) {
      result.indexOf(arr[i]) === -1 && result.push(arr[i])
    }
    return result
  },
  _getGrayColor: function(arr) {
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
  changecolor: function(e) {
    var choosecolor=[]
    for (var i = 0; i < this.data.colorList.length;i++){
      if (i == e.currentTarget.id){
        choosecolor.push(1)
      }else{
        choosecolor.push(0)
      }
    }
    this.setData({
      choosecolor: choosecolor
    })
    curColor= this.data.colorList[e.currentTarget.id]
  },




  //绘制开始
  touchStart: function (e) {
    
    if (e.touches.length === 1){
      console.log("start")
      touchX = e.touches[0].pageX
      touchY = e.touches[0].pageY
      timeId = setTimeout(() => {
        tag = 'nomarl'
      }, 800)
      console.log(tag)
      this.setData({
        moveX: e.touches[0].pageX,
        moveY: e.touches[0].pageY
      })
    } else if (e.touches.length === 2) {
      this.animate()
      var x1 = e.touches[0].clientX || 0;
      var y1 = e.touches[0].clientY || 0;
      var x2 = e.touches[1].clientX || 0;
      var y2 = e.touches[1].clientY || 0;
      d = Math.floor(Math.sqrt((x1 - x1) * (x1 - x1) + (y1 - y2) * (y1 - y2)))
    }
  },
  //绘制过程中
  touchMove: function (e) {
    let that=this
    tag === 'move' && clearTimeout(timeId)
    // if (isAsynchronous) return
    if (e.touches.length === 1){
      if(tag==='nomarl'){
        console.log("托动画")
        touchX = e.touches[0].pageX;
        touchY = e.touches[0].pageY;
        wx.createSelectorQuery().select(".canvas").boundingClientRect(function (rect) {
          top = rect.top;
          left = rect.left;
          drawPixel(touchX - left, touchY - top);
        }).exec()
        
      }else if(tag==='move'){
        
        isMove=true
        console.log("拖动")
        let _x = e.touches[0].pageX
        let _y = e.touches[0].pageY
        // isAsynchronous=true
        canvasLeft = that.data.canvasLeft + (_x - that.data.moveX)
        canvasTop=that.data.canvasTop + (_y - that.data.moveY)
        this.setData({
          canvasLeft:canvasLeft,
          canvasTop:canvasTop,
          moveX:_x,
          moveY:_y
        })

      }
    } else if (e.touches.length === 2){
      console.log("放大")
      tag='scale'
      var x1 = e.touches[0].clientX || 0;
      var y1 = e.touches[0].clientY || 0;
      var x2 = e.touches[1].clientX || 0;
      var y2 = e.touches[1].clientY || 0;
      var nowd = getDistance(x1, y1, x2, y2)
      var d0 = Math.abs(d - nowd)
      d0 = d0 / 2;
      if (nowd > d) {
        var scale0 = (d + d0) / d;
      } else if (nowd < d) {
        var scale0 = (d - d0) / d;
      } else {
        return
      }
      d=nowd
      this.enlarge(scale0)
      
    }
  },
  touchEnd: function (e) {
    console.log("touchend")
    clearTimeout(timeId)
    if (tag === 'move'&& isMove===false) {
      console.log("点击画")
      wx.createSelectorQuery().select(".canvas").boundingClientRect(function (rect) {
        top = rect.top;
        left = rect.left;
        drawPixel(touchX - left, touchY - top);
      }).exec()
    }
    if(tag==='scale'){
      this.stop()
    }
    tag='move'
    isMove=false
  },





  //自行封装动画
  requestAnimationFrame: function(callback, lastTime) {
    var lastTime;
    if (typeof lastTime === 'undefined') {
      lastTime = 0
    }
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 30 - (currTime - lastTime));
    lastTime = currTime + timeToCall;
    var id = setTimeout(function() {
      callback(lastTime);
    }, timeToCall);
    return id;
  },
  cancelAnimationFrame: function(id) {
    clearTimeout(id);
  },
  animate: function(lastTime) {
    isAnimate=true
    this.animateId = this.requestAnimationFrame((t) => {
      //render
      this.rendering()

      this.animate(t)
    }, lastTime)
  },
  stop: function() {
    isAnimate=false
    this.cancelAnimationFrame(this.animateId)
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
  rendering: function() {
    clearSene()
    this._showNumber()
    drawSene(false)
  },
  enlarge: function (scale0) {

    var that = this
    scale=scale0*scale
    pixelWH = pixelWH * scale0
    this.setData({
      canvasWidth: scale0 * that.data.canvasWidth,
      canvasHeight: scale0 * that.data.canvasHeight
    })
  }




})





function drawPixel(x, y) {
  console.log(x,y)
  var px = x < pixelWH ? 0 : parseInt(x / pixelWH) * pixelWH;
  var py = y < pixelWH ? 0 : parseInt(y / pixelWH) * pixelWH;
  context.setFillStyle(curColor);
  // console.log(px, py, pixelWH, curColor)
  context.fillRect(px, py, pixelWH, pixelWH);
  context.draw(true);
  //存储状态
  var col = Math.floor(px / pixelWH); //列
  var row = Math.floor(py / pixelWH); //排
  var n = row * pic.col + col;

  pic.drawDataMatrix[n] = curColor
  pic.history.push([...pic.drawDataMatrix])
}
function drawSene(all) {
  console.log(pic)
  var n = 0;
  for (var i = 0; i < pic.row; i++) {
    if(!pic.drawDataMatrix[0]){
      continue
    }
    for (var j = 0; j < pic.col; j++) {
      if (!all && pic.drawDataMatrix[n] === "#ffffff") {
        n++;
        continue
      }
      context.setFillStyle(pic.drawDataMatrix[n]);
      context.fillRect(j * pixelWH, i * pixelWH, pixelWH, pixelWH)
      context.draw(true)
      n++
    }
  }
}
function clearSene(){
  context.clearRect(0, 0, canvasWidth, canvasHeight)
}
function getDistance (x1, y1, x2, y2) {
  return Math.floor(Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)))
}

