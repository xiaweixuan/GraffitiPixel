// pages/creation/creation.js
const app = getApp()
Page({
  data: {
    cover:1,// 设置尺寸
    set:1,// 设置颜色
    setcolor:'',// 预设颜色
    basiccolor:0,// 调色板
    palette:0,// 基本颜色
    basiccontent:['#000000','#ffffff','#6bbbec','#fe0000','#fff065','#c30080','#eea596','#1468b1','#75aa38','#8c8c8c'],
    historycontent:[],// 拾色器
    lefttop:0,
    leftleft:0,
    rightp:0,
    r:255,
    g:1,
    b:1,
    rc:255,
    gc:1,
    bc:1,
    xl: 0,
    yl: 0,
    yr: 0,
    //画布相关属性
    pic:{},
    row:20,
    col:20,
    color:'#000000',
    canvasw:300,
    canvash:300,
    windowHeight:0,
    windowWidth:0,
    margintop:0,
    marginleft:0
  },
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData._openid=res.result.openid
        wx.cloud.callFunction({
          name: 'database',
          data: {database: 'user'},
          success: res => {
            for (var i = 0; i < res.result.data.length; i++) {
              if (res.result.data[i]._openid == app.globalData._openid) {
                app.globalData._id = res.result.data[i]._id
                return;
              }
            }
          }
        }); 
        var that = this;
        wx.getSystemInfo({
          success:res=>{
            that.setData({
              windowWidth:res.windowWidth,
              windowHeight:res.windowHeight
            })
          }
        })
      }
    })
  },
  
  //初始化表格数据并重新开始
  _initData: function (opt) {
    var sumwidth = this.data.windowWidth-20;
    var bound = parseInt(257 /750 * (sumwidth+20));
    var sumheight = this.data.windowHeight-bound;
    var cellw = parseInt(sumwidth/opt.col);
    var cellh = parseInt(sumheight/opt.row);
    var cell;
    if(cellw>=cellh){cell = cellh}
    else{cell = cellw} 
    var marginleft = (sumwidth+20-opt.col*cell)/2;
    var margintop = (sumheight-opt.row*cell)*0.25; 
    var pic = {
      row: opt.row, //行数
      col: opt.col, //列数
      context: opt.context,
      canvas: opt.canvas,
      width: cell*opt.col,
      height: cell*opt.row,
      cellW: cell, 
      cellH: cell ,
      drawDataMatrix: [],
      color: '#000000',
      history: [],
      x: 0,
      y: 0,
      left:0,
      top:0,
      action: 'move',
      scale: 1
    }

    this.setData({
      pic: pic,
      canvasw:pic.width,
      canvash:pic.height,
      margintop:margintop,
      marginleft:marginleft
    })
    this._redraw()
  },

  //设置表格 
  setTable:function(col,row){
    this._initData({ col: col,row:row,context:this.data.pic.context})
  }, 

  //清屏
  clearSene: function (el) {
    el.canvas.width = el.width;
    el.canvas.height = el.height;
    el.context.clearRect(0, 0,500,500)
  },

  //重画
  _redraw: function () {
    var el = this.data.pic
    this.clearSene(el)
    this._drawTable()
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
  },

  //画表格
  _drawTable: function () {
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

  //添加到历史记录
  _addHistory: function () {
    var el = this.data.pic
    var hsy = 'pic.history'
    var history = el.history
    history.push([...el.drawDataMatrix])
    this.setData({
      [hsy]: history
    })
  },

  //快速点击事件
  tap: function (e) {
    var el = this.data.pic;
    var x = e.touches[0].pageX - e.currentTarget.offsetLeft;
    var y = e.touches[0].pageY - e.currentTarget.offsetTop;
    var col = Math.floor(x / el.cellW); //列
    var row = Math.floor(y / el.cellH); //排
    var n = row * el.col + col;
    //如果颜色与现在上的颜色相同，则不上色
    if (el.drawDataMatrix[n] === el.color) return
    el.drawDataMatrix[n] = el.color;
    el.context.fillStyle = el.color;
    el.context.fillRect(col * el.cellW, row * el.cellH, el.cellW, el.cellH);
    this._addHistory()
  },

  //完成绘画
  endDraw: function (pic,e) {
    app.globalData.drawing = {
      row: this.data.pic.row, //行数
      col: this.data.pic.col, //列数
      drawDataMatrix: this.data.pic.drawDataMatrix,
      history: this.data.pic.history,
      ...app.globalData.drawingFn
    }
    wx.navigateTo({
      url: '../finish/finish'
    })
    this.setData({ cover: 0, set: 0, setcolor: 0, basiccolor: 1, palette: 0 })
    var that = this
    app.globalData.drawing.dataToStr(that.data.pic.drawDataMatrix)
  },

  //滑动开始
  touchstart: function (e) {
    //记录现在滑动的位置
    var x = e.touches[0].x + e.currentTarget.offsetLeft;
    var y = e.touches[0].y + e.currentTarget.offsetTop;
    var xname = "pic.x"
    var yname = "pic.y"
    this.setData({
      xname: x,
      yname: y
    })
  },
  //滑动事件
  touchmove: function (e) {
    var el = this.data.pic;
    if (e.touches.length === 1) {
      if (this.data.action === 'draw') {
        //画图
        var x = e.touches[0].pageX - e.currentTarget.offsetLeft;
        var y = e.touches[0].pageY - e.currentTarget.offsetTop;
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
        var _x = e.changedTouches[0].clientX - this.data.pic.x;
        var _y = e.changedTouches[0].clientY  - this.data.pic.y;
        if (this.data.pic.x === 0 && this.data.pic.y === 0) {
          //第一次触碰，充当touchstart的效果
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
          [xname]: e.changedTouches[0].clientX ,
          [yname]: e.changedTouches[0].clientY
        })
      }
    }
  },

  //长按事件
  longtap: function () {
    this.data.action = 'draw'
  },

  //按压结束
  touchend: function (e) {
    this.data.action = 'move'
    var xname = "pic.x"
    var yname = "pic.y"
    this.setData({
      [xname]: 0,
      [yname]: 0
    })
  },
  //换颜色

  _changeColor: function () {
    var str = "pic.color"
    this.setData({
      [str]: this.data.color
    })
  },
  //撤回

  recall: function () {
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
      this.clearSene(el)
      this._drawTable()
      this._drawSene(false)
    })
  },

  //绘制当前属性的一层
  _drawSene: function (all) {
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

  //输入高
  InputRow: function (e) { 
    this.setData({
      row: e.detail.value
    })
  },
  
  //输入宽
  InputCol: function (e) {
    this.setData({
      col: e.detail.value
    })
  },

  blackDly:function(){
    wx.switchTab({url:'../diy'})
  },

  finishset:function(){
    this.setData({set:0,cover:0})
    const query = wx.createSelectorQuery()
    query.select('#canvas').fields({
      node: true,
      size: true
    }).exec((res) => {
      var canvas = res[0].node;
      var context = canvas.getContext("2d")
      this._initData({ col: this.data.col, row: this.data.row, context,canvas })
    })
  },

  opencolor:function(){
    this.setData({cover:1,setcolor:1,basiccolor:1,palette:0})
  },
  showbtn:function(){
    this.setData({basiccolor:1,palette:0})
  },
  palettebtn:function(){
    this.setData({basiccolor:0,palette:1})
  },
  choosecolor:function(e){
    var historycolor = this.data.historycontent;
    var strcolor = this.data.basiccontent[e.currentTarget.dataset.id];
    historycolor.indexOf(strcolor) === -1 && historycolor.push(strcolor)
    this.setData({ historycontent: historycolor, color:strcolor})
    this._changeColor()
  },
  chooseHistoryColor: function (e) {
    this.setData({ color: this.data.historycontent[e.currentTarget.dataset.id]})
    this._changeColor()
  },
  finishdraw:function(){
    wx.navigateTo({
      url:'../finish/finish'
    })
    this.setData({cover:0,set:0,setcolor:0,basiccolor:1,palette:0})
  },
  // 拾色器
  onrightchange:function(e){
    var y = e.detail.y;
    var change = 1;
    if(y<=24.65){
      change = parseInt(change*255*(y/24.65));
      this.setData({r:255,g:change,b:0})
      this.onleftchange(e)
    }
    else if(y>24.65 && y<=47.85){
      change = parseInt(change*255*(1-((y-24.65)/23.2)));
      this.setData({r:change,g:255,b:0})
      this.onleftchange(e)
    }
    else if(47.85<y && y<=72.5){
      change = parseInt(change*255*((y-47.85)/24.65));
      this.setData({r:0,g:255,b:change})
      this.onleftchange(e)
    }
    else if(y>72.5 && y<=97.15){
      change = parseInt(change*255*(1-(y-72.5)/24.65));
      this.setData({r:0,g:change,b:255})
      this.onleftchange(e)
    }
    else if(y>97.15 && y<=120.35){
      change = parseInt(change*255*((y-97.15)/23.2));
      this.setData({r:change,g:0,b:255})
      this.onleftchange(e)
    }
    else if(y>120.35 && y<=145){
      change = parseInt(change*255*(1-(y-120.35)/24.65));
      this.setData({r:255,g:0,b:change})
      this.onleftchange(e)
    }
    this.setData({yr:y})
  },
  onleftchange: function(e) {
    var y = e.detail.y;
    var x = e.detail.x;
    if(e.currentTarget.id == 'leftbox'){
      this.setData({
        lefttop:y,
        xl: x,
        yl: y,
      })
    }
    var r1 = parseInt(this.data.r*((145-this.data.lefttop)/145));
    var g1 = parseInt(this.data.g*((145-this.data.lefttop)/145));
    var b1 = parseInt(this.data.b*((145-this.data.lefttop)/145));
    this.setData({
      rc:r1,
      gc:g1,
      bc:b1
    })
  },
  // 点击遮罩
  coverbox:function(){
    if(this.data.set == 1){
    }
    else{
      this.setData({
        cover:0,setcolor:0,basiccolor:1,palette:0
      })
    }
  },
  //当前颜色
  changejinzhi:function(rgb){
    var cmyk = ''
    cmyk = "" + rgb.toString(16)
    if (cmyk.length == 1) {
      cmyk = '0' + cmyk
      return cmyk;
    }
    else{
      return cmyk;
    }
  },
  nowcolor:function(){
    var historycolor = this.data.historycontent;
    var color = "#"+this.changejinzhi(this.data.rc) + this.changejinzhi(this.data.gc) + this.changejinzhi(this.data.bc)
    historycolor.indexOf(color) === -1 && historycolor.push(color)
    this.setData({ historycontent: historycolor, color:color})
    this._changeColor()
    if(this.data.set == 1){
    }
    else{
      this.setData({
        cover:0,setcolor:0,basiccolor:1,palette:0
      })
    }
  }
})