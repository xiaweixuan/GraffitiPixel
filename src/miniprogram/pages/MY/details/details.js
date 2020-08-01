// pages/MY/details/details.js
var util = require('../../../utils/util.js'); 
Page({
	onShow: function () {
		var time = util.formatTime(new Date());
		this.setData({time: time});
		if(this.data.time>18||this.data.time<4){
      this.setData({
        page:'https://6469-diandianhua-9krf5-1301722640.tcb.qcloud.la/japimage/25.gif?sign=9b56e7de487b60c6a2087f9fc1b61a07&t=1590686036'
      });
    }else{
      this.setData({
        page:'https://6469-diandianhua-9krf5-1301722640.tcb.qcloud.la/japimage/4.gif?sign=6e8b393c932051e1d843fb2ade59e874&t=1590686086'
      });
    }
	}
})