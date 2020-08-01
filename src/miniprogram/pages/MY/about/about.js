// pages/MY/about/about.js
var util = require('../../../utils/util.js'); 
const app = getApp()
let pic={
  pictureData:[],
  col:30,//宽
  row:30,//高
}
let context = wx.createCanvasContext('firstCanvas');
let screenW = 0;

let step = -1;
let touchX = 0;
let touchY = 0;
let pixelWH = 0;
let curColor = '#000000';
let pickerColors = ['#000000', '#FFFFFF', 'yellow', 'red', 'green', 'gray', '#F0F8FF', '#FAEBD7', '#00FFFF', '#7FFFD4', '#F0FFFF'];


let canvasHeight = 0;

Page({
  data: {
    curColorIndex:0,
    canvasHeight: 0,
    colors: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '绘画板',
    })
    for(var i=0;i<pic.row*pic.col;i++){
      pic.pictureData.push("#ffffff")
    }
  },
  onReady: function (e) {
    this.setData({colors:pickerColors});
    var that = this
    wx.getSystemInfo({
      success: function (res) { 
        screenW = res.screenWidth;
        var rectWH = (screenW / pic.col);
        pixelWH = rectWH;
        canvasHeight = screenW*pic.row/pic.col;
        that.setData({ canvasHeight: canvasHeight })
 
        // 使用 wx.createContext 获取绘图上下文 context
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
          context.lineTo(i * rectWH, screenW);
        }
        context.stroke();
        context.draw(true,function(){

        });
      },
    })
  },
  //绘制开始
  touchStart: function (e){
    touchX = e.touches[0].x; // 获取触摸时的原点  
    touchY = e.touches[0].y; // 获取触摸时的原点
    if (touchX > screenW || touchY > screenW){
      return;
    }
    drawPixel(touchX,touchY);
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


  //颜色选择
  colorItemTouchAction:function(e){
    var idx = parseInt(e.target.id);
    this.setData({ curColorIndex:idx });
    curColor = pickerColors[idx];
  },

  //保存到相册
  saveToPhotoAlbumAction:function(e){
    saveCanvasImageToPhotoAlbum()
  },
  onShow:function(){
    var time = util.formatTime(new Date());
    this.setData({
      time: time
    });
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
  finish: function (){
    
  }
})

//保存画板图片到相册
function saveCanvasImageToPhotoAlbum(){
  wx.showModal({
    title: '提示',
    content: '确定保存到相册?',
    success(obj){
      if(obj.confirm){
        wx.canvasToTempFilePath({
          canvasId: 'firstCanvas',
          fileType: 'png',
          quality: 1,
          success(res) {
            var path = res.tempFilePath;
            wx.saveImageToPhotosAlbum({
              filePath: path,
              success(saveRes) {
                wx.showToast({
                  title: 'Success!',
                  icon: 'success'
                })
              }
            })
          }
        }, this)
      }
    }
  })
}


//绘制像素点
function drawPixel(x, y){
  var px = x < pixelWH ? 0 : parseInt(x / pixelWH) * pixelWH;
  var py = y < pixelWH ? 0 : parseInt(y / pixelWH) * pixelWH;
  context.setFillStyle(curColor);
  context.fillRect(px, py, pixelWH, pixelWH);
  context.draw(true);
  //存储状态
  var col = Math.floor(px / pixelWH); //列
  var row = Math.floor(py / pixelWH); //排
  var n = row * pic.col + col;

  pic.pictureData[n] = curColor
}



