// const Drawing = require('../../../util/drawing.js')
const app = getApp()

//定义数据类型


Page({
  data: {

    pic: {}, //画布的操作
    colorList:[]

  },
  //事件处理函数
  onLoad: function() {
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
        this.initData(context)
        this._showNumber()
        this._drawTable()
        this.setData({
          colorList :this._getColorList(this.data.pic.drawDataMatrix_tem)
        })
        
      })

  },
  initData: function(context) {
    //del
    var dataS = '#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#000000#000000#000000#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#000000#000000#fff123#000000#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#000000#000000#000000#000000#000000#000000#000000#fff123#999123#000000#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#000000#000000#000000#fff123#000000#000000#000000#000000#000000#000000#000000#000000#000000#000000#000000#000000#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#000000#fff123#fff123#999123#000000#999123#999123#999123#999123#000000#999123#999123#fff123#fff123#000000#000000#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#000000#fff123#000000#000000#999123#555555#555555#999123#999123#000000#fff123#fff123#000000#000000#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#000000#000000#000000#999123#999123#555555#555555#999123#999123#000000#000000#000000#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#000000#000000#999123#999123#555555#555555#999123#999123#000000#000000#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#000000#999123#000000#999123#999123#999123#000000#000000#000000#000000#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#000000#fff123#000000#000000#000000#000000#000000#999123#999123#000000#000000#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#000000#000000#fff123#000000#000000#000000#999123#999123#999123#fff123#fff123#000000#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#000000#000000#000000#000000#ffffff#ffffff#000000#fff123#fff123#fff123#fff123#000000#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#000000#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#000000#000000#fff123#fff123#000000#000000#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#000000#000000#000000#000000#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff#ffffff';
    var dataM = app.globalData.drawingFn.strToData(dataS)





    var pic = {
      // row: app.globalData.drawing.row, //行数
      row: 15, //行数
      // col: app.globalData.drawing.col, //列数
      col: 30, //列数
      context: context,
      canvas: context.canvas,
      width: context.canvas.width || 300,
      height: context.canvas.height || 150,
      // cellW: context.canvas.width / app.globalData.drawing.col || 6,
      cellW: context.canvas.width / 30 || 6,
      // cellH: context.canvas.height / app.globalData.drawing.row || 3,
      cellH: context.canvas.height / 15 || 3,
      left: context.canvas.getBoundingClientRect().left,
      top: context.canvas.getBoundingClientRect().top,
      drawDataMatrix: [],
      // drawDataMatrix_tem: app.globalData.drawing.drawDataMatrix,
      drawDataMatrix_tem: dataM,
      color: '#000000',
      history: [],
      x: 0,
      y: 0,
      action: 'move',
      scale: 1,
    }
    for (var i = 0; i < pic.row * pic.col; i++) {
      pic.drawDataMatrix[i] = "#ffffff"
    }
    pic.history.push([...pic.drawDataMatrix])
    this.setData({
      pic: pic
    })
    //画出网格

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
        if (el.drawDataMatrix[n] === 'null'){
          el.context.beginPath();
          el.context.fillStyle = 'rgba(255,0,0,0.4)';
          el.context.fillRect(j * el.cellW, i * el.cellH, el.cellW, el.cellH)
          el.context.closePath();
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
  drawTem: function() {
    var el = this.data.pic;
    var n = 0;
    for (var i = 0; i < el.row; i++) {
      for (var j = 0; j < el.col; j++) {
        el.context.beginPath();
        el.context.fillStyle = el.drawDataMatrix_tem[n];
        el.context.fillRect(j * el.cellW, i * el.cellH, el.cellW, el.cellH)
        el.context.closePath();
        n++;
      }
    }
  },
  _greyShow: function(el) {
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
  _getColorList: function(arr) {
    var result = []
    for (var i = 0; i < arr.length; i++) {
      result.indexOf(arr[i]) === -1 && result.push(arr[i])
    }
    return result
  },
  _getGrayColor: function() {
    //需要多少种颜色
    var n = this.getColorList().length;
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
  _showNumber: function() {
    var el = this.data.pic;
    var numberDataMatrix = this._getNumberMatrix()
    var n = 0;
    el.context.font = 3 / 4 * el.cellW + 'px Arial';
    el.context.fillStyle = "rgb(119, 110, 110)";
    for (let i = 0; i < el.row; i++) {
      for (let j = 0; j < el.col; j++) {
        if (numberDataMatrix[n] === 0) {
          n++;
          continue;
        }
        if (el.drawDataMatrix[n] === el.drawDataMatrix_tem[n]){
          n++;
          continue;
        }
        el.context.beginPath();
        el.context.fillText(numberDataMatrix[n], j * el.cellW + 1 / 4 * el.cellW, i * el.cellH + 3 / 4 * el.cellH);
        el.context.closePath();
        n++;
      }
    }
  },
  _getNumberMatrix: function() {
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
  _drawTable: function() {
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
  tap: function(e) {
    var el = this.data.pic;
    var x = e.touches[0].pageX - e.currentTarget.offsetLeft;
    var y = e.touches[0].pageY - e.currentTarget.offsetTop;
    var col = Math.floor(x / el.cellW); //列
    var row = Math.floor(y / el.cellH); //排
    var n = row * el.col + col;
    //如果颜色与现在上的颜色相同，则不上色
    if (el.drawDataMatrix[n] === el.color) return
    if (el.drawDataMatrix_tem[n] !== el.color){
      
      el.drawDataMatrix[n] = 'null';
      this.clearSene()
      this._drawTable()
      this.drawSene(false)
      this._showNumber()
    }else{
      el.drawDataMatrix[n] = el.color;
      this.clearSene()
      this._drawTable()
      this.drawSene(false)
      this._showNumber()
      this._addHistory()
    }
  },
  touchstart: function(e) {
    var x = e.touches[0].x + e.currentTarget.offsetLeft;
    var y = e.touches[0].y + e.currentTarget.offsetTop;
    var xname = "pic.x"
    var yname = "pic.y"
    this.setData({
      [xname]: x,
      [yname]: y
    })
  },
  touchmove: function(e) {
    var el = this.data.pic;
    if (e.touches.length === 1) {
      if (this.data.pic.action === 'draw') {
        //画图
        var x = e.touches[0].x;
        var y = e.touches[0].y;
        var col = Math.floor(x / el.cellW); //列
        var row = Math.floor(y / el.cellH); //排
        var n = row * el.col + col;
        if (el.drawDataMatrix[n] === el.color) return
        if (el.drawDataMatrix_tem[n] !== el.color) {
          
          el.drawDataMatrix[n] = 'null';
          this.clearSene()
          this._drawTable()
          this.drawSene(false)
          this._showNumber()
        } else {
          el.drawDataMatrix[n] = el.color;
          this.clearSene()
          this._drawTable()
          this.drawSene(false)
          this._showNumber()
          this._addHistory()
        }
        
      } else {
        //拖动
        var _x = e.changedTouches[0].x + e.currentTarget.offsetLeft - this.data.pic.x;
        var _y = e.changedTouches[0].y + e.currentTarget.offsetTop - this.data.pic.y;
        var lname = "pic.left"
        var tname = "pic.top"
        var xname = "pic.x"
        var yname = "pic.y"
        this.setData({
          [lname]: this.data.pic.left + _x,
          [tname]: this.data.pic.top + _y,
          [xname]: e.changedTouches[0].x + e.currentTarget.offsetLeft,
          [yname]: e.changedTouches[0].y + e.currentTarget.offsetTop
        })


      }
    } else {
      

    }
  },
  longtap: function() {
    var name = "pic.action"
    this.setData({
      [name]: 'draw'
    })
  },
  touchend: function(e) {
    var name = "pic.action"
    this.setData({
      [name]: 'move'
    })
  },
  endDraw: function(pic) {
    var drawDataMatrix = this.data.pic.drawDataMatrix;
    var history=this.data.pic.history;
    for(var i=0;i<drawDataMatrix.length;i++){
      if (drawDataMatrix[i]==='null'){
        
        drawDataMatrix[i]='#ffffff'
      }
    }
    for (var i = 0; i < history.length; i++) {
      for (var j = 0; j < history[i].length; j++) {
        if (history[i][j] === 'null') {
          
          history[i][j] = '#ffffff'
        }
      }
    }
    app.globalData.drawing = {
      row: this.data.pic.row, //行数
      col: this.data.pic.col, //列数
      drawDataMatrix: drawDataMatrix,
      history: history,
      ...app.globalData.drawingFn
    }
    
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
    this._drawTable()
  },
  clearSene: function() {
    var el = this.data.pic
    el.context.clearRect(0, 0, el.canvas.width, el.canvas.height)
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
      this._drawTable()
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
  listTap:function(e){
    var str = "pic.color"
    this.setData({
      [str]: e.target.id
    })
  },
  toPic:function(){
    this.endDraw(this.data.pic)
    
    wx.navigateTo({
      url: '/pages/share/picture/picture',
    })
  }

})