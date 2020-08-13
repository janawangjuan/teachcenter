$(function () {
  // 输入标题
  $('.sidebar-input-text').keyup(function(){
    ZBGVideo.title = $(this).val();
  })
  // 输入内容
  $('.sidebar-textarea').keyup(function(){
    ZBGVideo.content = $(this).val();
  })
  // 是否公开
  $('.sidebar-checkbox').on('click',function(){
    ZBGVideo.isPublic = !ZBGVideo.isPublic;
  })
  // 提交
  $('.sidebar-submit').on('click', function(){
    console.log('提交', ZBGVideo)
    var url = '';
    var data = '';
    switch(ZBGVideo.type){
      case 'notes':
        // url = '/api/studytools/nodesave/v2.1';
        url = '/api/userAction/php/note/save';
        data = {
          token: ZBGVideo.token,
          clientType: ZBGVideo.clientType,
          id: '',
          title: ZBGVideo.title,
          content: ZBGVideo.content,
          imgPath: '',
          isPublic: ZBGVideo.isPublic ? 0 : 1,

          categoryId: ZBGVideo.categoryId,
          categoryName: ZBGVideo.categoryName,

          subjectId: ZBGVideo.subjectId,
          subjectName: ZBGVideo.subjectName,

          courseId: ZBGVideo.courseId,
          courseName: ZBGVideo.courseName,
          
          chapterId: ZBGVideo.chapterId,
          chapterName: ZBGVideo.chapterName,

          taskId: ZBGVideo.taskId,
          taskName: ZBGVideo.taskName,
          taskProgress: ZBGVideo.taskProgress,
        }
        break;
      case 'answer':
        url = '/api/studytools/bbssave/v1.0';
        data = {
          token: ZBGVideo.token,
          type: 1,
          title: ZBGVideo.title,
          content: ZBGVideo.content,
          imgPath: '',
          clientType: 'pc',
          classId: ZBGVideo.classId,
          subjectId: ZBGVideo.subjectId,
          courseId: ZBGVideo.courseId,
          taskProgress: ZBGVideo.taskProgress,
          taskName: ZBGVideo.taskName,
          chapterName: ZBGVideo.chapterName,
          chapterId: ZBGVideo.chapterId,
          categoryName: ZBGVideo.categoryName,
          subjectName: ZBGVideo.subjectName,
          courseName: ZBGVideo.courseName,
          taskType: 'video',
          taskId: ZBGVideo.taskId,
          knowledgeId: '',
          source_path: ZBGVideo.courseName + ' ' + ZBGVideo.taskName
        }
        break;
      case 'error':
        if(!ZBGVideo.cmptType){
          alert('请选择类型')
          return;
        }
        url = '/api/business/complaintOpinion/create/v1.0';
        var platform = (navigator.platform) == 'MacIntel' ? '苹果' : '';
        var userAgentArr = navigator.userAgent.split(' ');
        var userAgentArrLength = userAgentArr.length;
        var userAgent = userAgentArr[userAgentArr.length - 2].split('/')[0] + '-' + userAgentArr[userAgentArr.length - 1].split('/')[0];

        var feedbackContent = ZBGVideo.content;
        
        var jsonName = {
          "categoryName": ZBGVideo.categoryName,
          "categoryId": ZBGVideo.categoryId,

          "subjectName": ZBGVideo.subjectName,
          "subjectId": ZBGVideo.subjectId,

          "courseName": ZBGVideo.courseName,
          "courseId": ZBGVideo.courseId,

          "chapterName": ZBGVideo.chapterName,
          "chapterId": ZBGVideo.chapterId,

          "taskName": ZBGVideo.taskName,
          "taskId": ZBGVideo.taskId,
          "id": ZBGVideo.ccid
        };
        var addDom = '';
        addDom += '<a class="content-addDom" data-nameJson="' + JSON.stringify(jsonName) + '" href="javascript:;" data-course-id="' + ZBGVideo.courseId + '" data-chapter-id="' + ZBGVideo.chapterId + '" data-task-id="' + ZBGVideo.taskId + '" ';

        addDom += 'data-type="video" data-title="' + ZBGVideo.title + '" data-video-ccid="' + ZBGVideo.ccid + '" data-video-siteid="' + ZBGVideo.ccid + '" data-progress="' + ZBGVideo.progressFormat + '" data-video-time="' + ZBGVideo.videoTimeFormat + '"';

        addDom += '>视频：' + ZBGVideo.progressFormat + '</a>';
        console.log(addDom);
        feedbackContent += addDom;

        data = {
          memberId: ZBGVideo.memberId,
          memberName: ZBGVideo.memberName,
          cmptType: ZBGVideo.cmptType,
          cmptContent: feedbackContent,
          contactWay: ZBGVideo.phone,
          deviceDesc:  platform + " " + userAgent
        }
        break;
    }
    $.ajax({
      url: ZBGVideo.origin + url,
      type: 'post',
      data: data,
      success: function(req){
        console.log(req)
        $('.js-control-sidebar').removeClass('active');
        hideSidebar();
      },
      error: function(err){
        console.log(err)
      }
    })
  })
});