// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	if(event.diy){
		await db.collection(event.database).doc(event._id).update({
			data: {
				diy: _.push([event.diy])
			}
		})
	}
	if(event.collection){
		await db.collection(event.database).doc(event._id).update({
			data: {
				collection: _.push([event.collection])
			}
		})
	}
	if(event.works){
		await db.collection(event.database).doc(event._id).update({
			data: {
				works: _.push([event.works])
			}
		})
	}
	if(event.npc){
		await db.collection(event.database).doc(event._id).update({
			data: {
				npc: _.push([event.npc])
			}
		})
	}
	if(event.isisbuy){
		await db.collection(event.database).doc(event._id).update({
			data: {
				isisbuy: _.push([event.isisbuy])
			}
		})
	}
}