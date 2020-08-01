const app = getApp()
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userList: [],
    istLogin:true,
    integral:3000,
    box:false
  },
  //判断是否登录
  onShow: function(){
    var that = this;
    wx.cloud.callFunction({
      name: 'database',
      data: {database: 'user'},
      success: res => {
        for (var i = 0; i < res.result.data.length; i++) {
          if (res.result.data[i]._openid == app.globalData._openid) {
            that.setData({
              integral:res.result.data[i].integral
            }) 
            return;
          }
        }
      }
    })
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          this.setData({istLogin:true})
        }
        else{
          this.setData({istLogin:false})
        }
      }
    });
  },
  
  hideModal(e) {
		this.setData({modalName: null})
	},

  onReady:function(){
    wx.cloud.callFunction({
      name: 'database',
      data: {database: 'user'},
      success: res => {
        this.setData({userList: res.result.data})
      }
    })
  },

  onLaunch: function () {
    if (!wx.cloud) {
      
    } else {
      wx.cloud.init({
        env: 'diandianhua-9krf5',
        traceUser: true,
      })
    }
  },
 
  onLoad: function () {
    var that = this;
    wx.cloud.init()
    wx.cloud.callFunction({
      name: 'login',
      data: {a: 12,b: 19}
    }).then(console.log)
    if (app.globalData.userInfo) {
      wx.cloud.callFunction({
        name: 'database',
        data: {database: 'user'},
        success: res => {
          for (var i = 0; i < res.result.data.length; i++) {
            if (res.result.data[i]._openid == app.globalData._openid) {
              app.globalData.collection = res.result.data[i].collection
              that.setData({integral:res.result.data[i].integral}) 
              return;
            }
          }
        }
      })
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
    else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    }else{
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfo: function (e) {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData._openid=res.result.openid
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true
        })
        if(this.data.userInfo==undefined){
          this.setData({hasUserInfo: false})
        }else{
          var that=this
          var num=0
          wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
              app.globalData._openid = res.result.openid
              app.globalData.openid = res.result.openid
              wx.setStorage({
                key:"openid",
                data:res.result.openid
              })
              for(var i=0;i<that.data.userList.length;i++){
                if (app.globalData._openid == that.data.userList[i]._openid){return;}
                else{num=num+1}
              }
              if (num == that.data.userList.length){
                const db = wx.cloud.database()
                db.collection('user').add({
                  data: {
                    npcset:[true,true],
                    nickName:that.data.userInfo.nickName,
                    collection: [],
                    works:[],
                    isisbuy:[],
                    diy:[],
                    integral:3000,
                    diy:[],
                    npc:[
                      {"npcid":"38d78ca75ed0e7890001e58278bc945a","buy":false,
                      "path":"https://6469-diandianhua-9krf5-1301722640.tcb.qcloud.la/newnpc/a/a1.png?sign=0f185e8d5d3795709f612df9dfee1e07&t=1590749166"
                      ,"icon":"8000","isbuy":false},
                      {"npcid":"38d78ca75ed10f5f0003efad4d10b5ef","buy":false,
                      "path":"https://6469-diandianhua-9krf5-1301722640.tcb.qcloud.la/newnpc/b/b1.png?sign=9eeb00e5ac2d9bf41697b2e9f9f29bda&t=1590759490"
                      ,"icon":"6000","isbuy":false},
                      {"npcid":"4c5846c75ed10f9f0003bd9d1ba2473e","buy":false,
                      "path":"https://6469-diandianhua-9krf5-1301722640.tcb.qcloud.la/newnpc/d/d1.png?sign=f9a64840b604e3c179efe4dc572d28cb&t=1590760054"
                      ,"icon":"4000","isbuy":false},
                      {"npcid":"4d5a19345ed10f9d0002e7fa37bbd756","buy":false,
                      "path":"https://6469-diandianhua-9krf5-1301722640.tcb.qcloud.la/newnpc/c/c1.png?sign=a1dc00146c64c1ca87e19f5bd122fb30&t=1590759979"
                      ,"icon":"6000","isbuy":false},
                      {"npcid":"e2297d935eb36e2d002bea242c03ed34","buy":false,
                      "path":"https://6469-diandianhua-9krf5-1301722640.tcb.qcloud.la/images/bqb/q4.png?sign=eecba006fa9db8344d49f915c1a90202&t=1589554896"
                      ,"icon":"8000","isbuy":false},
                      {"npcid":"5e847ab25eb36e27004059220e61c656","buy":false,
                      "path":"https://6469-diandianhua-9krf5-1301722640.tcb.qcloud.la/images/bing/j5.png?sign=b3101ba43d6596a81afbd8f6d97d171e&t=1589554476"
                      ,"icon":"6000","isbuy":false},
                      {"npcid":"aa9f906d5ebe7a5900da482e6828abe9","buy":true,
                      "path":"https://6469-diandianhua-9krf5-1301722640.tcb.qcloud.la/images/ele/x5.png?sign=3d099a09916c164f654b703edd8d1f7e&t=1589555077"
                      ,"icon":"0","isbuy":true},
                    ],
                  },
                })
              }
            }
          })
          this.onShow()
        }
      }
    })
  },

  NavChange(e) {
    this.setData({PageCur: e.currentTarget.dataset.cur})
  },
  
  jumpshop(e) {
    if(this.data.istLogin==false){
      this.setData({modalName: e.currentTarget.dataset.target})
    }else{
      wx.navigateTo({url: '/pages/MY/shop/shop'})
    }
  },

  jumpnpc(e) {
    if(this.data.istLogin==false){
      this.setData({modalName: e.currentTarget.dataset.target})
    }else{
      wx.navigateTo({url: '/pages/MY/npc/npc'})
    }
  },

  jumpsetting(e) {
    wx.navigateTo({url: '/pages/MY/setting/setting'})
  },

  jumpabout(e) {
    wx.navigateTo({url: '/pages/MY/about/about'})
  },

  jumpcollection(e) {
    if(this.data.istLogin==false){
      this.setData({modalName: e.currentTarget.dataset.target})
    }else{
      wx.navigateTo({url: '/pages/MY/collection/collection'})
    }
  },

  jumpdiy(e) {
    if(this.data.istLogin==false){
      this.setData({modalName: e.currentTarget.dataset.target})
    }else{
      wx.navigateTo({url: '/pages/MY/diy/diy'})
    }
  },

  jumpmoney(e) {
    if(this.data.istLogin==false){
      this.setData({modalName: e.currentTarget.dataset.target})
    }else{
      wx.navigateTo({url: '/pages/MY/money/money'})
    }
  },

  jumpworks(e) {
    if(this.data.istLogin==false){
      this.setData({modalName: e.currentTarget.dataset.target})
    }else{
      wx.navigateTo({url: '/pages/MY/works/works'})
    }
  },

  jumpans(e) {
    if(this.data.istLogin==false){
      this.setData({modalName: e.currentTarget.dataset.target})
    }else{
      wx.navigateTo({url: '/pages/MY/knowledge/knowledge'})
    }
  },

  game(e){
    if(this.data.istLogin==false){
      this.setData({modalName: e.currentTarget.dataset.target})
    }else{
      wx.navigateTo({url: '/pages/Game/game'})
    }
  },

  onShareAppMessage: (res) => {
    return {
      title: '涂鸦像素小程序',
      path: "/pages/MY/my",
    }
  },

  hideModal(e) {
    this.setData({modalName: null})
  },

  jumpnpcset(e) {
    wx.navigateTo({url: '/pages/MY/npcset/npcset'})
  },
  //弹框
  box(){
    this.setData({box:true})
  },
  certain(){
    this.setData({box:false})
  }
})