// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	return await db.collection(event.db).add({
		data: {
			drawname:event.drawname,
        	row     :event.row,
        	col     :event.col,
        	data    :event.data,
        	history :event.history,
			historyPath:event.historyPath,
			judge   :event.judge,
			tag     :event.tag,
            coin    :event.coin,
		}
	})
}