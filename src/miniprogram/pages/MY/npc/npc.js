const app = getApp()
Page({
	data: {
		amount:1,
		percent:10,
		sum:0
	},
	
	onLoad: function (options) {
		this.setData({load:true})
		var that = this;
		wx.cloud.callFunction({
			name: 'database',
			data: {database: 'user'},
			success: res => {
				for (var i = 0; i < res.result.data.length; i++) {
					if (res.result.data[i]._openid == app.globalData._openid) {
						var number=0;
						for(var j =0;j<res.result.data[i].npc.length;j++){
							if(res.result.data[i].npc[j].buy){
								number++;
							}
						}
						that.setData({
							percent:parseInt((number*50)/3),
							sum:res.result.data[i].npc.length,
							amount:number
						})
						return;
          }
        }
      }
    })
	},

	showModal(e) {
		wx.cloud.callFunction({
			name: 'login',
			data: {},
			success: res => {
				// console.log('[云函数] [login] user openid: ', res.result.openid)
				app.globalData._openid=res.result.openid
				this.setData({loadModal:true})
				var npcidd = e.currentTarget.dataset.judge
				var that = this
				var iiid = app.globalData._openid
				wx.cloud.callFunction({
					name: 'database',
					data: {database: 'user'},
					success: res => {
						var iiidarr = res.result.data
						for(var i=0;i<iiidarr.length;i++){
							if(iiidarr[i]._openid==iiid){
								that.setData({qwe:i})
							}
						}
						const db = wx.cloud.database()
						for(var k=0;k<iiidarr[that.data.qwe].npc.length;k++){
							if(iiidarr[that.data.qwe].npc[k].npcid == npcidd){
								that.setData({qacb:k})
							}
						}
						db.collection('user').doc(iiidarr[that.data.qwe]._id).update({
							data:{
								['npc.'+[0]+'.isbuy']: false,
								['npc.'+[1]+'.isbuy']: false,
								['npc.'+[2]+'.isbuy']: false,
								['npc.'+[3]+'.isbuy']: false,
								['npc.'+[4]+'.isbuy']: false,
								['npc.'+[5]+'.isbuy']: false,
								['npc.'+[6]+'.isbuy']: false,
								['npc.'+[that.data.qacb]+'.isbuy']: true
							}
						})
						wx.setStorage({
							key:"npcid",
							data:npcidd
						})
						that.onShow()
						setTimeout(() => {
							that.setData({loadModal: false})
						}, 1000)
					}
				})	
			}
		})
	},
	
	onShow: function () {
		// 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
				console.log('[云函数] [login] user openid: ', res.result.openid)
				app.globalData._openid=res.result.openid
				var aa = []
				var isbuy=[]
				var that = this
				that.setData({aca:app.globalData._openid})
				wx.cloud.callFunction({
					name: 'database',
					data: {database: 'user'},
					success: res => {
						setTimeout(()=> {
							that.setData({load: false})
						}, 1000) 
						for(var i=0;i<res.result.data.length;i++){
							if(res.result.data[i]._openid==that.data.aca){
								var npc = res.result.data[i].npc
								for(var j=0;j<npc.length;j++){
									if(npc[j].buy==true){
										isbuy.push(npc[j])
										aa.push(npc[j].isbuy)
										that.setData({aa:aa,aka:isbuy})
									}
								}
							}
						}
					}
				})
				this.setData({
					page:'https://6469-diandianhua-9krf5-1301722640.tcb.qcloud.la/japimage/12.gif?sign=9e6797575df2c1b0f257fe393c050257&t=1590820157'
				});
			},
		})
	},
	
	onShareAppMessage: (res) => {
    return {
      title: '涂鸦像素小程序',
      path: "/pages/MY/npc/npc"
    }
  }
})