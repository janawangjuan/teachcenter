
  window.createPlaylist = function (courseType, playList){
    console.log(courseType, playList)
    var playListDom = '';
    ZBGVideo.taskIndex = 0;
    // onlinecourse: 标准网课, ezcourse: ez课, flipped: 优播课,facecourse: 面授课, livelesson: 直播课，
    switch(courseType){
      case 'onlinecourse':
      case 'facecourse':
          playListDom += course(playListDom, playList);
        break;
      case 'ezcourse':
      case 'flipped':
        playListDom += planCourse(playListDom, playList);
        break;
      case 'livelesson':
        playListDom += liveCourse(playListDom, playList);
        break;
    }
    return playListDom;
  }
  function course(playListDom, playList){
    if(playList && playList.length){
      playList.forEach(function(item){
        playListDom += '<h3 class="player-list-title">' +  item.chapterTitle + '</h3>';
        if(item.tasks && item.tasks.length){
          playListDom += createPlayListDom(item.tasks);
        }
        if(item.children && item.children.length){
          item.children.forEach(function(item){
            if(item.tasks && item.tasks.length){
              playListDom += createPlayListDom(item.tasks);
            }
            if(item.children && item.children.length){
              item.children.forEach(function(item){
                if(item.tasks && item.tasks.length){
                  playListDom += createPlayListDom(item.tasks);
                }
                if(item.children && item.children.length){
                  item.children.forEach(function(item){
                    if(item.tasks && item.tasks.length){
                      playListDom += createPlayListDom(item.tasks);
                    }
                    if(item.children && item.children.length){
                      
                    }
                  })
                }
              })
              
            }
          })
        }
      })
    }
    return playListDom;
  }

  function planCourse(playListDom, playList){
    if(playList && playList.length){
      playList.forEach(function(item){
        playListDom += '<h3 class="player-list-title">' +  item.weekTitle + '</h3>';
        if(item.list && item.list.length){
          item.list.forEach(function(list){
            if(list.isTasks){
              playListDom += createPlayListDom(list.tasks, list.title);
            }
          });
        }
      });
    }
    return playListDom;
  }

  function liveCourse(playListDom, playList){
    
    if(playList){
      if(playList.length){
        playListDom += createLivePlayListDom("直播", playList);
      }
    }
    return playListDom;
  }
  // 课程任务列表
  function createPlayListDom(tasks, title){
    var playListUlDom = '';
    if(title){
      playListUlDom += '<h3 class="player-list-title">' +  title + '</h3>';
    }
    
    playListUlDom += '<ul class="player-list-ul">';
      tasks.forEach(function(item){
        
        var videoTaskId = ZBGVideo.isDemo ? ZBGVideo.taskId : item.taskId;
        // console.log(videoCcid == ZBGVideo.ccid, videoCcid, ZBGVideo.ccid)
        var isActive = videoTaskId ===  ZBGVideo.taskId ? 'active' : '';
        switch(item.taskType){
          case "video":
            playListUlDom += '<li class="player-list-li js-play-change ' + isActive + '" data-taskType="' + item.taskType + '" data-taskIndex="' + ZBGVideo.taskIndex + '" data-taskLevel="' + item.taskLevel + '" data-taskId="' + item.taskId + '" data-taskName="' + item.title + '" data-ccid="' + item.videoCcid + '" data-siteid="' + item.videoSiteId + '">';
            break;
          case "exam":
            playListUlDom += '<li class="player-list-li js-play-change ' + isActive + '" data-taskType="' + item.taskType + '" data-taskIndex="' + ZBGVideo.taskIndex + '" data-taskLevel="' + item.taskLevel + '" data-id="' + item.id + '" data-taskId="' + item.taskId + '" data-taskName="' + item.title + '" >';
            break;
          case "openCourse":
            playListUlDom += '<li class="player-list-li js-play-change ' + isActive + '" data-taskType="' + item.taskType + '" data-taskIndex="' + ZBGVideo.taskIndex + '" data-taskLevel="' + item.taskLevel + '" data-taskId="' + item.taskId + '" data-taskName="' + item.title + '" data-ccid="' + item.openCourseCcid + '" data-ccid="' + item.openCourseCcid + '" data-liveName="' + item.title + '" data-liveManagePassword="' + item.openCourseLiveRoomPassword + '" data-liveRoomId="' + item.openCourseLiveRoomId + '" data-liveManageId="' + item.openCourseLiveManageId + '" data-siteid="' + item.openCourseSiteId + '" data-openCourseStartTime="' + item.openCourseStartTime + '" data-openCourseEndTime="' + item.openCourseEndTime + '">';
            break;
          default:
            playListUlDom += '<li class="player-list-li js-play-change ' + isActive + '" data-taskType="' + item.taskType + '" data-taskIndex="' + ZBGVideo.taskIndex + '" data-taskLevel="' + item.taskLevel + '" data-taskId="' + item.taskId + '" data-taskName="' + item.title + '" data-ccid="' + item.videoCcid + '" data-siteid="' + item.videoSiteId + '">';
            break;
        }

        playListUlDom += '<a class="player-list-a" href="javascript:;">'
        playListUlDom += '<p class="player-list-item-title ' + isActive + '">'+ getPlayListType(item.taskType, item.taskLevel) +  item.title+'</p>'
        playListUlDom += '<p class="player-list-item-desc">时长:' + formatSeconds(item.videoTime || item.taskTime) + '</p>'
        playListUlDom += '</a>'
        playListUlDom += '</li>'
        ZBGVideo.taskIndex++;
      })
    playListUlDom += '</ul>';
    return playListUlDom;
  }
  // 直播列表
  function createLivePlayListDom(title, tasks){

    var playListUlDom = '';
    playListUlDom += '<h3 class="player-list-title">' +  title + '</h3>';
    playListUlDom += '<ul class="player-list-ul">';
      tasks.forEach(function(item){
        var videoCcid = ZBGVideo.isDemo ? ZBGVideo.ccid : item.ccid;
        // console.log(videoCcid == ZBGVideo.ccid, videoCcid, ZBGVideo.ccid)
        var isActive = videoCcid ===  ZBGVideo.ccid ? 'active' : '';
        
        if(isActive){
          ZBGVideo.liveId = item.liveId;
        }
        playListUlDom += '<li class="player-list-li js-play-change ' + isActive + '" data-taskIndex="' + ZBGVideo.taskIndex + '" data-taskType="livelesson" data-liveReplayId="' + item.liveReplayId + '" data-liveReplayName="' + item.liveReplayName + '" data-liveId="' + item.liveId + '" data-ccid="' + item.ccid + '" data-siteid="' + item.ccid + '">';
        playListUlDom += '<a class="player-list-a" href="javascript:;">'
        playListUlDom += '<p class="player-list-item-title ' + isActive + '">'+ getPlayListType('openCourse') +  item.liveReplayName+'</p>'
        // playListUlDom += '<p class="player-list-item-desc">时长:' + formatSeconds(item.videoTime) + '</p>'
        playListUlDom += '</a>'
        playListUlDom += '</li>'
        ZBGVideo.taskIndex++;
      })
    playListUlDom += '</ul>';
    return playListUlDom;
  }

  function getPlayListType(taskType, taskLevel){
    var itemDom = '';
    if(taskType === 'exam'){
      if(taskLevel && taskLevel === 'evaluation'){
        taskType = 'evaluation';
      }else{
        taskType = 'practice';
      }
    }
    // eslint-disable-next-line default-case
    switch(taskType){
      case 'video':
        itemDom += '<icon class="icon icon-video"></icon>';
        break;
      case 'evaluation':
        itemDom += '<icon class="icon icon-evaluation"></icon>';
        break;
      case 'practice':
        itemDom += '<icon class="icon icon-practice"></icon>';
        break;
      case 'pdfread':
        itemDom += '<icon class="icon icon-pdfread"></icon>';
        break;
      case 'openCourse':
        itemDom += '<icon class="icon icon-live"></icon>';
        break;
    }
    return itemDom;
  }