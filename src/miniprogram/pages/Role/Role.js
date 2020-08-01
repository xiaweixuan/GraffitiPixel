const app = getApp();
var npcSay = require("../data/json");
var npcSayArr = [];
for(let i = 0 ;i<npcSay.data.length;i++){
  npcSayArr.push(npcSay.data[i].npcsay);
}

var num = 0;
var roleArr = [];
var roleTimer;
var roleMoveTimer;
var timer;

Component({  
  options: {  
    multipleSlots: true // 在组件定义时的选项中启用多slot支持  
  },
  /**
   * 生命周期
   */ 
  pageLifetimes: {
    show:function(){
      let that = this;

      // 登陆前npc不显示，登陆后显示
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            that.setData({
              isDisplay:'block'
            })
          }
          else{
            that.setData({
              isDisplay:'none'
            })
          }
        }
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
              let npcMain = npcArr[i].npc;
              that.setData({
                userid:npcArr[i]._id,
                isnpcSay:npcArr[i].npcset[0]
              });
              if(npcArr[i].npcset[0]){
                that.setData({
                  npcSayDisplay:'block'
                });
              }else{
                that.setData({
                  npcSayDisplay:'none'
                });
              }
              // if(npcArr[i].npcset[1]){
              //   that.setData({
              //     npcDisplay:'block'
              //   });
              // }else{
              //   that.setData({
              //     npcDisplay:'none'
              //   });
              // }
              for(let j = 0 ; j < npcMain.length ; j++){
                if(npcMain[j].isbuy){
                  that.setData({
                    npcid:npcMain[j].npcid
                  },()=>{
                    wx.cloud.callFunction({
                      name: 'database',
                      data: {
                        database: 'npc',
                      },
                      success: res => {
                        var npcarr = res.result.data;
                        for(var i=0;i<npcarr.length;i++){
                          if(npcarr[i]._id==that.data.npcid){
                            that.setData({roleSrc:npcarr[i].show},()=>{
                              var query = that.createSelectorQuery()
                              query.select('.roleCanvas')
                              .fields({ node: true})
                              .exec((res) => {
                                const canvas = res[0].node;
                                const context = canvas.getContext('2d');
                                canvas.width = that.data.canvasWidth;
                                canvas.height = that.data.canvasHeight;
                                this.setData({
                                  context:context,
                                  canvas:canvas
                                });
                                var img = canvas.createImage();
                                img.src = that.data.roleSrc;
                                img.onload = function(){
                                  that.data.context.clearRect(0,0,that.data.canvasWidth,that.data.canvasHeight);
                                  context.drawImage(img,0,0,that.data.canvasWidth,that.data.canvasHeight);
                                }                
                              })
                            })
                            roleArr = npcarr[i].npc;
                            roleMoveTimer = Math.floor(3000 / npcarr[i].npc.length);
                          }
                        }
                      },
                      fail: err => {
                        
                      }
                    });
                  });
                  break;
                }else continue;
              }
            }else continue;
          }
        },
        fail: err => {
          
        }
      });    
    } 
    
  },  
  /** 
   * 组件的初始数据 
   */  
  data: {
    // string:'美术基本语言元素包括点、线、面、色，任何美术种类的任何语言表达方式都是在这础上形成和演化来的',
    string:'欢迎来到涂鸦像素世界！',
    roleSrc:'',
    npcid:null,
    isDisplay:'none',//未登录时不显示
    npcSayDisplay:'block',//npc气泡是否显示
    // npcDisplay:'block',//npc是否显示
    canvas:null,
    context:null,//画布
    canvasWidth:'100',
    canvasHeight:'100',
    isnpcSay:null,
    userid:null
  },  
  /** 
   * 组件的方法列表 
   */  
  methods: {  
    stringChage:function(){
      let that = this;
      roleTimer = setInterval(function(){
        that.setData({string:npcSayArr[num]});
        num = Math.floor(Math.random() * npcSayArr.length);
      },8000);
    },
    onclick:function(){
      let that = this;
      const db = wx.cloud.database();
      clearTimeout(timer);
      timer = setTimeout(()=>{
        that.npcChage(that.data.canvas,that.data.context)
      },500);
      console.log(that.data.isnpcSay);
      if(that.data.isnpcSay){
        that.setData({npcSayDisplay:'none',isnpcSay:false});
        db.collection('user').doc(that.data.userid).update({
          data: {
            npcset:[false,true]
          }
        });
      }else{
        that.setData({npcSayDisplay:'block',isnpcSay:true});
        db.collection('user').doc(that.data.userid).update({
          data: {
            npcset:[true,true]
          }
        });
      }
    },
    npcChage:function(canvas,context){
      let that = this;
      let roleNum = 0;
      let time = setInterval(function(){
        if(roleNum === roleArr.length){
          clearInterval(time);
          var img = canvas.createImage();
          img.src = that.data.roleSrc;
          img.onload = function(){
            that.data.context.clearRect(0,0,that.data.canvasWidth,that.data.canvasHeight);
            context.drawImage(img,0,0,that.data.canvasWidth,that.data.canvasHeight);
          }
        }else{
          var img = canvas.createImage();
          img.src = roleArr[roleNum];
          img.onload = function(){
            that.data.context.clearRect(0,0,that.data.canvasWidth,that.data.canvasHeight);
            context.drawImage(img,0,0,that.data.canvasWidth,that.data.canvasHeight);
          }
          roleNum++;
        }
      },roleMoveTimer)
    }
  } , 
  attached:function(){
    this.stringChage();
  }
})