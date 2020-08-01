// pages/MY/shop/shop.js
const app = getApp()
Page({
	data: {
		grade:[],
		judge:''
	},
	back() {
		wx.navigateTo({url: '/pages/MY/my'})
	},
	onLoad: function (options) {
		this.setData({load:true})
	},
	showModal(e) {
		wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
				app.globalData._openid=res.result.openid
		this.setData({
			icon:e.currentTarget.dataset.icon
		})
		var icon = e.currentTarget.dataset.icon
		var that = this
		var iiid = app.globalData._openid
		wx.cloud.callFunction({
					name: 'database',
					data: {
					  database: 'user'
					},
					success: res => {
						var iiidarr = res.result.data
						for(var i=0;i<iiidarr.length;i++){
							if(iiidarr[i]._openid==iiid){
								if(iiidarr[i].integral<icon){
									that.setData({
										modalName: e.currentTarget.dataset.targett
									})
								}else{
									that.setData({
										judge:e.currentTarget.dataset.judge,
										modalName: e.currentTarget.dataset.target
									})
								}
							}
						}
					}
				})
			}
		})
	},

	hideModal(e) {
		this.setData({modalName: null})
	},

	check(e) {
		wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
				app.globalData._openid=res.result.openid
		this.setData({
			modalName: null,
			loadModal:true
		})
		var that = this
				var uuu = app.globalData._openid
				const db = wx.cloud.database();
				wx.cloud.callFunction({
					name: 'database',
					data: {database: 'user'},
					success: res => {
						var aaa = res.result.data
						for(var i=0;i<aaa.length;i++){
							if(aaa[i]._openid==uuu){
								that.setData({iidd:aaa[i]._id})
								var integral = aaa[i].integral
								const db = wx.cloud.database()
								db.collection('user').doc(that.data.iidd).update({
									data:{
										integral:aaa[i].integral-that.data.icon,
										['npc.'+[that.data.judge]+'.buy']: true
									}
								})
								that.onShow()
								setTimeout(() => {
									that.setData({loadModal: false})
								}, 1000)
							}
						}
					}
				})
			}
		})
	},

	onShow: function () {
		wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
				app.globalData._openid=res.result.openid
		var aa = []
		var that = this
		var uuu = app.globalData._openid
				wx.cloud.callFunction({
					name: 'database',
					data: {database: 'user'},
					success: res => {
						setTimeout(()=> {
							that.setData({load: false})
						}, 1000) 
						var aaa = res.result.data
						for(var i=0;i<aaa.length;i++){
							if(aaa[i]._openid==uuu){
								that.setData({aka:aaa[i].npc})
								for(var j=0;j<aaa[i].npc.length;j++){
									aa.push(aaa[i].npc[j].buy)
									that.setData({aa:aa})
								}
							}
						}
					}
				})
			}
		})
		this.setData({
			page:'https://6469-diandianhua-9krf5-1301722640.tcb.qcloud.la/japimage/14.gif?sign=504d34504939297a57c596020941b6cd&t=1590820367'
		});
	},
	
	onShareAppMessage: (res) => {
		return {
			title: '涂鸦像素小程序',
      path: "/pages/MY/shop/shop"
    }
  }
})