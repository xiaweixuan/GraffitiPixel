const app = getApp();
var util = require('../../utils/util.js'); 
var images = [];    //npc动态图片数组
var imgnum = 0;     //npc当前动态数组下标
var timer;          //npc运动时setInterval
var jump = [];      //npc跳跃时位置高度数组
var jumpnum = 0;    //npc跳跃时位置高度数组下标
var otimer;         //障碍物运动时setInterval
var nowIntegrtimer; //当前积分计算时setInterval

Page({
  data:{
    StatusBar: app.globalData.navHeight,//手机状态栏高度
    titnavHeight: app.globalData.navHeight+40,//得到手机导航栏高度
    screenHeight:app.globalData.screenHeight,//手机高度
    screenWidth: app.globalData.screenWidth,//手机宽度
    canvasHeight:null,//画布高度
    canvasWidth:null,//画布宽度
    gameHeight:null,//手机内容部分高度
    integrHeight:null,//画布上方高度
    tipHeight:null,//画布下方高度
    nowIntegr:0,//当前分数
    convertInter:0,//兑换积分
    roleName:'',//游戏角色名称
    rolex:0,
    roley:90,
    rolewh:90,//游戏人物位置
    roleminy:null,//游戏人物起跳前一次y的位置
    startShow:'block',//开始文字是否显示
    overShow:'none',//结束文字是否显示
    canvas:null,
    context:null,//画布
    obstaclex:0,
    obstacley:0,
    obstaclewh:50,//游戏障碍位置
    isStart:false,
    isOver:false,
    npcid:null,//角色id
    roleSrc:'',//角色展示图片
    roleJumpSrc:'',//角色跳跃图片
    roleObstacleSrc:''//角色撞击图片
  },
  
  getNpc:function(canvas,context){
    this.setData({load:true})
    let that = this;
    wx.cloud.callFunction({
      name: 'database',
      data: {database: 'user'},
      success: res => {
        let npcArr = res.result.data ; 
        for(let i = 0 ; i < npcArr.length ; i++){
          if(app.globalData._openid == npcArr[i]._openid){
            let npcMain = npcArr[i].npc;
            for(let j = 0 ; j < npcMain.length ; j++){
              if(npcMain[j].isbuy){
                that.setData({npcid:npcMain[j].npcid},()=>{
                  wx.cloud.callFunction({
                    name: 'database',
                    data: {database: 'npc'},
                    success: res => {
                      var npcarr = res.result.data;
                      images = [];
                      for(var i=0;i<npcarr.length;i++){
                        if(npcarr[i]._id==that.data.npcid){
                          that.setData({
                            roleSrc:npcarr[i].show,
                            roleName:npcarr[i].name,
                            roleJumpSrc:npcarr[i].jump1,
                            roleObstacleSrc:npcarr[i].bang
                          },()=>{
                            var img = canvas.createImage();
                            img.src = that.data.roleSrc;
                            img.onload = function(){
                              context.drawImage(img,that.data.rolex,that.data.roley,that.data.rolewh,that.data.rolewh);
                            }
                          })
                          for(let j = 0;j < npcarr[i].jump.length;j++){
                            images.push(npcarr[i].jump[j]);
                          }
                        }
                      }
                      setTimeout(()=> {
                        this.setData({load: false})
                      }, 1000)
                    }
                  })
                });
                break;
              }else continue;
            }
          }else continue;
        }
      }
    });
  },

  onShow:function(){
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
  },
  
  onReady(){
    let gameHeight = this.data.screenHeight-this.data.titnavHeight;
    let canvasHeight = gameHeight * 0.4;
    let canvasWidth = this.data.screenWidth;
    let integrHeight = gameHeight * 0.2;
    let tipHeight = gameHeight * 0.4;
    let roley = canvasHeight * 0.6;
    let rolewh = canvasHeight * 0.3;
    let obstaclex = canvasWidth + 50;
    let obstacley = canvasHeight * 0.77;
    let obstaclewh = canvasHeight * 0.13;
    this.setData({
      canvasHeight,canvasWidth,
      gameHeight,integrHeight,tipHeight,
      roley,rolewh,
      obstaclex,obstacley,obstaclewh
    });
    let jumpHight = canvasHeight * 0.5;
    let jumpHightmin = jumpHight / 9; 
    jump = [];
    for(let i = 0 ;i < 17;i++){
      if(i > 8)
      jump.push(Math.floor(roley-jumpHightmin*(16-i)));
      else
      jump.push(Math.floor(roley-jumpHightmin*i));
    }
    let that = this;
    const query = wx.createSelectorQuery()
    query.select('#myCanvas').fields({ node: true, size: true })
    .exec((res) => {
      const canvas = res[0].node;
      const context = canvas.getContext('2d');
      canvas.width = that.data.canvasWidth;
      canvas.height = that.data.canvasHeight;
      that.initGame(canvas,context);
      this.setData({
        context:context,
        canvas:canvas
      })
    })
  },
  
  initGame:function(canvas,context){
    this.getNpc(canvas,context);
  },

  role_run:function(){
    var that = this;
    timer = setInterval(function(){
      that.gameCollision();
      if(imgnum === images.length-1){
        imgnum = 0;
      }
      else{
        imgnum+=1;
      }
      var img = that.data.canvas.createImage();
      img.src = images[imgnum];
      img.onload = function(){
        that.data.context.clearRect(that.data.rolex,that.data.roley,that.data.rolewh,that.data.rolewh);
        that.data.context.drawImage(img,that.data.rolex,that.data.roley,that.data.rolewh,that.data.rolewh);
      }
    },100);
    
    clearInterval(otimer);
    otimer = setInterval(function(){
      if(that.data.obstaclex <= -that.data.obstaclewh){
        setTimeout(function(){
          that.setData({obstaclex:that.data.canvasWidth + 50});
        },1000);
      }else{
        var img = that.data.canvas.createImage();
        img.src = './img/obstacle.png';
        img.onload = function(){
          that.data.context.clearRect(that.data.obstaclex+10,that.data.obstacley,that.data.obstaclewh+10,that.data.obstaclewh+10);
          that.data.context.drawImage(img,that.data.obstaclex,that.data.obstacley,that.data.obstaclewh,that.data.obstaclewh);
        }
        that.setData({obstaclex:that.data.obstaclex-10});
        that.gameCollision();
      }
    },100);
  },
  role_jump:function(){
    clearInterval(timer);
    var that = this;
    timer = setInterval(function(){
      that.gameCollision();
      if(jumpnum === jump.length-1){
        jumpnum = 0;
      }
      else{
        jumpnum+=1;
      }
      that.setData({
        roley:jump[jumpnum],
        roleminy:jump[jumpnum-1]
      },()=>{
        var img = that.data.canvas.createImage();
        img.src = that.data.roleJumpSrc;
        img.onload = function(){
          that.data.context.clearRect(that.data.rolex,that.data.roleminy,that.data.rolewh,that.data.rolewh);
          that.data.context.drawImage(img,that.data.rolex,that.data.roley,that.data.rolewh,that.data.rolewh);
        }
      })
      if(jumpnum === jump.length-1){
        clearInterval(timer)
        that.setData({
          roley:that.data.canvasHeight * 0.6
        },()=>{
          that.role_run();
        })
      }
    },100);
  },
  gameStart:function(){
    var that = this;
    // 开始跑动
    this.role_run();

    // 开始结束文字显示
    this.setData({
      isStart:true,
      startShow:'none'
    });
    // 当前分数开始计算
    nowIntegrtimer = setInterval(function(){
      let nowIntegr = that.data.nowIntegr;
      let convertInter = that.data.convertInter;
      nowIntegr += 5;
      convertInter = nowIntegr/5
      that.setData({
        nowIntegr:nowIntegr,
        convertInter:convertInter
      });
    },100);
  },
  gameOver:function(){
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
				app.globalData._openid=res.result.openid
    var that = this;
    var theconvertInter = that.data.convertInter
				var uuu = app.globalData._openid
				wx.cloud.callFunction({
					name: 'database',
					data: {
					  database: 'user',//查询数据库
					},
					success: res => {
            var aaa = res.result.data
            for(var i=0;i<aaa.length;i++){
              if(aaa[i]._openid==uuu){             
                var finalconvertInter = aaa[i].integral+theconvertInter
                const db = wx.cloud.database()
                db.collection('user').doc(aaa[i]._id).update({
									data:{
										integral:finalconvertInter
									}
								})
              }
            }
					}
				})
		// 	}
    // })
    
    this.setData({
      startShow:'block',
      overShow:'none',
      obstaclex:that.data.canvasWidth + 50,
      rolex:0,
      roley:that.data.canvasHeight * 0.6,
      roleminy:null,
      nowIntegr:0,
      convertInter:0
    },()=>{
      that.data.context.clearRect(0,0,that.data.canvasWidth,that.data.canvasHeight);
      var img = that.data.canvas.createImage();
      img.src = that.data.roleSrc;
      img.onload = function(){
        that.data.context.drawImage(img,that.data.rolex,that.data.roley,that.data.rolewh,that.data.rolewh);
      }
    });
  }
})
  },
  gameCollision:function(){
    var that = this;
    let wmin = that.data.rolex,
        wmax = that.data.rolex+that.data.rolewh,
        hmin = that.data.roley,
        hmax = that.data.roley+that.data.rolewh;
    if( that.data.obstaclex > wmin &&
        that.data.obstaclex < wmax &&
        that.data.obstacley > hmin &&
        that.data.obstacley < hmax ){
        clearInterval(timer);
        clearInterval(otimer);
        clearInterval(nowIntegrtimer);
        that.data.context.clearRect(0,0,that.data.canvasWidth,that.data.canvasHeight);
        that.setData({overShow:'block',isOver:true,isStart:false});
      var img = that.data.canvas.createImage();
      img.src = that.data.roleObstacleSrc;
      img.onload = function(){
        that.data.context.drawImage(img,that.data.rolex,that.data.roley,that.data.rolewh,that.data.rolewh);
      }
      var img2 = that.data.canvas.createImage();
      img2.src = './img/obstacle02.png';
      img2.onload = function(){
        that.data.context.clearRect(that.data.obstaclex,that.data.obstacley,that.data.obstaclewh,that.data.obstaclewh);
        that.data.context.drawImage(img2,that.data.obstaclex-10,that.data.obstacley,that.data.obstaclewh,that.data.obstaclewh);
      }
    }
  },
  gameJump:function(){
    if(this.data.isStart)
      this.role_jump();
  },
  onShareAppMessage: (res) => {
    return {
      title: '涂鸦像素小程序',
      path: "/pages/Game/game"
    }
  },
})