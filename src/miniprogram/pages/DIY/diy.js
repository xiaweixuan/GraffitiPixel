// pages/DIY/DIY.js
Page({
  data: {
    top:0,
    istLogin:true,
  },
  onShow: function(){
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          this.setData({istLogin:true})
        }
        else{
          this.setData({istLogin:false})
        }
      }
    })
  },
  
  hideModal(e) {
    this.setData({modalName: null})
    wx.switchTab({url: '/pages/MY/my'});
  },
  
  hideModall(e) {
		this.setData({modalName: null})
  },

  tocreation:function(e){
    if(this.data.istLogin==false){
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    }else{
      wx.navigateTo({
        url:'../DIY/creation/creation', 
        success:function(){}
      })
    }
  },

  toconversion:function(e){
    if(this.data.istLogin==false){
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    }else{
      wx.navigateTo({
        url:'../DIY/conversion/conversion', 
        success:function(){}
      })
    }
  },

  onShareAppMessage: (res) => {
    return {
      title: '涂鸦像素小程序',
      path: "/pages/DIY/diy"
    }
  }
})