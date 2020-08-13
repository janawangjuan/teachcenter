/*
  接口名称	功能描述	类型
  start()	开始播放	方法
  pause()	暂停播放	方法
  resume()	恢复播放	方法
  seek(time)	定位至指定时间，参数time（单位：秒）	方法
  getDuration()	获取视频片长（单位：秒）	方法
  getPosition()	获取当前播放时间（单位：秒）	方法
  getQualities()	获取当前视频可⽤清晰度列表
  返回类型：Array
  eg. [{value:"0",label:"普通"},{value:"1",label:"清晰"}]	方法
  setQuality(quality)	设置清晰度
  参数 quality 为 getQualities 方法获取的 value 值	方法
  setVolume(volume)	设置音量
  参数volume取值范围：[0-1]. eg. setVolume(0.5)	方法
  normalScreen()	退出全屏	方法
  setConfig(config)	配置播放器
  参数config为配置对象，详细参照播放器配置	方法
  on_cc_player_init(vid,objectId)	初始化播放器界面元素
  vid : 视频ID
  objectId：页面中播放器的id值	回调
  fast_forward_time(speed)	设置快进快退速度
  参数 speed 取值[0-1]时为百分比跳转，大于1时为值跳转
  eg.fast_forward_time(3)	方法
*/

/*
  配置项	功能描述
  control_enable	是否显示控制条
  0, 不显示；1, 显示；默认值为1
  progressbar_enable	是否可操作进度条
  0, 不可操作；1, 可操作；默认值为1
  loadingpic_enable	是否启用缓冲片头
  0, 不启用；1, 启用；默认值为1
  loading_enable	是否显示loading图标
  0, 不显示；1, 显示；默认值为1
  bigbutton_enable	是否显示非自动播放是播放器中间的开始按钮
  0, 不显示；1, 显示；默认值为1
  tip_enable	是否可显示播放器顶部的提示条
  0,不显示；1, 显示；默认值为1
  alert_enable	是否可显示播放器中间的提示面板
  0, 不显示；1, 显示；默认值为1
  recommend_enable	是否启用播放结束后的推荐界面
  0, 不启用；1, 启用；默认值为1
  keyboard_enable	是否启用按键操作
  0, 不启用；1, 启用；默认值为1
  rightmenu_enable	是否启用右侧菜单
  0, 不启用；1, 启用；默认值为1
  fullscreen_enable	是否使用自定义全屏操作
  默认0，设置为1可以替代Flash全屏
  fullscreen_function	替代Flash全屏的JS函数的名称，这个函数需要返回一个值以确定当前状态（0, 正常；1,全屏）
  注：使用此配置需将fullscreen_enable值设置为1
  player_plugins	配置播放器插件，详见 插件介绍
  on_player_stop	播放结束后回调JS函数的名称，默认为 on_spark_player_stop
  on_player_pause	暂停播放时回调JS函数的名称，默认为 on_spark_player_pause
  on_player_resume	暂停后继续播放时回调JS函数的名称，默认为 on_spark_player_resume
  on_player_ready	播放器准备就绪回调JS函数的名称，默认为 on_spark_player_ready
  on_player_start	开始播放时回调JS函数的名称，默认为 on_spark_player_start
  on_player_seek	拖动播放时回调JS函数的名称。回调函数的参数：from,to
  from, 定位之前的时间点（单位 秒）；to, 定位指定的时间点（单位 秒）
  on_player_buffering	缓冲开始或结束时回调JS函数的名称，回调函数的参数：flag
  flag, 是否缓冲中； 取值：0, 否；1, 是
  on_player_setquality	清晰度改变时回调JS函数的名称。回调函数的参数：quality
  quality, 当前清晰度；取值：0, 普通；1, 清晰；2, 高清
  on_player_volumechange	音量改变时回调JS函数的名称。回调函数的参数：vol
  vol, 当前音量；取值范围：0－1
  on_player_playerror	当播放失败时回调JS函数的名称。回调函数的参数：错误码
  on_player_fullscreen	全屏或退出全屏时回调JS函数的名称。回调函数的参数：flag
  flag, 是否全屏；取值：0, 否；1, 是
*/

// 初始化播放器界面元素
function on_cc_player_init(vid, objectId) {
  console.log('playinit',vid, objectId)
  var ccPlayer = getSWF(objectId); // 要在回调之后赋值
  var config = {
    control_enable: 0,
    progressbar_enable: 0,
    bigbutton_enable: 0,
    tip_enable: 0,
    alert_enable: 0,
    keyboard_enable: 1,
    rightmenu_enable: 0,
    fullscreen_enable: 1,
    fullscreen_function: "zbgFullScreen",
    on_player_start: "zbgPlayerStart",
    on_player_pause: "zbgPlayerPause",
    on_player_resume: "zbgPlayerResume",
    on_player_stop: "zbgPlayerStop",
    on_player_seek: "zbgPlayerSeek",
    on_player_volumechange: "zbgPlayerVolumechange",
    on_player_playerror: "zbgPlayerPlayerror"
  }; // 配置信息
  ccPlayer.setConfig(config); //设置配置信息接口;

  ccPlayer.fast_forward_time(5);
  ZBGVideo.videoTime = ccPlayer.getDuration();
  ZBGVideo.videoTimeFormat = formatSeconds(ZBGVideo.videoTime);

  ZBGVideo.total = ZBGVideo.videoTime;

  // 跳转
  // player_seek(videoCcid, ZBGVideo.seek);
  // 进度
  $('#control-progress-slider').slider({
    orientation: "horizontal",
    range: "min",
    min: 0,
    max: ZBGVideo.videoTime,
    value: ZBGVideo.seek,
    slide: function (event, ui) {
      // $(".control-volume-value").text(ui.value + '%');
      $("#control-time").text(formatSeconds(ui.value) + "/" + ZBGVideo.videoTimeFormat);
    },
    change: function (event, ui) {
      // player_volume(window.ZBGVideo.ccid, ui.value/100)

      if(ui.value < ZBGVideo.videoTime){
        $("#control-time").text(formatSeconds(ui.value) + "/" + ZBGVideo.videoTimeFormat);
        // console.log(event.currentTarget, event)
        if(event.currentTarget){
          ZBGVideo.progress = ui.value;
          ZBGVideo.progressFormat = formatSeconds(ui.value);
          player_seek(window.ZBGVideo.ccid, ui.value);
        }
      }
      // player_seek(window.ZBGVideo.ccid, ui.value);
    },
  });
  if(ZBGVideo.courseType == 'livelesson'){
    $('#zbg-video').attr("class", 'zbg-video livelesson')
  }else{
    //$("#zbg-video").attr("class","zbg-video playerList");
    $("#zbg-video").attr("class","zbg-video");
  }

  $("#control-time").text(formatSeconds(ccPlayer.getPosition()) + "/" + ZBGVideo.videoTimeFormat);
  $(".zbg-video-control").addClass("show");
  ZBGVideo.action = "beginplay";
  saveTaskProgress();

  // ccPlayer.start(); //开始播放（要在on_cc_player_init方法被调用之后执行,其他方法同理）
  clearInterval(ZBGVideo.playerTimer);
  startPlayerTimer(ZBGVideo.ccid);
  setTimeout(function(){
    player_play(ZBGVideo.ccid)
  })
}
// 开始计时器
function startPlayerTimer(id) {

  ZBGVideo.playerTimer = setInterval(function() {
    ZBGVideo.studyTime++;
    var player = getSWF("cc_" + ZBGVideo.ccid);
    // player.start();
    ZBGVideo.progress = parseInt(player.getPosition());
    ZBGVideo.progressFormat = formatSeconds(ZBGVideo.progress);
    // console.log(ZBGVideo.progress, ZBGVideo.videoTime)
    $("#control-progress-slider").slider("value", ZBGVideo.progress)
    $("#control-time").text(ZBGVideo.progressFormat + "/" + ZBGVideo.videoTimeFormat);

    store.set('progress', ZBGVideo.progress)
    var progressPercentage = (ZBGVideo.progress/ZBGVideo.videoTime)*100;
    if(progressPercentage >= 95){
      ZBGVideo.state = 1;
    }
    if (ZBGVideo.progress >= ZBGVideo.videoTime) {

      clearInterval(ZBGVideo.playerTimer);
    }
    // 心跳
    if (ZBGVideo.timer >= ZBGVideo.timerTotal) {
      ZBGVideo.timer = 0;
      saveTaskProgress();
    } else {
      ZBGVideo.timer++;
    }
  }, 1000);
}
// 暂停计时器
function stopPlayerTimer() {
  clearInterval(ZBGVideo.playerTimer);
}
/* cc api */
var prefix = "cc_";
function player_play(id) {
  // 开始播放
  var player = getSWF(prefix + id);
  player.start();
}

function player_pause(id) {
  // 暂停播放
  var player = getSWF(prefix + id);
  player.pause();
}

function player_resume(id) {
  // 恢复播放
  var player = getSWF(prefix + id);
  player.resume();
}

function player_current(id) {
  // 获取当前播放时间
  var player = getSWF(prefix + id);
  var position = parseInt(player.getPosition());
  // $("#display_info").html("<strong>接口</strong>：getPosition()."
  // 		+ "&nbsp;<strong>当前播放时间</strong>：<span style='color:#5CB85C;'>" + player.getPosition() + "</span> s.");
  return position;
}

function player_seek(id, progress) {
  console.log('player_seek')
  // 拖动播放
  var player = getSWF(prefix + id);
  player.seek(progress);
}

function player_volume(id, num) {
  // 设置音量[0-1]
  var player = getSWF(prefix + id);
  player.setVolume(num);
}
function on_player_fullscreen() {
  console.log("on_player_fullscreen");
}

/* 自定义事件 */
// 播放开始
function zbgPlayerStart() {
  // ccPlayer.seek(ZBGVideo.seek);
  console.log('playstart')
  player_seek(ZBGVideo.ccid, ZBGVideo.seek)
  ZBGVideo.videoTime = ccPlayer.getDuration();
  ZBGVideo.videoTimeFormat = formatSeconds(ZBGVideo.videoTime);
  $("#zbg-video").removeClass("playfinish");
  $("#control-time").text(
    formatSeconds(ccPlayer.getPosition()) + "/" + ZBGVideo.videoTime
  );
  $(".zbg-video-control").addClass("show");

  // startPlayerTimer(ZBGVideo.ccid);
}
// 播放结束
function zbgPlayerStop() {
  console.log('playfinish')
  $(".play-video").addClass("active");
  $("#zbg-video").addClass("playfinish");
  ZBGVideo.action = "playfinish";
  saveTaskProgress();
  if(!$('.js-player-list-btn').hasClass('hide')){
    $('.js-player-list-btn').trigger('click');
  }

}
// 暂停
function zbgPlayerPause() {
  // 重置提交数据
  reloadSubmitData();
  stopPlayerTimer();
  $(".play-video").addClass("active");
  $(".js-video-pause").addClass("active");
  ZBGVideo.action = "stop";
  saveTaskProgress();
}
// 恢复播放
function zbgPlayerResume() {
  // 重置提交数据
  reloadSubmitData();
  startPlayerTimer(ZBGVideo.ccid);
  $(".play-video").removeClass("active");
  $(".js-video-pause").removeClass("active");
  $("#zbg-video").removeClass("playerList");
  $(".js-control-sidebar").removeClass("active");
  hideSidebar();
  ZBGVideo.action = "playresume";
  saveTaskProgress();

}
// 推拽播放
function zbgPlayerSeek(){
  console.log('seek')
  ZBGVideo.action = "seek";
  saveTaskProgress();
}
// 音量改变
function zbgPlayerVolumechange(){
  // ZBGVideo.action = "volumechange";
  // saveTaskProgress();
}
// 播放失败
function zbgPlayerPlayerror(){
  ZBGVideo.action = "playerror";
  saveTaskProgress();
  $("#zbg-video").addClass("playerror");
}
// 全屏
function zbgFullScreen() {
  openFullscreen(document.getElementById("zbg-video"));
  $("#zbg-video").addClass("fullScreen");
  ZBGVideo.action = "fullscreen";
  saveTaskProgress();
}


function getSWF(objectId) {
  if (window.document[objectId]) {
    return window.document[objectId];
  } else if (navigator.appName.indexOf("Microsoft") == -1) {
    if (document.embeds && document.embeds[objectId]) {
      return document.embeds[objectId];
    }
  } else {
    return document.getElementById(objectId);
  }
}
