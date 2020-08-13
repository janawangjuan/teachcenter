$(function () {

  // 暂停
  $('.js-play-video').on('click', function(){
    if($(this).hasClass('active')){
      $(this).removeClass('active');
      player_resume(window.ZBGVideo.ccid);
    }else{
      $(this).addClass('active');
      player_pause(window.ZBGVideo.ccid);
    }
  })
  // 倍速
  $('.control-timeSpeed-item').on('click', function () {
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    $(this).parent().hide();
  })
  // 控制条移入移出效果
  $('.control-hover').hover(function () {
    $(this).find('.control-hover-connect').show();
  }, function () {
    $(this).find('.control-hover-connect').hide();
  })

  // 音量
  $("#control-volume-slider").slider({
    orientation: "vertical",
    range: "min",
    min: 0,
    max: 100,
    value: 60,
    slide: function (event, ui) {
      $(".control-volume-value").text(ui.value + '%');
    },
    change: function (event, ui) {
      $(this).parents('.control-hover-connect').hide();
      player_volume(window.ZBGVideo.ccid, ui.value/100)
    },
  });
  $("#control-volume-value").text($("#control-volume-slider").slider("value") + '%');
  // 全屏
  // $("#control-screen-slider").slider({
  //   orientation: "vertical",
  //   range: "min",
  //   min: 0,
  //   max: 100,
  //   value: 60,
  //   slide: function (event, ui) {
  //     $(".control-screen-value").text(ui.value + '%');
  //   },
  //   change: function (event, ui) {
  //     $(this).parents('.control-hover-connect').hide();
  //   },
  // });
  // $("#control-screen-value").text($("#control-screen-slider").slider("value") + '%');

  // 全屏
  window.onresize = function(){
    var isfull = $('#zbg-video').isfull();
    if(isfull){

    }else{
      $('#zbg-video').removeClass('fullScreen')
    }
  }
  $('.js-full-screen').on('click', function(){
    $('#zbg-video').togglefull(function(isfull){
      if(isfull){
        $('#zbg-video').addClass('fullScreen')
      }else{
        $('#zbg-video').removeClass('fullScreen')
      }
    });
  })
  // 选择错误类型
  $('.js-select-click').on('click', function(){
    var that = $(this);
    if(that.hasClass('active')){
      that.removeClass('active');
      that.next().hide();
    }else{
      that.addClass('active');
      that.next().show();
    }
  })
  // 错误类型
  $('.sidebar-option-li').on('click', function(){
    $('.js-select-click').removeClass('active');
    $('.js-select-click').text($(this).text())
    ZBGVideo.cmptType = $(this).text();
    $(this).parent().hide();
  })
  // 关闭侧边栏
  $('.sidebar-close').on('click', function(){
    hideSidebar();
    // player_resume(window.ZBGVideo.ccid);
  })
  // 控制条打开侧边栏按钮
  $('.js-sidebar-btn').on('click', function(){
    var that = $(this);
    var type = that.attr('type');
    ZBGVideo.type = type;
    var parent = that.parent();

    if(parent.hasClass('active')){
      parent.removeClass('active');
      hideSidebar();
      // player_resume(window.ZBGVideo.ccid);
    }else{
      // 重置提交数据
      reloadSubmitData();
      parent.siblings().removeClass('active');
      parent.addClass('active');
      $('.sidebar-btn-video').text(ZBGVideo.progressFormat);
      player_pause(window.ZBGVideo.ccid);
      // toggerClassName('sidebar');
      $('.js-player-list-btn').removeClass('active');
      $('#zbg-video').removeClass('playerList')
      ZBGVideoDom.addClass("sidebar");
      $('.sidebar-nav-item').removeClass('active');
      $('.sidebar-nav-'+type).addClass('active');
      $('.sidebar-body').removeClass('show');
      $('.sidebar-body-'+type).addClass('show');
    }
  })
  // 侧边栏导航
  $('.sidebar-nav-item').on('click', function(){
    // 重置提交数据
    reloadSubmitData();
    var that = $(this);
    var type = that.attr('type');
    ZBGVideo.type = type;
    that.siblings().removeClass('active');
    that.addClass('active');
    $('.sidebar-body').removeClass('show');
    $('.sidebar-body-'+type).addClass('show');
  })
  // 播放列表
  $('.js-player-list-btn').on('click', function(){
    var that = $(this);
    if(that.hasClass('active')){
      that.removeClass('active');
      // player_resume(window.ZBGVideo.ccid);
      $('#zbg-video').removeClass('playerList')
    }else{
      that.addClass('active')
      // player_pause(window.ZBGVideo.ccid);
      $(".js-control-sidebar").removeClass("active");
      $('#zbg-video').removeClass('sidebar')
      //$('#zbg-video').addClass('playerList')  //暂时屏蔽右侧列表
    }
  })
  // 上一个视频
  $('.js-play-prev').on('click', function(){
    // var playPrev = $('.js-play-change.active').prev('.js-play-change');
    var playList = $('.js-play-change');
    var playActive = $('.js-play-change.active');
    var playIndex = playActive.data('taskindex');

    if(+playIndex){
      playActive.removeClass('active')
      var playPrev = playList.eq(playIndex-1);
      if(playPrev.length){
        playPrev.addClass('active')
        ZBGVideo.action = "playprev";
        saveTaskProgress();
        playPrev.eq(0).trigger('click');
      }
    }

  })

  // 下一个视频
  $('.js-play-next').on('click', function(){
    var playList = $('.js-play-change')
    var playActive = $('.js-play-change.active');
    var playIndex = playActive.data('taskindex');
    if(+playIndex < (playList.length-1)){
      playActive.removeClass('active')
      var playNext = playList.eq(playIndex+1);
      if(playNext.length){
        playNext.addClass('active')
        ZBGVideo.action = "playnext";
        saveTaskProgress();
        playNext.eq(0).trigger('click');
      }
    }

  })
  // 刷新视频
  $('.js-play-refresh').on('click', function(){
    ZBGVideo.action = "playrefresh";
    saveTaskProgress();
    $("#control-time").text(formatSeconds(0) + "/" + ZBGVideo.videoTimeFormat);
    $('.js-play-change.active').trigger('click');
  })
  // 切换视频
  $('.js-play-change').on('click', function(){
    var playList = $('.js-play-change')
    var that = $(this);
    var thatData = that.data();
    // store.set('taskData', thatData)
    ZBGVideo.action = "playchange";
    saveTaskProgress();
    playList.removeClass('active');
    that.addClass('active');
    // return ;
    // if(ZBGVideo.courseType == 'livelesson'){
    //   reloadVideoData();
    //   ZBGVideo.liveId = thatData.liveid;
    //   ZBGVideo.ccid = thatData.ccid;
    //   ZBGVideo.siteid = thatData.siteid;
    //   on_cc_player_init(thatData.ccid, "cc_"+thatData.ccid)
    // }else{
      clickTaskLink(window.top.location, thatData, function(taskLink){
        console.log(taskLink)
        window.top.location.href = taskLink;
        window.top.location.reload();
      });
    // }


    // reloadVideoData();
    // ZBGVideo.ccid = thatData.ccid;
    // ZBGVideo.siteid = thatData.siteid;

    // on_cc_player_init(thatData.ccid, "cc_"+thatData.ccid)
    // video:
    // http://ilearningdemo.zbgedu.com/#/video?courseId=42f1d3076bcd8a1403eb5733e1a155c9&taskId=a42a44f15df21a9becb2eca69764acd8&classId=undefined&chapterName%E7%AC%AC%E4%B8%80%E8%8A%82&chapterId6d412bd66e513a2614901acd5a9664a2&courseType=flipped
    // live:
    // exam:
    // var href = window.top.location.href.split('?')[0];
    // var queryObj =  getQueryObj(window.top.location.href);
    // queryObj.taskId = thatData.taskid;
    // var query = setQuery(queryObj)
    // console.log(href + query)
    // window.top.location.href = href + query;
  })
  // 刷新页面
  $('.js-play-reload').on('click', function(){
    window.location.reload();
  })
});
