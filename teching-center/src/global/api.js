import Request from '../request'
import Vue from 'vue'

export default {

	formatDate(now, t) {//时间转换
	  let date = ''
	  if(parseInt(now)<100000000000){
      date = new Date(parseInt(now * 1000));
    }else{
      date = new Date(parseInt(now));
    }
    let Y,M,D,h,m,s;
    Y = date.getFullYear();
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    D = this.extra(date.getDate());
    h = this.extra(date.getHours());
    m = this.extra(date.getMinutes());
    s = this.extra(date.getSeconds());
    if (t == 'Y') {

        return Y;
    }
    if (t == 'M') {

        return M;
    }
    if (t == 'D') {

        return D;
    }
    if (t == 'h') {

        return h;
    }
    if (t == 'm') {

        return m;
    }
    if (t == 's') {

        return s;
    }
    if (t == 'ALL'){
      /*date.getFullYear()*/
      return Y+'-'+M+'-'+D+'  '+h+':'+m+':'+s
    }
    if(t == 'YMD'){
      return Y+'-'+M+'-'+D
    }
  },
  getUrlKey(name) {   //获取地址栏的参数
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
  },
     //补位函数。
    extra(x) {
        //如果传入数字小于10，数字前补一位0。
        if (parseInt(x) < 10) {
          return "0" + parseInt(x);
        } else {
          return x;
        }
    },
    //把秒数转化成毫秒数
    formatSeconds(value) {
        var secondTime = parseInt(value);// 秒
        var minuteTime = 0;// 分
        var hourTime = 0;// 小时
        if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
            //获取分钟，除以60取整数，得到整数分钟
            minuteTime = parseInt(secondTime / 60);
            //获取秒数，秒数取佘，得到整数秒数
            secondTime = parseInt(secondTime % 60);
            //如果分钟大于60，将分钟转换成小时
            if(minuteTime > 60) {
                //获取小时，获取分钟除以60，得到整数小时
                hourTime = parseInt(minuteTime / 60);
                //获取小时后取佘的分，获取分钟除以60取佘的分
                minuteTime = parseInt(minuteTime % 60);
            }
        }
        var result = "" + parseInt(secondTime) + "s";

        if(minuteTime > 0) {
            result = "" + parseInt(minuteTime) + "m" + result;
        }
        if(hourTime > 0) {
            result = "" + parseInt(hourTime) + "h" + result;
        }
        return result;
    },
    unique(arr) {
      let result= [];
      let hash= {};
      for(let i = 0; i < arr.length; i++) {
          if(!hash[arr[i].id]) {
              result.push(arr[i]);
              hash[arr[i].id] = 1;
          }
      }
      return result;
    },

    down(x, y) {
        return (x.subjectIndex > y.subjectIndex) ? 1 : -1
    },
    formatType(type, value) {  //任务类型
    //  if (isEmpty(value) || value == 0) {
        if (value == "-1") {
            return '';
        } else {
    //      switch (type) {
    //          case 'video':
                if(type == 'video'){
                    var theTime = parseInt(value);
                    // 秒
                    var theTime1 = 0;
                    // 分
                    var theTime2 = 0;
                    // 小时
                    if (theTime >= 60) {
                        theTime1 = parseInt(theTime / 60);
                        theTime = parseInt(theTime % 60);
                        if (theTime1 >= 60) {
                            theTime2 = parseInt(theTime1 / 60);
                            theTime1 = parseInt(theTime1 % 60);
                        }
                    }
                    var i, s, h;
                    if (theTime2 >= 10) {
                        h = theTime2;
                    } else {
                        h = '0' + theTime2;
                    }
                    if (theTime1 >= 10) {
                        i = theTime1;
                    } else {
                        i = '0' + theTime1;
                    }
                    if (theTime >= 10) {
                        s = theTime;
                    } else {
                        s = '0' + theTime;
                    }
                    if (h > 0) {
                        return parseInt(parseInt(i) + parseInt(h * 60)) + ':' + s;
                    } else {
                        return i + ':' + s;
                    }
                    //return h + ':' + i + ':' + s;
                }else if(type == 'exam' || type == 'knowledgePointExercise'){
                    return ' 第' + value + '题';
                }
    //              break;
    //          case 'exam':
    //              return ' 第' + value + '题';
    //              break;
    //          default:
    //              return ' 第' + value + '页';
    //              break;
    //      }
        }
    },
  getLastMonthToday(){
    var now=new Date();
    var year = now.getFullYear();//getYear()+1900=getFullYear()
    var month = now.getMonth() +1;//0-11表示1-12月
    var day = now.getDate();
    if(parseInt(month)<10){
      month="0"+month;
    }
    if(parseInt(day)<10){
      day="0"+day;
    }

    now =year + '-'+ month + '-' + day;

    if (parseInt(month) ==1) {//如果是1月份，则取上一年的12月份
      return (parseInt(year) - 1) + '-12-' + day;
    }

    var  preSize= new Date(year, parseInt(month)-1, 0).getDate();//上月总天数
    if (preSize < parseInt(day)) {//上月总天数<本月日期，比如3月的30日，在2月中没有30
      return year + '-' + month + '-01';
    }

    if(parseInt(month) <=10){
      return year + '-0' + (parseInt(month)-1) + '-' + day;
    }else{
      return year + '-' + (parseInt(month)-1) + '-' + day;
    }
  },
    dateAddZero(params){   //格式为2018/3/3的日期添0
      let arr = params.split('/')
      return arr[0]+this.extra(arr[1])+this.extra(arr[2])
    },
    //判断是否为空
    isEmpty(data) {
      if (this.isEmpty1(data) || this.isEmpty2(data)) {
        return true;
      }
      return false;
    },

    isEmpty1(data) {
      if (data == undefined || data == null || data == 'null' || data == "" || data == 'NULL' || data == false || data == 'False' || data == 'false' || data == 'NaN' || data == NaN) {
        return true;
      }
      return false;
    },

    isEmpty2(v) {
      switch (typeof v) {
        case 'undefined' :
          return true;
        case 'string' :
          if (this.trim(v).length == 0)
            return true;
          break;
        case 'boolean' :
          if (!v)
            return true;
          break;
        case 'number' :
          if (0 === v)
            return true;
          break;
        case 'object' :
          if (null === v)
            return true;
          if (undefined !== v.length && v.length == 0)
            return true;
          for (var k in v) {
            return false;
          }
          return true;
          break;
      }
      return false;
    },
    trim(str) {
      return str.replace(/(^\s+)|(\s+$)/g, "");
    },
    unescapeHTML(str){   //标签反转义
      return str.toString().replace(
        /&amp;|&lt;|&gt;|&#39;|&quot;/g,
        tag =>
          ({
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&#39;': "'",
            '&quot;': '"'
          }[tag] || tag)
      );
    },
  /*
  *
  * base64编码
  *
  * */
  base64encode(str) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;
    var input = this.utf16to8(str);
    do {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
      chr1 = chr2 = chr3 = "";
      enc1 = enc2 = enc3 = enc4 = "";
    } while (i < input.length);
    return output;
  },
  utf16to8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
      c = str.charCodeAt(i);
      if ((c >= 0x0001) && (c <= 0x007F)) {
        out += str.charAt(i);
      } else if (c > 0x07FF) {
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
        out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
      } else {
        out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
      }
    }
    return out;
  },
    /**
    * 递归父节点
    * @type {String}  node 现在的节点
    * @type {String}  target 目标父节点
    * @return {String} 父节点
    */
    recursiveParentNode(node, target) {
      return node.nodeName.toLowerCase() == target ? node : this.recursiveParentNode(node.parentNode, target) ;
    },
    goodTime(str){
      var now = new Date().getTime(),
        oldTime = new Date(str*1000).getTime(),
        difference = now - oldTime,
        result='',
        minute = 1000 * 60,
        hour = minute * 60,
        day = hour * 24,
        halfamonth = day * 15,
        month = day * 30,
        year = month * 12,

        _year = difference/year,
        _month =difference/month,
        _week =difference/(7*day),
        _day =difference/day,
        _hour =difference/hour,
        _min =difference/minute;
      if(_year>=1) {result=  ~~(_year) + " 年前"}
      else if(_month>=1) {result= ~~(_month) + " 个月前"}
      else if(_week>=1) {result= ~~(_week) + " 周前"}
      else if(_day>=1) {result= ~~(_day) +" 天前"}
      else if(_hour>=1) {result= ~~(_hour) +" 个小时前"}
      else if(_min>=1) {result= ~~(_min) +" 分钟前"}
      else result="刚刚";
      return result;
    },
   /**
    * 提示
    * @type {String}  message 提示消息
    * @type {Number}  time   隐藏时间
    * @type {Number}  zIndex 层级
    */
   alert(message = '网络异常，请稍后再试', time = 2000, zIndex = 999999) {

     let oDiv = document.createElement('div');

     try {
       let oldDiv = document.querySelectorAll('.g-small-alert');
       if (oldDiv[0])  document.body.removeChild(oDiv);
     }catch(e) {}

     oDiv.className = 'g-small-alert';
     oDiv.style.cssText = `z-index:${zIndex};`;
     oDiv.innerText = message;

     document.body.appendChild(oDiv);

     if(typeof time != 'number') time = Number(time);

     setTimeout(()=>{
       document.body.removeChild(oDiv);
     }, time);

   },
   /**
  * 图片上传
  * @type { file } 文件
  * @type { cd } 回调函数
  */
  pictureCompress(file, cd) {

    const setting = {
      mime: 'image/jpeg',
      quality: 0.6,
      fileName: '',
    }

    setting.fileName = this.randomName(setting.mime);

    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');


    let _reader = new FileReader(),
        _img, _base64Img;


      _reader.onload = (ev) => {

        _img = new Image();

        _img.onload = function() {

          canvas.width = _img.width;
          canvas.height = _img.height;
          ;
          ctx.drawImage(_img, 0, 0);
          _base64Img = canvas.toDataURL(setting.mime, setting.quality);
          cd(dataURLtoBlob(_base64Img), setting.fileName);
        };

        _img.src = _reader.result;

      };

      _reader.readAsDataURL(file);


      function dataURLtoBlob(dataurl) {

          let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
              bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
          while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
          }

          return new Blob([u8arr], { type: mime });
      }



  },

  /**
    * 随机图片名
    * @type   { mime }    文件类型
    * @return { String }  文件名
    */
  randomName(mime) {
    return `${new Date().getTime()}.${mime.replace(/^.+\/{1}(.+)$/g,'$1')}`;
  },
  stringToEntity(str) {

    let newStr = '';

    let arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"','#39':"'"};

    newStr = str.replace(/&(lt|gt|nbsp|amp|quot|#39);/ig,function(all,t){

      return arrEntities[t];

    });

    return newStr;
  },
  //去除title多余标签
  outTitle(title){
      var title = title.replace(/\t|\n|<.*?>/ig, function (tag) {
          if (tag.indexOf('<img ') === 0) {
              return tag;
          } else {
              return '';
          }
      })

      return title
  },
  //名次排序
  compareDown(propertyName) {
      return function(object1, object2) {
          var value1 = object1.member_pre*100;
          var value2 = object2.member_pre*100;
          if(value2 < value1) {
              return -1;
          } else if(value2 > value1) {
              return 1;
          } else {
              return 0;
          }
      }
  },
  compare(property,type){ //type传asc升序  desc 降序，默认升序
    return function(obj1,obj2){
      var value1 = obj1[property];
      var value2 = obj2[property];
      if(type&&type=='desc'){
        return value2 - value1;     //降序
      }
      return value1 - value2;     // 升序
    }
  },
  toZhDigit(digit) {   //数字转化中文
    digit = typeof digit === 'number' ? String(digit) : digit;
    const zh = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const unit = ['千', '百', '十', ''];
    const quot = ['万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载', '极', '恒河沙', '阿僧祗', '那由他', '不可思议', '无量', '大数'];

    let breakLen = Math.ceil(digit.length / 4);
    let notBreakSegment = digit.length % 4 || 4;
    let segment;
    let zeroFlag = [], allZeroFlag = [];
    let result = '';

    while (breakLen > 0) {
      if (!result) { // 第一次执行
        segment = digit.slice(0, notBreakSegment);
        let segmentLen = segment.length;
        for (let i = 0; i < segmentLen; i++) {
          if (segment[i] != 0) {
            if (zeroFlag.length > 0) {
              result += '零' + zh[segment[i]] + unit[4 - segmentLen + i];
              // 判断是否需要加上 quot 单位
              if (i === segmentLen - 1 && breakLen > 1) {
                result += quot[breakLen - 2];
              }
              zeroFlag.length = 0;
            } else {
              result += zh[segment[i]] + unit[4 - segmentLen + i];
              if (i === segmentLen - 1 && breakLen > 1) {
                result += quot[breakLen - 2];
              }
            }
          } else {
            // 处理为 0 的情形
            if (segmentLen == 1) {
              result += zh[segment[i]];
              break;
            }
            zeroFlag.push(segment[i]);
            continue;
          }
        }
      } else {
        segment = digit.slice(notBreakSegment, notBreakSegment + 4);
        notBreakSegment += 4;

        for (let j = 0; j < segment.length; j++) {
          if (segment[j] != 0) {
            if (zeroFlag.length > 0) {
              // 第一次执行zeroFlag长度不为0，说明上一个分区最后有0待处理
              if (j === 0) {
                result += quot[breakLen - 1] + zh[segment[j]] + unit[j];
              } else {
                result += '零' + zh[segment[j]] + unit[j];
              }
              zeroFlag.length = 0;
            } else {
              result += zh[segment[j]] + unit[j];
            }
            // 判断是否需要加上 quot 单位
            if (j === segment.length - 1 && breakLen > 1) {
              result += quot[breakLen - 2];
            }
          } else {
            // 第一次执行如果zeroFlag长度不为0, 且上一划分不全为0
            if (j === 0 && zeroFlag.length > 0 && allZeroFlag.length === 0) {
              result += quot[breakLen - 1];
              zeroFlag.length = 0;
              zeroFlag.push(segment[j]);
            } else if (allZeroFlag.length > 0) {
              // 执行到最后
              if (breakLen == 1) {
                result += '';
              } else {
                zeroFlag.length = 0;
              }
            } else {
              zeroFlag.push(segment[j]);
            }

            if (j === segment.length - 1 && zeroFlag.length === 4 && breakLen !== 1) {
              // 如果执行到末尾
              if (breakLen === 1) {
                allZeroFlag.length = 0;
                zeroFlag.length = 0;
                result += quot[breakLen - 1];
              } else {
                allZeroFlag.push(segment[j]);
              }
            }
            continue;
          }
        }


        --breakLen;
      }

      return result;
    }
  },

  /*
  * form表单提交的方式导出excel文件
  * */

  postExcelFile(params, url) { //params是post请求需要的参数，url是请求url地址
    var form = document.createElement("form");
    form.style.display = 'none';
    form.action = url;
    form.method = "post";
    document.body.appendChild(form);

    for(var key in params){
      var input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = params[key];
      form.appendChild(input);
    }

    form.submit();
    form.remove();
  },


  setUrlPath(type){
    let host = window.location.origin;
    let url='';
    if(type=='tiku'){//跳转题库
      if (parseInt(Vue.cookie.get('envType'))==1){
        url = 'http://tikudemo.zbgedu.com'
      } else {
        url = 'https://tiku.zbgedu.com'
      }
    }else if(type=='learning'){//跳转学习中心
      if (host.match('ilearning.zbgedu.com')){
        url = 'https://elearning.zbgedu.com/ilearning.cookie.html'
      } else{
        url = 'http://elearningdemo.zbgedu.com/ilearning.cookie.html'
      }
    }else if(type=='web'){//官网
      if (host.match('ilearning.zbgedu.com')){
        url = 'https://www.zbgedu.com'
      } else{
        url = 'http://wwwdemo.zbgedu.com'
      }
    }
    return url;
  },

  //跳转到题库页面
  source(type,option){
    console.log(option,1111111)
    if( type=='video'){
      const {courseId,taskId,isSlider=true} = option;
      router.push('/video?courseId='+courseId+'&taskId='+taskId+'&isSlider='+isSlider)
    }else if(type=='exam') {//如果是exam类型，需要传入doQuestionType字段，判断是去做题、重新做题、继续做题。type=0:继续做题，type=2:重新做题,type=1或者不传是去做题。
      let {id,courseId,token,memberId, taskId, courseResourseId, title,exerciseVersionId,exerciseId} = option;
      taskId = taskId || courseResourseId
      if(!taskId||taskId=='no'){
        message.info('暂不支持跳转到该试卷或试题')
        return;
      }
      let times = new Date().getTime() + 30 * 60 * 1000;
      let date = new Date(times);
      let local = window.location;
      let hostname = local.hostname;
      if (/\.zbgedu\.com/.test(hostname)) {
        hostname = 'zbgedu.com'
      }
      document.cookie = "zbgeduId=" + token + ";path=/;domain="+hostname+";expires="+ date.toGMTString() + ";source=source;";


      let uri = this.setUrlPath('tiku')
      let templateSrc = uri+'/page/questionTest?'
      if(id&&id!='no'&&id!='bit_note_lesson'){
        Request.ajax('queryExamenInfo',{
          examenId: id,
          token: token,
        }).then(async (res)=>{

          if(res.state=='success'){
            const {versionId,testSeason,itemId, classId} = res.data;
            let taskIdInfo={}
             Request.ajax('getTaskInfoById',{                     // 根据taskId查详情
              token: token,
              taskId:taskId || courseResourseId         // 面授课跳转过来的时候 取courseResourseId进行查询
            }).then((result)=>{
              if(result.state == 'success'){
                taskIdInfo = result.data
              }
            })
            let {taskName, chapterId, chapterName, courseName, subjectId, subjectName, categoryId, categoryName} = taskIdInfo
            taskName = encodeURIComponent(taskName)
            chapterName = encodeURIComponent(chapterName)
            subjectName = encodeURIComponent(subjectName)
            categoryName = encodeURIComponent(categoryName)
            courseName = encodeURIComponent(courseName)
            title = encodeURIComponent(title)        // 试卷名称
            let type = 'cma',
              question = 'practice' ,               // question=practice（章节练习）mock（综合模考)
              testPaperType = 6                   //  练习

            //itemId 1acca 0cma
            if(itemId == 1){
              templateSrc = uri+'/questionTest?'
              type = 'acca'
            }
            if(option.taskLevel == "appraisal"){    //测评
              question = 'mock'
              testPaperType = 4
            }
            let examType = 2
            if(option.doQuestionType == 0){
              examType = 2
            }else if(option.doQuestionType == 2){  //重新做题
              //question='reform'
              examType = 3
            }
            let isParsing=''
            if(option.isParsing == 1){              //查看解析时
              isParsing=1
              question = "analysis"
            }
            let redoError = ''
            let studentTestPaperId=''
            if(option.doErrorQuestion == 1){        //重做错题时
              question = "reform"
              redoError=1
              studentTestPaperId = option.studentTestPaperId
            }

            let isParsingOfError=''
            if(option.checkErrorQuestion == 1){     //查看错题解析时
              question = "analysis"
              isParsing=1
              isParsingOfError=1
              studentTestPaperId = option.studentTestPaperId
            }


            // testPaperType           6 练习 4测评
            // /questionTest?			     ACCA 模板
            // /page/questionTest?	   CMA  模板
            // testPaperId			       试卷 id
            // question           	   试卷类型  综合模考mock  章节练习 practice
            // examType=2&			       重新做题为3  2继续做题 2去做题
            // token				           用户token
            // courseId			           课程id
            // courseVersionId			   课程版本id
            // answerSource=1			     答题来源   1 学习中心
            // redirect     			     返回的地址  返回时加上token
            // itemId 				         项目id 为1时acca模板 其他cma模板
            // versionId 			         课程id
            // testSeason 			       课程版本id
            // isParsing=1             查看解析时需传 值为 1
            // taskId                  任务ID
            // taskName                任务名称
            // chapterId               章节ID
            // chapterName             章节名称
            // courseId                课程ID
            // courseName              课程名称
            // subjectId               科目ID
            // subjectName             科目名称
            // categoryId              证书ID
            // categoryName            证书名称
            // classId                 班级ID
            // memberId                用户id
            // type                    itemId == 1 'acca' 否则 'cma'
            // testPaperName           试卷名称


            //答疑笔记列表跳转题库
            if(option.source=='source' && (exerciseVersionId||exerciseId)){ //试题id
              let href= templateSrc+'testPaperId='+id+'&itemId='+itemId+'&isParsing=1&question=questionVersionInfo&questionVersionId='+(exerciseVersionId||exerciseId)
              console.log(href)
              window.open(href,'_blank')
            }else{
              let href = templateSrc + 'testPaperId='+id+'&categoryId='+categoryId+'&subjectId='+subjectId+'&chapterId='+chapterId+'&courseName='+courseName+'&categoryName='+categoryName+'&testPaperName='+title+'&subjectName='+subjectName+'&chapterName='+chapterName+'&taskName='+taskName+'&isParsing='+isParsing+'&itemId='+itemId+'&isParsingOfError='+isParsingOfError+'&classId='+classId+'&studentTestPaperId='+studentTestPaperId+'&redoError='+redoError+'&taskId='+(taskId ||courseResourseId) +'&question='+question+'&examType='+examType+'&type='+type+'&testPaperType='+testPaperType+'&token='+token+'&courseId='+courseId +'&memberId='+memberId+'&courseVersionId='+versionId+'&linkSource=1'+'&answerSource=1&redirect='+encodeURIComponent(window.location.href)
              console.log(href)
              window.open(href,'_blank')
            }
          }
        })
      }else{
        message.config({
          top:'40%'
        })
        message.info('试卷已下架');
        //window.location.href= templateSrc + 'testPaperId='+id+'&categoryId=no&subjectId=no&chapterId=no&courseName=no&categoryName=no&testPaperName='+title+'&subjectName=no&chapterName=no&taskName='+option.title+'&isParsing='+isParsing+'&itemId=no&isParsingOfError=1&classId=no&studentTestPaperId=&redoError=&taskId=no&question=practice&examType=3&type='+type+'&testPaperType=6&token='+token+'&courseId='+courseId +'&memberId='+memberId+'&courseVersionId=no&linkSource=1'+'&answerSource=1&redirect='+encodeURIComponent(window.location.href)
      }
    }else if(type == 'pdf'||type=='pdfread'||type=='document'){
      const {pdfUrl,classId,courseId,courseName,taskId,title,isSlider=true} = option;
      const url = encodeURI(window.location.protocol+'//exstatic.zbgedu.com'+pdfUrl)
      router.push('/documentRead?url='+url+'&classId='+(classId||'')+'&courseId='+courseId+'&courseName='+courseName+'&taskId='+taskId+'&taskName='+title+'&courseType=onlinecourse&isSlider='+isSlider)
      window.location.reload()
    }else if(type == 'live'||type == 'openCourse'){
      console.log(option)
      if(option.liveType == 1){  //liveType为1时是正在直播，为2时是去看回放
        let obj = {
          liveName:option.title,
          liveManagePassword:option.openCourseLiveRoomPassword,
          liveRoomId:option.openCourseLiveRoomId,
          liveManageId:option.openCourseLiveManageId,
          taskId:option.taskId
        }
        router.push('/live/room/?data='+JSON.stringify(obj))
      }else{
        const {courseId,taskId,classId,chapterId,courseType} = option;
        const chapterName = option.chapterName||option.chapterTitle
        router.push('/video?courseId='+courseId+'&taskId='+taskId+'&classId='+classId+'&chapterName='+chapterName+'&chapterId='+chapterId+'&courseType='+courseType||'')
      }
    }else if(type == 'course' || type == 'chapter'){
      window.location.href=('/#/courseStudy/'+option.courseId+'/courseIntroduction')
    }

  }

}
