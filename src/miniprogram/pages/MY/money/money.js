// pages/MY/money/money.js
const app = getApp()
var util = require('../../../utils/util.js'); 
Page({
  data: {
    dbresult:'',
    drawname:'',
    row:'',
    col:'',
    data:'',
    history:'',
    historyPath:'',
    openid: '',
    queryResult: '',
    aka:'',
    idd:true,

    currentTab: 0,

        count: null,
  
       result: '',
  
          aka:1,
  },
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
},
swiperChange: function (e) {
    this.setData({
        currentTab: e.detail.current,
    })
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


  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }

    //START 进入页面渲染整个数据库信息
    wx.cloud.callFunction({
      name: 'database',
      data: {
        database: 'user',//'user'为数据库名称
      },
      success: res => {
        //wx.showToast调用成功提示，可删除
        wx.showToast({
          title: '调用成功',
        })
        this.setData({
          dbresult: res.result.data
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [database] 调用失败：', err)
      }
    })
    //END
  },

  //提交画 数据项：名称，行，列，图画数据，历史，历史视频
  dname:function(e){
    var aka = e.detail.value;//前端传过来的值
  },
  subData:function(e){
    var subdata = e.detail.value;//前端传过来的值
    
    this.setData({
         drawname:subdata.drawname,
              row:subdata.row,
              col:subdata.col,
             data:subdata.data,
          history:subdata.history,
      historyPath:subdata.historyPath,
              tag:subdata.tag,
             coin:subdata.coin,
    })
    console.log("[提交画的数据]",e)
    wx.cloud.callFunction({
      name: 'upload',
      data: {

                 db:'drawing',
           drawname:this.data.drawname,
                row:this.data.row,
                col:this.data.col,
               data:this.data.data,
            history:this.data.history,
        historyPath:this.data.historyPath,
                tag:this.data.tag,
               coin:this.data.coin,
      },
      success: res => {
        //wx.showToast调用成功提示，可删除
        wx.showToast({
          title: '提交成功',
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [upload] 调用失败：', err)
      }
    })
    //END
  },
  
  onQuery: function() {
    wx.cloud.callFunction({
      name: 'database',
      data: {
        database: 'ceshi',
      },
      success: res => {
        this.setData({
          queryResult: res.result.data
        })
      },
      // fail: err => {
      //   wx.showToast({
      //     icon: 'none',
      //     title: '调用失败',
      //   })
      //   console.error('[云函数] [database] 调用失败：', err)
      // }
    })
    //END
  },
  
  ziDuan:function(e){
    console.log(e.currentTarget.dataset.test)//这里传的值用1代替
    wx.cloud.callFunction({
      name: 'add',//云函数接口
      data: {//传递的数据
        database: 'user',//'user'数据库
        _id:e.currentTarget.dataset.id,//需要添加字段的id
        diy:e.currentTarget.dataset.test,//传画的数据
        // works:{a:1,b:2,c:3},//传画的数据
        // collection:'ok'//传画的数据
        //diy works collection向哪个接口传数据用哪个变量
      },
      success: res => {
        wx.showToast({
          title: '添加成功',
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [add--] 调用失败：', err)
      }
    })
    //END
  },
  
  onRemove: function(e) {
    console.log(e.currentTarget.dataset.id)//获取点击行的id
    wx.cloud.callFunction({
      name: 'delete',//云函数接口
      data: {
        database: 'ceshi',//'ceshi'数据库
        _id:e.currentTarget.dataset.id//此画的id
      },
      success: res => {

      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [add--] 调用失败：', err)
      }
    })
},



  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        //转圈特效
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        console.log(res)
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)
            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            //在about页里打开
            wx.navigateTo({
              url: '../about/about'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
            //隐藏loading 提示框
          }
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },
 
  testFunction() {
    wx.cloud.callFunction({
      name: 'sum',
      data: {
        a: 6,
        b: 2
      },
      success: res => {
        wx.showToast({
          title: '调用成功',
        })
        console.log(res)
        this.setData({
          result: JSON.stringify(res.result)
        })
        console.log(res.result)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },

})