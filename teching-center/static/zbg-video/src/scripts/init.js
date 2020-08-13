/*
   * url: http://localhost:3000/index.html?ccid=313A5C7994F57292&seek=22
   * eg: //p.bokecc.com/flash/player.swf?vid=313A5C7994F57292&siteid=07552B247EACAED4&playerid=55295D704B531A0D&playertype=1&autoStart=false&mediatype=1

   */
window.createVideoPlayer = function() {
  // ZBGVideo.ccid = '313A5C7994F57292'
  var palyerUrl =
    "//p.bokecc.com/player?vid=" +
    ZBGVideo.ccid +
    "&siteid=" +
    ZBGVideo.siteid +
    "&autoStart=true&width=100%&height=100%&playerid=cc_" +
    ZBGVideo.ccid +
    "&playertype=1";
  createScript(palyerUrl, "zbg-video-player");
};

window.ZBGVideo = {
  origin: window.top.location.hostname == "ilearningdemo.zbgedu.com" ? "https://apidemo.zbgedu.com": "https://api.zbgedu.com",
  originAction: window.top.location.hostname == "ilearningdemo.zbgedu.com" ? "https://actiondemo.zbgedu.com": "https://action.zbgedu.com",
  originTiku: window.top.location.hostname == "ilearningdemo.zbgedu.com" ? "https://tikudemo.zbgedu.com": "https://tiku.zbgedu.com",
  // //ilearning.zbgedu.com/upload/userAction/scene/mobileIndex/queryExamenInfo?token=0e0a8a0e-75cd-41ea-be71-aced8afeccd1&examenId=80d78c4906a144e894e4f7d4ff48f76c&courseId=0500696d731ad5607b77cffd5553b52b
  // //ilearning.zbgedu.com/apiNew
  originNew: window.top.location.hostname == "ilearningdemo.zbgedu.com" ? "https://ilearningdemo.zbgedu.com": "https://ilearning.zbgedu.com",

  isDemo: window.top.location.port ? true : false,
  // isDemo: false,
  demoCcid: "313A5C7994F57292",
  demoTaskId: "d7e956e04caeaa98f88f91ceecae61f9",
  clientType: "pc",
  seek: GetQueryString("seek"),
  ccid: GetQueryString("ccid"),
  siteid: GetQueryString("siteid"),
  timer: 0,
  timerTotal: 120,
  action: "", //
  state: 0, // 视频是否完成
  progress: 0,
  progressFormat: "00:00",
  videoTime: 0,
  videoTimeFormat: "00:00",
  studyTime: 1,

  source_path: "",
  title: "",
  content: "",
  isPublic: false,
  cmptType: "",
  playerTimer: "",
  taskIndex: 0,
  courseType: GetQueryString("courseType"),
  token: GetQueryString("token"),
  memberId: GetQueryString("memberId"),
  memberName: GetQueryString("memberName"),
  phone: GetQueryString("phone"),

  categoryId: GetQueryString("categoryId"),
  categoryName: GetQueryString("categoryName"),
  subjectId: GetQueryString("subjectId"),
  subjectName: GetQueryString("subjectName"),
  classId: GetQueryString("classId") || 0,
  courseId: GetQueryString("courseId"),
  courseName: GetQueryString("courseName"),
  chapterId: GetQueryString("chapterId"),
  chapterName: GetQueryString("chapterName"),
  taskId: GetQueryString("taskId"),
  taskName: GetQueryString("taskName"),
  isSidebar: GetQueryString("isSidebar"),

  testPaperName: GetQueryString("testPaperName"),
  isParsing: GetQueryString("isParsing"),
  isParsingOfError: GetQueryString("isParsingOfError"),
  itemId: GetQueryString("itemId"),
  studentTestPaperId: GetQueryString("studentTestPaperId"),
  redoError: GetQueryString("redoError"),
};
console.log('init', ZBGVideo)
if (ZBGVideo.ccid) {
  // 创建视频播放器
  createVideoPlayer();
  var ZBGVideoDom = $(".zbg-video");
  // 播放列表
  console.log(parent.window.playList);
  if (ZBGVideo.isSidebar !== "false") {
    if (parent.window.playList && parent.window.playList.length) {
      $(".js-player-list-btn").removeClass("hide");
      // 默认播放列表展开
      $(".js-player-list-btn").addClass("active");
      debugger;
      //ZBGVideoDom.addClass("playerList");

      var playListDom = createPlaylist(
        ZBGVideo.courseType,
        parent.window.playList
      );
      $(".zbg-video-playerList").html(playListDom);

      // 定位到当前播放的视频
  var playerListTop = $('.js-play-change.active').offset().top
  console.log(playerListTop)
  $('.zbg-video-playerList').scrollTop(playerListTop)
    }
  }


  window.showSidebar = function() {
    ZBGVideoDom.addClass("sidebar");
  };
  window.hideSidebar = function() {
    $(".js-control-sidebar").removeClass("active");
    ZBGVideoDom.removeClass("sidebar");
    player_resume(window.ZBGVideo.ccid);
  };
  window.toggerClassName = function(className) {
    if (ZBGVideoDom.hasClass(className)) {
      ZBGVideoDom.removeClass(className);
    } else {
      ZBGVideoDom.addClass(className);
    }
  };
  window.reloadVideoData = function() {
    clearInterval(ZBGVideo.playerTimer);
    ZBGVideo.ccid = "";
    ZBGVideo.siteid = "";
    ZBGVideo.timer = 0;
    ZBGVideo.action = "";
    ZBGVideo.progress = 0;
    ZBGVideo.progressFormat = "00:00";
    ZBGVideo.videoTime = 0;
    ZBGVideo.videoTimeFormat = "00:00";
    ZBGVideo.source_path = "";
    ZBGVideo.cmptType = "";
    ZBGVideo.playerTimer = "";
    $("#control-progress-slider").slider("value", 0);
    $("#control-time").text(formatSeconds(0) + "/" + ZBGVideo.videoTimeFormat);
    if(ZBGVideo.courseType == 'livelesson'){
      $('#zbg-video').attr("class", 'zbg-video livelesson')
    }else{
      $("#zbg-video").attr("class","zbg-video");
    }
    $(".play-video").removeClass("active");
    $(".player-list-btn").removeClass("active");

    reloadSubmitData();
  };

  window.reloadSubmitData = function() {
    ZBGVideo.title = "";
    ZBGVideo.content = "";
    ZBGVideo.isPublic = false;
    $(".sidebar-input-text").val("");
    $(".sidebar-textarea").val("");
    $(".sidebar-checkbox").attr("checked", false);
  };

  window.getmemberinfo = function() {};

  // 跳转链接
  window.clickTaskLink = function(location, clickData, callback) {
    console.log(clickData)

    var taskLink = "";
    var href = location.href;
    var originUrl = href.split("?")[0];
    var origin = location.origin;
    var url = location.origin + location.pathname + location.hash;
    switch (clickData.tasktype) {
      // https://ilearning.zbgedu.com/#/video?courseId=0500696d731ad5607b77cffd5553b52b&taskId=f5fb6798f2f8b7678cc080dd1daf47f0&isSlider=true
      case "video":

        var queryObj = getQueryObj(href);
        queryObj.taskId = clickData.taskid;
        var query = setQuery(queryObj);
        taskLink = originUrl + query;
        if (callback) {
          callback(taskLink);
        }
        break;
      case "exam":
          // https://tiku.zbgedu.com/questionTest?testPaperId=80d78c4906a144e894e4f7d4ff48f76c&categoryId=ff808081473905e701475cd3c2080001&subjectId=ff80808147c904170147d2d3d4b60098&chapterId=23e73f4202d3aeacea393e617c6aa990&courseName=ACCA-TX-%E4%BC%98%E6%92%AD%E8%AF%BE--1909&categoryName=ACCA&subjectName=TX&chapterName=Chapter%203%20Trading%20Profits&taskName=%E4%BC%98%E6%92%AD-ACCA%20TX%201909%E7%8F%AD%E7%AC%AC1%E5%91%A8%E6%B5%8B%E8%AF%84%E4%BD%9C%E4%B8%9A&isParsing=&itemId=1&isParsingOfError=&classId=dc377af1d53611e9897f00163e0ec023&studentTestPaperId=&redoError=&taskId=69dba0504fa34441f07cdd21f531d7be&question=practice&examType=2&type=acca&testPaperType=6&token=b7f05491-d930-4b2f-afe6-d39e37c1e1f3&courseId=c5baf8cd1eb211e983fd00163e0ec023&memberId=8a22ecb553a0b1320153a7251a1e149f&courseVersionId=&linkSource=1&answerSource=1&redirect=https%3A%2F%2Filearning.zbgedu.com%2F%23%2FcourseStudy%2F0500696d731ad5607b77cffd5553b52b%2FstudyPlan
        $.ajax({
          url:
            ZBGVideo.originNew +
            "/apiNew/userAction/scene/mobileIndex/queryExamenInfo",
          data: {
            // token: ZBGVideo.token,
            // examenId: clickData.id,
            // courseId: ZBGVideo.courseId
            token: 'ce98e416-71d3-4554-95a0-09433915527d',
            examenId: '357fb8a659c346df8cd5c61e53f2ac52',
            courseId: '0500696d731ad5607b77cffd5553b52b'
          },
          success: function(res) {
            var versionId = res.data.versionId;
            var testSeason = res.data.testSeason;
            var itemId = res.data.itemId;
            // question=practice（章节练习）mock（综合模考)

            var tikuLink = ZBGVideo.originTiku;
            var type = "";
            var question = "";
            var testPaperType = ""; //  综合模考
            if (itemId == 1) {
              tikuLink += "/questionTest?";
              type = "acca";
            } else {
              tikuLink += "/page/questionTest?";
              type = "cma";
            }
            if (clickData.tasklevel == "appraisal") {
              question = "mock";
              testPaperType = 6;
            } else {
              question = "practice";
              testPaperType = 4;
            }
            // isAnalysis=1  查看解析时需传  examType=2		重新做题为3  2继续做题 2去做题
            taskLink =
              tikuLink +
              "testPaperId=" +
              clickData.id +
              "&question=" +
              question +
              "&categoryId=" + ZBGVideo.categoryId +
              "&categoryName=" + ZBGVideo.categoryName +
              "&subjectId=" + ZBGVideo.subjectId +
              "&subjectName=" + ZBGVideo.subjectName +
              "&courseId=" + versionId +
              "&courseName=" + ZBGVideo.courseName +
              "&chapterId=" + ZBGVideo.chapterId +
              "&chapterName=" + ZBGVideo.chapterName +
              "&taskId=" + ZBGVideo.taskId +
              "&taskName="  + ZBGVideo.taskName +
              "&testPaperName=" + ZBGVideo.testPaperName +
              "&isParsing=" + ZBGVideo.isParsing +
              "&itemId=" + itemId +
              "&isParsingOfError=" + ZBGVideo.isParsingOfError +
              "&classId=" + ZBGVideo.classId +
              "&studentTestPaperId=" + ZBGVideo.studentTestPaperId +
              "&redoError=" + ZBGVideo.redoError +


              "&examType=2" +
              "&type=" +
              type +
              "&testPaperType=" +
              testPaperType +
              "&token=" +
              ZBGVideo.token +
              "&memberId=" +
              ZBGVideo.memberId +
              "&courseVersionId=" +
              testSeason +
              "&linkSource=1" +
              "&answerSource=1&redirect=" +
              href;


            if (callback) {
              callback(taskLink);
            }
          },
          error: function(err) {
            console.log(err);
          }
        });
        break;
      case "openCourse":
        console.log(clickData)
        if (clickData.ccid) {
          // 直播回顾
          // var originUrl = href.split("?")[0];
          var queryObj = getQueryObj(href);
          queryObj.taskId = clickData.taskId;
          var query = setQuery(queryObj);
          taskLink = originUrl + query;
        } else {
          var newTime = new Date().getTime();
          if(clickData.opencoursestarttime < newTime && newTime < clickData.opencourseendtime){
            // 直播
            var liveData = {
              taskId: clickData.taskid,
              liveName: clickData.livename,
              liveManagePassword: clickData.livemanagepassword,
              liveRoomId: clickData.liveroomid,
              liveManageId: clickData.livemanageid
            };
            taskLink = origin + "#/live/room/?data=" + JSON.stringify(liveData);
          }
        }
        if (callback) {
          callback(taskLink);
        }
        break;
      case "pdfread":
        var pafUrl = encodeURI("//exstatic.zbgedu.com" + clickData.pdfurl);
        taskLink =origin +"#/documentRead?url=" +pafUrl +"&classId=" + ZBGVideo.classId +"&courseId=" +ZBGVideo.courseId +"&courseName=" +ZBGVideo.courseName +"&taskId=" +clickData.taskid +"&taskName=" +clickData.taskname +"&courseType=onlinecourse";
        if (callback) {
          callback(taskLink);
        }
        break;
      case "livelesson":
        // 直播回顾
        // var originUrl = href.split("?")[0];
        var queryObj = getQueryObj(href);
        queryObj.ccid = clickData.ccid;
        var query = setQuery(queryObj);
        taskLink = originUrl + query;
        if (callback) {
          callback(taskLink);
        }
        break;
    }
  };

  // 提交任务进度
  window.saveTaskProgress = function() {

    if(ZBGVideo.courseType == 'livelesson'){
      var taskProgressData = {
        token: ZBGVideo.token,
        memberId: ZBGVideo.memberId,
        memberName: ZBGVideo.memberName,
        progress: ZBGVideo.progress,
        total: ZBGVideo.total,
        state: ZBGVideo.state,
        action: ZBGVideo.action,
        isSupply: ZBGVideo.isSupply,
        createDate: new Date().getTime(),
        studyTime: ZBGVideo.studyTime,
        taskStudyTotalTime: ZBGVideo.taskStudyTotalTime,

        categoryId: ZBGVideo.categoryId,
        categoryName: ZBGVideo.categoryName,
        subjectId: ZBGVideo.subjectId,
        subjectName: ZBGVideo.subjectName,
        classId: ZBGVideo.liveId,
        courseId: ZBGVideo.liveId,
        courseName: ZBGVideo.liveId,
        chapterId: ZBGVideo.liveId,
        chapterName: ZBGVideo.liveId,
        taskId: ZBGVideo.liveId,
        taskName: ZBGVideo.liveId
      };
    }else{
      var taskProgressData = {
        token: ZBGVideo.token,
        memberId: ZBGVideo.memberId,
        memberName: ZBGVideo.memberName,
        progress: ZBGVideo.progress,
        total: ZBGVideo.total,
        state: ZBGVideo.state,
        action: ZBGVideo.action,
        isSupply: ZBGVideo.isSupply,
        createDate: new Date().getTime(),
        studyTime: ZBGVideo.studyTime,
        taskStudyTotalTime: ZBGVideo.taskStudyTotalTime,

        categoryId: ZBGVideo.categoryId,
        categoryName: ZBGVideo.categoryName,
        subjectId: ZBGVideo.subjectId,
        subjectName: ZBGVideo.subjectName,
        classId: ZBGVideo.classId,
        courseId: ZBGVideo.courseId,
        courseName: ZBGVideo.courseName,
        chapterId: ZBGVideo.chapterId,
        chapterName: ZBGVideo.chapterName,
        taskId: ZBGVideo.taskId,
        taskName: ZBGVideo.taskName
      };
    }

    // message: {"token":"32338e3c-5a00-4d2d-be4b-96224221b9f3","memberId":"8a22ecb553a0b1320153a7251a1e149f","progress":188,"total":1256,"state":0,"taskId":"c7856d329aa005221f11e6c4de6fcbcd","chapterId":"b2709c059e566645a39b968e9b8c883b","courseId":"b23d4273c672a706276ee50093eb685a","subjectId":"8a22ecb5527d453f01527d4b0e500001","categoryId":"ff80808149cc09f70149f3e7b9534654","taskName":"第一天CFA LI—Introduction to Asset-backed Securities-1 ","chapterName":"Introduction to Asset-backed Securities试听部分","courseName":"CFA LI 一步通关试听课","subjectName":"Level I","categoryName":"CFA","classId":"e1699c9662050a66f0d6fd5af3823604","action":"beginplay","memberName":"app6hvm","isSupply":0,"createDate":1568628058655,"studyTime":0,"taskStudyTotalTime":7028}
    // action|classId|createDate<0|studyTime<1|token
    $.ajax({
      url: ZBGVideo.originAction + "/api/userAction/course/taskProgress/v1.0/",
      data: {
        token: ZBGVideo.token,
        message: JSON.stringify(taskProgressData)
      },
      success: function(req) {

        console.log(taskProgressData);
        console.log(req);
      },
      error: function(err) {
        console.log(err);
      }
    });
    ZBGVideo.studyTime = 0;
  };
}
