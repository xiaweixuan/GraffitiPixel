// miniprogram/pages/share/picture/picture.js
const app = getApp()
Page({
  data: {},
  onLoad: function(options) {
    var pic = app.globalData.drawing
    const query = wx.createSelectorQuery()
    query.select('#canvas').fields({
      node: true,
      size: true
    }).exec((res) => {
      var canvas = res[0].node;
      var context = canvas.getContext("2d")
      pic.context = context;
      pic.cellH = canvas.width / pic.col || 6;
      pic.cellW = canvas.height / pic.row || 3;
      pic.drawSene(pic, false)
    })
    
    const query2 = wx.createSelectorQuery()
    query2.select('#canvas2').fields({
      node: true,
      size: true
    }).exec((res) => {
      var canvas = res[0].node;
      var context = canvas.getContext("2d")
      pic.context = context;
      pic.cellH = canvas.width / pic.col || 6;
      pic.cellW = canvas.height / pic.row || 3;
      pic.greyShow(pic)
    })

    const query3 = wx.createSelectorQuery()
    query3.select('#canvas3').fields({
      node: true,
      size: true
    }).exec((res) => {
      var canvas = res[0].node;
      var context = canvas.getContext("2d")
      pic.context = context;
      pic.cellH = canvas.width / pic.col || 6;
      pic.cellW = canvas.height / pic.row || 3;
      pic.playback(pic)
    })
  },

  tocolordraw: function() {
    wx.navigateTo({url: '/pages/share/colordraw/colordraw'})
  }
})