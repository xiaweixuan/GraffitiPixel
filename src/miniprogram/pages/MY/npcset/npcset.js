const app = getApp();

Page({
	data:{
		userid:null,
		isnpcsay:true,
		isnpc:true
	},
	onShow: function () {
		let that = this;
		this.setData({
			page:'https://6469-diandianhua-9krf5-1301722640.tcb.qcloud.la/japimage/3.gif?sign=7d3c92af561708a8cd922d10dd65a93a&t=1590819950'
		});
		wx.cloud.callFunction({
			name: 'database',
			data: {
				database: 'user',
			},
			success: res => {
				let npcArr = res.result.data ; 
				for(let i = 0 ; i < npcArr.length ; i++){
					if(app.globalData._openid == npcArr[i]._openid){
						that.setData({
							userid:npcArr[i]._id,
							isnpcsay:npcArr[i].npcset[0],
							isnpc:npcArr[i].npcset[1]
						});
					}
				}
			}
		})
	},
	npcSayFun:function(e){
		let that = this;
		let isnpcSay = e.detail.value;
		const db = wx.cloud.database();
		if(isnpcSay){
			that.setData({isnpcsay:true,isnpc:true});
			db.collection('user').doc(that.data.userid).update({
				data: {
					npcset:[true,true]
				}
			});
		}else{
			that.setData({isnpcsay:false,isnpc:true});
			db.collection('user').doc(that.data.userid).update({
				data: {
					npcset:[false,true]
				}
			});
		}
    
  },
	npcFun:function(e){
		let that = this;
		let isnpc = e.detail.value;
		const db = wx.cloud.database();
		if(isnpc){
			that.setData({isnpcsay:true,isnpc:true});
			db.collection('user').doc(that.data.userid).update({
				data: {
					npcset:[true,true]
				}
			});
		}else{
			that.setData({isnpcsay:false,isnpc:false});
			db.collection('user').doc(that.data.userid).update({
				data: {
					npcset:[false,false]
				}
			});
		}
  }
})