//获取应用实例
var util = require('../../utils/util.js');
const app = getApp()
Page({
  data: {
    swiperList: [{
      id: 0,
      url: 'https://6469-diandianhua-9krf5-1301722640.tcb.qcloud.la/japimage/11.gif?sign=a806717136e11ecd320dce560368b766&t=1590685658',
      bind:'knowledge',
      name:'知识小问答',
      introduce:'Knowledge Q & A'
    }, {
      id: 1,
      url: 'https://6469-diandianhua-9krf5-1301722640.tcb.qcloud.la/japimage/19.gif?sign=83177935a25190aa407bfa441467e121&t=1590685881',
      bind:'DIY',
      name:'DIY',
      introduce:'Create your own pictures'
    }, {
      id: 2,
      url: 'https://6469-diandianhua-9krf5-1301722640.tcb.qcloud.la/japimage/27.gif?sign=0a2519ef73e5898aa42058a3f7231a47&t=1590685888',
      bind:'shop',
      name:'商城',
      introduce:'Exchange NPC characters'
    }],
    List: [],
    height:0,
    TabCur: 0,
    scrollLeft: 0,
    tabNav: ['推荐', '表情包', '植物',"人物","动物","水果","生活"],
    pic: {}, //画布的操作
    colorList: [],//用到的颜色
    collectionList:[],
    currentTab: 0,
    istLogin:true,
    done:[],
    grade:[],
    // 每一个canvas外的view的宽
    width:0,
    // 每一个canvas的宽
    minwidth:0,
  },
  DIY:function(e){
    if(this.data.istLogin==false){
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    }else{
      wx.navigateTo({
        url:'../DIY/creation/creation'
      })
    }
  },
  knowledge:function(e){
    if(this.data.istLogin==false){
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    }else{
      wx.navigateTo({
        url:'../MY/knowledge/knowledge'
      })
    }
  },
  shop:function(e){
    if(this.data.istLogin==false){
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    }else{
      wx.navigateTo({
        url:'../MY/shop/shop'
      })
    }
  },
  hideModal(e) {
    this.setData({ modalName: null })
    wx.switchTab({ url: '/pages/MY/my'});
  },
  hideModall(e) {
		this.setData({modalName: null})
	},

  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  
  swiperChange: function (e) {
    this.setData({
      currentTab: e.detail.current,
    })
  },

  Showcolor:function(){
    var that = this
    wx.getStorage({ 
      key: 'openid', 
      success: function (res) { 
        app.globalData._openid = res.data 
      } 
    }) 
    wx.cloud.callFunction({
      name: 'database',
      data: {
        database: 'user',
      },
      success: res => {
        for (var i = 0; i < res.result.data.length; i++) {
          if (res.result.data[i]._openid == app.globalData._openid) {
            app.globalData._id = res.result.data[i]._id
            app.globalData.collection = res.result.data[i].collection
            break;
          }
        }
        var collection = []
        for (var i = 0; i < that.data.List.length; i++) {
          var num = 0
          for (var j = 0; j < app.globalData.collection.length; j++) {
            if (that.data.List[i]._id == app.globalData.collection[j]) {
              num = 1
            }
            continue
          }
          if (num == 1) {
            collection.push("1")
            that.setData({
              collectionList: collection
            })
          } else {
            collection.push("0")
            that.setData({
              collectionList: collection
            })
          }
        }
      }
    })
  },
  onShow: function(){
    var that = this
    wx.cloud.callFunction({
      name: 'database',
      data: {
        database: 'npc',
      },
      success: res => {
        var npcarr = res.result.data
        for(var i=0;i<npcarr.length;i++){
          if(npcarr[i]._id==that.data.npcid){
    
          }
        }
      }
    })
    app.globalData.data = ''
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
    var that = this;
    var gallerylist = [];
    var done=[]
    var grade=[]
    var works = [] 
    var str = '' 
    wx.getStorage({ 
      key: 'openid', 
      success: function (res) { 
        app.globalData._openid = res.data 
      } 
    }) 
    wx.cloud.callFunction({ 
      name: 'database', 
      data: { 
        database: 'user', 
      }, 
      success: res => { 
        for (var i = 0; i < res.result.data.length; i++) { 
          if (res.result.data[i]._openid == app.globalData._openid) { 
            app.globalData._id = res.result.data[i]._id 
            works = res.result.data[i].works 
            break;                                                                                                                                  
          } 
        } 
        for (var i = 0; i < works.length; i++) { 
          str += "#" + works[i]._id 
        } 
        app.globalData.works = str
        app.globalData.worksdata = works 
        wx.cloud.callFunction({
          name: 'database',
          data: {
            database: 'drawing',
          },
          success: res => {
            for (var i = 0; i < res.result.data.length; i++) {
              if (res.result.data[i].tag.indexOf(that.data.tabNav[that.data.TabCur]) != -1) {
                gallerylist.push(res.result.data[i])
              }
            }
            that.setData({
              List: gallerylist
            })
            var length = ((that.data.List.length / 2) % 1 ? (that.data.List.length + 1) / 2 : that.data.List.length / 2) * 390
            that.setData({ height: length })
            that.Showcolor()
            for (var i = 0; i < this.data.List.length; i++) {
              (function(j) {
                const query = wx.createSelectorQuery()
                query.select('#canvas' + that.data.TabCur + j)
                .fields({
                  node: true,
                  size: true,
                }).exec((res) => {
                  var canvas = res[0].node;
                  var context = canvas.getContext("2d")
                  canvas.width = '150'
                  canvas.height='150'
                  that.initData(context, canvas, j)
                  if (app.globalData.works.indexOf(that.data.List[j]._id) != -1) {
                    var num = app.globalData.works.indexOf("#"+that.data.List[j]._id) / 33
                    that.drawTem(that.data.pic[j], num)
                    done.push(j)
                    grade.push(true)
                    console.log(j)
                  }else{
                    that._greyShow(that.data.pic[j])
                    grade.push(false)
                  }
                  that.setData({
                    colorList: that._getColorList(that.data.pic[j].drawDataMatrix),
                    done:done,
                    grade:grade
                  })
                })
              })(i)
            }
          }
        })
      }, 
      fail: err => { 
        console.error('[云函数] [database] 调用失败：', err) 
      } 
    }) 
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          this.setData({ istLogin:true })
        }
        else{
          this.setData({
            istLogin:false
          })
        }
      }
    })
    // 获取屏幕宽
    wx.getSystemInfo({
      success:res=>{
        var width = parseInt((res.windowWidth-30-8)/2);
        var minwidth = parseInt((width-20));
        that.setData({
          width:width,
          minwidth:minwidth
        })
      }
    })
  },

  initData: function(context, canvas, j) {
    //del
    var dataS = this.data.List[j].data;
    var dataM = app.globalData.drawingFn.strToData(dataS)
    var pic = {
      row: this.data.List[j].row, //行数
      col: this.data.List[j].col, //列数
      context: context,
      canvas: canvas,
      width: canvas.width || 300,
      height: canvas.height || 300,
      cellW: canvas.width / this.data.List[j].row,
      cellH: canvas.height / this.data.List[j].col,
      drawDataMatrix: dataM,
      color: '#000000'
    }
    var p = this.data.pic
    p[j] = pic
    this.setData({
      pic: p
    })
  },

  _greyShow: function (el) {
    var colorList = this._getColorList(el.drawDataMatrix)
    var greyList = this._getGrayColor(el.drawDataMatrix)
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

  //事件处理函数
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    this.onLoad()
    this.onReady()
    this.onShow()
  },

  //收藏
  Change(e) {
    if(this.data.istLogin==false){
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    }else{
      var that=this
      var list = "collectionList[" + e.currentTarget.dataset.id+"]"
      if (that.data.collectionList[e.currentTarget.dataset.id]==0){
        this.setData({
          modalNamet: e.currentTarget.dataset.targett
        })
        wx.cloud.callFunction({
          name: 'add',
          data: {
            database: 'user',
            _id: app.globalData._id,
            collection: e.currentTarget.dataset.test
          },
          success: res => {
            
            setTimeout(()=> {
              this.setData({
                modalNamet: null
              })
            }, 500) 
            app.globalData.collection.push(e.currentTarget.dataset.test)
            that.setData({
              [list]:1
            })
          }
        })
      } else if (that.data.collectionList[e.currentTarget.dataset.id] == 1){
        var abc = app.globalData._id
        if (app.globalData._id) {
          wx.cloud.database()
          .collection('user')
          .where({
            _id: abc
          })
          .get({
            success: res => {
              for (var j = 0; j < res.data[0].collection.length; j++) {
                if (e.currentTarget.dataset.test === res.data[0].collection[j]) { //diy、collection、works可相互替换，删除测试值'2'，从前端获取            
                  app.globalData.collection.splice(j, 1)
                  res.data[0].collection.splice(j, 1)
                  wx.cloud.callFunction({
                    name: 'delefield',
                    data: {
                      database:'user',
                      _id: abc,
                      collection: res.data[0].collection,
                    },
                    success: res => {
                      that.setData({[list]: 0})
                    }
                  })
                }
              }
            }
          })
        }
      }
    }
  },
  
  //跳转路径
  picDetail:function(e){
    if(this.data.istLogin==false){
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    }else{
      var that=this
      var str = e.currentTarget.id.toString()
      var n = str.split("")[str.length - 1]
      for(var i=0;i<that.data.done.length;i++){
        if(that.data.done[i]==n){
          for(var j=0;j<app.globalData.worksdata.length;j++){
            if (that.data.List[n]._id==app.globalData.worksdata[j]._id){
              var coin = 'List['+n+'].coin'
              app.globalData.data=app.globalData.worksdata[j].data
              that.setData({[coin]:0})
              break;
            }
          }
          break;
        }
      }
      wx.navigateTo({
        url: '/pages/gallery/picDetail/picDetail',
        success: function () {  
          app.globalData.id = that.data.List[n]._id  
          app.globalData.initdata = that.data.List[n].data
          app.globalData.drawing = {
            row: that.data.pic[n].row, //行数
            col: that.data.pic[n].col, //列数
            drawDataMatrix: that.data.pic[n].drawDataMatrix,
            coin:that.data.List[n].coin, 
            history:that.data.List[n].history, 
            ...app.globalData.drawingFn
          }
        }
      })
    }
  },
  drawTem: function (el,num) {
    var dataS =app.globalData.worksdata[num].data
    var dataM = app.globalData.drawingFn.strToData(dataS)
    var n = 0;
    for (var i = 0; i < el.row; i++) {
      for (var j = 0; j < el.col; j++) {
        el.context.beginPath();
        el.context.fillStyle = dataM[n];
        el.context.fillRect(j * el.cellW, i * el.cellH, el.cellW, el.cellH)
        el.context.closePath();
        n++;
      }
    }
  },
  onShareAppMessage: (res) => {
    return {
      title: '涂鸦像素小程序',
      path: "/pages/gallery/gallery"
    }
  }
})