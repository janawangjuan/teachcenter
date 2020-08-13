
$.extend({
  supportfull: function() {
    var requestFullscreen =
      document.body.requestFullscreen ||
      document.body.webkitRequestFullscreen ||
      document.body.mozRequestFullScreen ||
      document.body.msRequestFullscreen;
    var fullscreenEnabled =
      document.fullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.msFullscreenEnabled;
    return !!(requestFullscreen && fullscreenEnabled);
  },
  // 获取当前全屏的元素
  fullele: function() {
    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement ||
      document.mozFullScreenElement ||
      null
    );
  },
  // 全屏，如果当前存在已经全屏的元素，则操作无效
  full: function(el) {
    if ($.isfull()) {
      if (el === $.fullele()) {
        return;
      }
    }
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }
    return this;
  },
  // 退出全屏
  exitfull: function() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    return this;
  },
  // 是否全屏
  isfull: function() {
    return !!(document.webkitIsFullScreen || $.fullele());
  },
  // 进入或取消全屏，如果当前全屏的元素不是指定的元素，则取消全屏无效
  togglefull: function(el, callback) {
    if ($.isfull()) {
      var fullele = $.fullele();
      if (el === fullele) {
        $.exitfull();
        callback(!$.isfull());
      }
      return;
    }
    $.full(el);
    if (typeof callback == typeof $.noop) {
      callback(!$.isfull());
    }
    return this;
  }
});
$.fn.extend({
  isfull: function(){
    return $.isfull();
  },
  // 让匹配的第一个元素全屏
  // 该方法应有用户操作触发，否则无效
  full: function() {
    if ($(this).length == 0) return;
    $.full($(this).get(0));
    return this;
  },
  // 如果当前全屏的元素存在于匹配的元素集合中，则该元素会退出全屏
  exitfull: function() {
    if ($.fullele()) {
      var fullele = $.fullele();
      var index = $(this).index(fullele);
      if (index != -1) {
        $.exitfull();
      }
    }
    return this;
  },
  // 该方法应由用户操作触发，只对匹配的第一个元素有效
  togglefull: function(callback) {
    if ($(this).length > 0) {
      var el = $(this)
        .first()
        .get(0);
      $.togglefull(el, callback);
    }
    return this;
  },
  // 为元素绑定点击事件，以使点击的元素进入或退出全屏
  fullable: function(callback) {
    $(this).on("click", function(e) {
      $(this).togglefull(callback);
    });
    return this;
  }
});