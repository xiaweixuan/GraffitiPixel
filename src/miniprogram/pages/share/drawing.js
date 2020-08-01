// pages/cateDetaile/cateDetaile.js
var startPoint;
var endPoint;

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 拖拽参数
    animationData: {},
    buttonTop: 0,
    buttonLeft: 0,
    width:100,
    height:100
  },

  onShow: function() {
    this.animation = wx.createAnimation({
      duration: 0,
      timingFunction: 'ease',
    })
  },
  buttonStart: function(e) {
    startPoint = e.touches[0]
  },
  buttonMove: function(e) {
    // var endPoint = e.touches[0]
    // this.animation.translate(endPoint.clientX - startPoint.clientX, endPoint.clientY - startPoint.clientY).step()
    // this.setData({
    //   animationData: this.animation.export()
    // })
    if (e.touches.length === 1) {
      var endPoint = e.touches[e.touches.length - 1]
      var translateX = endPoint.clientX - startPoint.clientX
      var translateY = endPoint.clientY - startPoint.clientY
      startPoint = endPoint
      var buttonTop = this.data.buttonTop + translateY
      var buttonLeft = this.data.buttonLeft + translateX

      this.setData({
        buttonTop: buttonTop,
        buttonLeft: buttonLeft
      })
    } else if (e.touches.length === 2) {
      const that = this;
      const {
        clientX: x0,
        clientY: y0
      } = e[0];
      const {
        clientX: x1,
        clientY: y1
      } = e[1];
      if (state.touchList[0].x && state.touchList[0].y) {
        let changeScale = (Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0)) - Math.sqrt((state.touchList[1].x - state.touchList[0].x) * (state.touchList[1].x - state.touchList[0].x) + (state.touchList[1].y - state.touchList[0].y) * (state.touchList[1].y - state.touchList[0].y))) * 0.0005;
        changeScale = changeScale >= 1.5 ? 1.5 : (changeScale <= -1 ? -1 : changeScale);
        state.scale = that.data.img.width / state.firstScaleImg.width < 1 ? 1 : (state.scale > 2.5 ? 2.5 : 1 + changeScale);
        let width = state.firstScaleImg.width * (state.scale - 1) + state.moveImgState.width;
        width = width < state.firstScaleImg.width ? state.firstScaleImg.width : width;
        let height = state.firstScaleImg.height * (state.scale - 1) + state.moveImgState.height;
        height = height < state.firstScaleImg.height ? state.firstScaleImg.height : height;
        let left = width * (1 - state.scale) / 4 + state.moveImgState.left;
        left = left * (-1) > width - state.interArea.width ? state.interArea.width - width : left > 0 ? 0 : left;
        let top = height * (1 - state.scale) / 4 + state.moveImgState.top;
        top = top * (-1) > height - state.interArea.height ? state.interArea.height - height : top > 0 ? 0 : top;
        const setImgObj = {
          width,
          height,
          left,
          top
        };
        that.setImgPos(setImgObj)
      } else {
        state.touchList = [{
          x: x0,
          y: y0
        }, {
          x: x1,
          y: y1
        }]
      }

    }

  },
  buttonEnd: function(e) {
    // var endPoint = e.changedTouches[0]
    // this.setData({
    //   buttonTop: this.data.buttonTop + (endPoint.clientY - startPoint.clientY),
    //   buttonLeft: this.data.buttonLeft + (endPoint.clientX - startPoint.clientX)
    // },()=>{
      
    // })
  },




  // /**
  //  * 生命周期函数--监听页面加载
  //  */
  // onLoad: function (options) {
  //   let that = this;
  //   // that.getSysdata();
  // },
  // //计算默认定位值
  // getSysdata: function () {
  //   var that = this;
  //   wx.getSystemInfo({
  //     success: function (e) {
  //       that.data.window = [e.windowWidth, e.windowHeight];
  
  //       var write = [];
  //       write[0] = that.data.window[0] * that.data.writePosition[0] / 100;
  //       write[1] = that.data.window[1] * that.data.writePosition[1] / 100;
  //       that.setData({
  //         write: write
  //       }, function () {
  //         // 获取元素宽高
  //         wx.createSelectorQuery().select('.collectBox').boundingClientRect(function (res) {
  //           that.data.writesize = [res.width, res.height];
  //         }).exec();
  //       })
  //     },
  //     fail: function (e) {
    
  //     }
  //   });
  // },
  // //开始拖拽  
  // touchstart:function(e){
    
  //   this.setData({
  //     x:e.touches[0].x,
  //     y:e.touches[0].y
  //     // x: e.touches[0].pageX,
  //     // y: e.touches[0].pageY
  //   })
  // },
  // touchmove: function (e) {

  //   var that = this;
  //   var write=this.data.write
  //   var position = [(e.touches[0].x - this.data.x),  (e.touches[0].y - this.data.y)];
  //   // var position = [write[0] + (e.touches[0].pageX - this.data.x), write[1] + (e.touches[0].pageY-this.data.y)];
  //   that.setData({
  //     write: position,
  //     // x: e.touches[0].pageX,
  //     // y: e.touches[0].pageY,
  //   });
  // }

})