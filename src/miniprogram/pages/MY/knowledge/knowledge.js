// miniprogram/pages/MY/knowledge/knowledge.js
const app = getApp()
var id=require("../../data/json.js")
Page({
  data: {
    data:{},
    width:0,
    height:0,
    num:1,
    num1:1,
    right:false,
    choosenum:100,
    fraction:true,
    number:0,
    integral:0,
    cover:false,
  },
  
  onLoad: function (options) {
    var that=this
    var num=this.sum(1,99)
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
    this.setData({
      data:id.data[num],
      num:num
    })
  },
  sum(m,n){
    var num = Math.floor(Math.random()*(m - n) + n);
    return num;
  },
  
  choose(e){
    var number=this.data.number
    if(this.data.num1<10){
      this.setData({right:true,cover:true})
      var that=this
      var num1=this.data.num1+1
      var num=this.data.num+1
      if(e.currentTarget.dataset.id!==this.data.data.num){
        this.setData({choosenum:e.currentTarget.dataset.id})
      }else{
        this.setData({number:number+10})
      }
      setTimeout(function(){
        that.setData({
          num1:num1,
          num:num,
          data:id.data[num],
          choosenum:100,
          right:false,
          cover:false
        })
      },1000)
    }else if(this.data.num1=10){
      this.setData({right:true,cover:true})
      var that=this
      if(e.currentTarget.dataset.id!==this.data.data.num){
        this.setData({choosenum:e.currentTarget.dataset.id})
      }else{
        this.setData({number:number+10})
      }
      setTimeout(function(){
        that.setData({
          choosenum:100,
          right:false,
          fraction:false,
          cover:true
        })
      },1000)
    }
  },

  add(){
    const db = wx.cloud.database()
    db.collection('user').doc(app.globalData._id).update({
      data: {
        integral: parseInt(this.data.integral)+this.data.number
      }
    })
    wx.switchTab({url:'../my'})
  },
  
  onShow: function () {
    this.setData({
      page: 'https://6469-diandianhua-9krf5-1301722640.tcb.qcloud.la/answ/tab.png?sign=cdeb9b95ee9ae8834e6813e83ee0fe35&t=1590901159',
      back: 'https://6469-diandianhua-9krf5-1301722640.tcb.qcloud.la/answ/wb5.png?sign=f4453947dcb76bbed59f5a23579fe867&t=1590905777',
      icco: 'https://6469-diandianhua-9krf5-1301722640.tcb.qcloud.la/answ/ico.png?sign=7cba3410d0baf2d342df03120c93740d&t=1590906473'
    });
    wx.getSystemInfo({
      success:res=>{
        this.setData({
          width:res.windowWidth,
          height:res.windowHeight
        })
        if(this.data.height<800){
          console.log('qita')
          this.setData({
            width:res.windowWidth*0.9,
            height:res.windowHeight-70,
            left:res.windowWidth*0.9*0.2
          })
        }
        else{
          console.log('x')
          this.setData({
            width:res.windowWidth,
            height:res.windowHeight-120,
            left:res.windowWidth*0.15
          })
        }
      }
    })
  }
})