//app.js
App({
  onLaunch: function() {
    this.globalData = {
      drawing: {
        ver: '0.0.1',
        row: 0, //行数
        col: 0, //列数
        drawDataMatrix: [],
        history: '',
        coin:0
      },
      drawingFn: {},
      userInfo: null,
      PageCur:'gallery',
      _id:'',
      _openid:'',
      collection:[],
      imgUrl:'',
      id: '',
      data:'',
      works: '',
      worksdata:[],
      initdata:'',//初始的data
    },
    this.globalData.drawingFn = {
      drawSene: function(el, all) {
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
      greyShow: function(el) {
        var colorList = this.getColorList()
        var greyList = this._getGrayColor()
        var n = 0;
        for (var i = 0; i < el.row; i++) {
          for (var j = 0; j < el.col; j++) {
            if (el.drawDataMatrix[n] === "#ffffff") {
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
      playback: function(el) {
        var n = 0;
        var time = setInterval(() => {

          if (n < this.history.length) {
            this.drawDataMatrix = [...this.history[n]]
            el.context.clearRect(0, 0, el.context.canvas.width, el.context.canvas.height)
            this.drawSene(el, false)
            n++
          } else {
            clearInterval(time)
          }
        }, 100)
      },
      toImg: function() {
        
      },
      toVideo: function() {
        
      },
      getColorList: function() {
        var result = []
        for (var i = 0; i < this.drawDataMatrix.length; i++) {
          result.indexOf(this.drawDataMatrix[i]) === -1 && result.push(this.drawDataMatrix[i])
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
      strToData: function(str) {
        var str0 = str.split("#")
        str0.shift();
        for (let i = 0; i < str0.length; i++) {
          str0[i] = '#' + str0[i];
        }
        return str0;
      },
      dataToStr: function(data) {
        var str = '';
        for (var i = 0; i < data.length; i++) {
          str += data[i];
        }
        return str
      },
    }

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    //连接云
    wx.cloud.init({
      traceUser: true,
    }),
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.navHeight = e.statusBarHeight;
        this.globalData.screenHeight = e.screenHeight;
        this.globalData.screenWidth = e.screenWidth;
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
  },
})