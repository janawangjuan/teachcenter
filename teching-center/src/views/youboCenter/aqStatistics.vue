<template>
  <div class="aqStatistics-wrap">
    <div class="aq-title">
      答疑数据统计
    </div>
    <div class="aq-content">
      <div class="content-left">
        <div class="aqPie" id="aqPie"></div>
      </div>
      <div class="content-right">
        <div class="right-title">
          <div class="r-t-left">
            <ul class="type-ul">
              <li :class="['type-li',item.value==type?'current':'']" v-for="(item,index) in allType" @click="selectType(item)">{{item.name}}</li>
            </ul>
            <multipleSearchInput  @search="search" class="search-wrap"></multipleSearchInput>
            <div class="date-wrap">
              <el-date-picker
                v-model="askTime"
                type="daterange"
                unlink-panels
                range-separator="至"
                size="mini"
                @change="changeAskTime()"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                :picker-options="pickerOptions0"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </div>
          <div class="r-t-right">
            <i v-if="isWarning" class="icon-yj"></i><span style="cursor: pointer" @click="changeWarning">切换{{isWarning?'全部':'预警'}}问题</span>
          </div>
        </div>
        <div class="right-content">
          <template v-if="exchangeListData">
            <div v-if="this.webApi.isEmpty(exchangeListData.data)" class="no-data-wrap">
              <div class="no-data">
                <div class="img-wrap">
                  <img class="img-no" src="../../assets/img/class-nodata.png" alt="暂无内容">
                </div>
                <p class="no-text">暂无答疑</p>
              </div>
            </div>
            <iScroll :id="'exchangeManage'" :is-refresh="scrollRefresh" v-else>
              <ul class="ac-list-ul">
                <div>
                  <li class="ac-list-li" :class="[activeIndex == index?'active':'']" v-for="(item,index) in exchangeListData.data">
                    <div class="ac-list-a">
                      <a class="ac-list-li-content js-ac-list-active" href="javascript:;" @click="openDetail(item)">
                        <div class="source-wrap">
                          <div class="source-wrap-small">
                            <div class="source-wrap-mini">
                              源自：
                              <span :title="item.courseName+' + '+item.chapterName" v-if="item.taskType=='chapter'">{{item.courseName}} + {{item.chapterName}}</span>
                              <span :title="item.courseName+' + '+item.chapterName" v-if="item.taskType=='video'">{{item.courseName}} + {{item.chapterName}}</span>
                              <span :title="item.courseName" v-if="item.taskType=='course'||item.taskType==''">{{item.courseName}}</span>
                              <template v-if="item.taskType=='exam'">
                                <span :title="item.sourcePath" v-if="item.sourcePath">{{item.sourcePath}}</span>
                                <span :title="item.courseName+' + '+item.chapterName +''+ (item.taskCurrent?(' + 第'+item.taskCurrent+'题'):'')" v-else>{{item.courseName}} + {{item.chapterName}}{{item.taskCurrent?' + 第'+item.taskCurrent+'题':''}}</span>
                              </template>
                            </div>
                            <div class="ac-list-info-div" v-if="item.taskprogress != '-1' && item.taskType != ' ' && item.taskType == 'video' && item.courseId && item.courseId != ' ' && item.chapterId && item.chapterId != ' ' && item.taskId && item.taskId != ' '?webApi.formatType(item.taskType,item.taskprogress):''">
                              <a class="ac-list-info-span ac-list-info-video" href="javascript:;"  @click.stop="checkVideoSource(item)">
                                <i class="icon-wrap icon-source-video"></i>
                                <span class="ac-desc-video-time">{{ item.taskprogress != '-1' && item.taskType != ' ' && item.taskType == 'video' && item.courseId && item.courseId != ' ' && item.chapterId && item.chapterId != ' ' && item.taskId && item.taskId != ' '?webApi.formatType(item.taskType,item.taskprogress):''}} </span>
                              </a>
                            </div>
                            <div class="ac-list-info-div" v-if="item.taskType == 'exam'"><div class="exam-wrap" @click.stop="checkExamSource(item)"><i class="icon-wrap icon-source-exam"></i><span class="text-wrap">题目</span></div> </div>
                          </div>
                        </div>
                        <div class="ac-list-title">
                          <div class="flex-l">
                            <div class="iconWrap">
                              <div class="chulizhong" v-if="item.isProcessing == '1'">

                              </div>
                              <template v-else>
                                <div class="hasResolve usual-style" v-if="item.solve=='1'">
                                  <i>✓</i>已解决
                                </div>
                                <div class="noAnswer usual-style" v-else-if="item.solve=='0'">
                                  <i>?</i>未回复
                                </div>
                                <div class="noResolve usual-style" v-else-if="item.solve=='2'">
                                  <i>!</i>已回复
                                </div>
                                <div class="question-closely usual-style" v-else-if="item.solve=='3'">
                                  <i>⇧</i>学员追问
                                </div>
                              </template>
                            </div>
                            <span class="ac-list-title-span">{{ item.title }}</span>
                          </div>
                          <div class="flex-r">
                            <div class="post-time-wrap">{{webApi.formatDate(item.updateTime,'ALL')}}<div class="yujing-icon-wrap" v-if="(currentTime-item.updateTime)>43200&&(item.solve=='0'||item.solve=='3')"><i class="yujing-icon"></i></div></div>
                          </div>
                        </div>
                        <p class="ac-list-desc">{{ item.contentSummary }}</p>

                      </a>
                      <div class="ac-list-info">
                        <p class="ac-list-info-user"><img class="avatar" :src="host.img+item.headImg"><span class="ac-list-info-span user-name">{{ item.nikeName }}</span></p>
                        <ul class="ac-list-info-ul">
                          <li class="ac-list-info-li"><span class="ac-list-info-span"><i class="iconfont icon-duihua"></i><span class="ac-list-info-discuss-num">{{ item.replyCount ? item.replyCount : 0 }}条评论</span></span></li>
                        </ul>
                      </div>
                    </div>
                  </li>
                  <div class="text-count">
                    ∗当页查询到{{exchangeListData.data.length}}个问题，共查询到{{exchangeListData.totalCount}}个问题
                  </div>
                  <iPagination :isRefresh="scrollRefresh1" :pageNo="pageNo" :pageSize="pageSize" :totalCount="exchangeListData.totalCount?exchangeListData.totalCount:0" @pageChange="jumpPage" @pagePrev="prevPage" @pageNext="pageNext"></iPagination>
                </div>

              </ul>
            </iScroll>
          </template>
          <div style="margin-top: 50px" v-else>
            <iLoading></iLoading>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-wrap" v-if="showExamDeatailModal">
      <div class="content-wrap">
        <i class="close-btn" @click="close"></i>
        <div class="content">
          <exchangeDeatail :exchangeData="exchangeData" :canClick="true"></exchangeDeatail>
        </div>
      </div>
    </div>
    <div class="video-player-wrap"  v-if="showVideoSource">
      <div class="v-p-w-content">
        <div class="video-title">问题来源
          <i class="close-btn" @click="closeVideo"></i>
        </div>
        <div class="video-wrap">
          <videoPlayer :videoParams="sourceParams"></videoPlayer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import Request from '@/request'
  import iScroll from '@/components/i-scroll'
  import exchangeDeatail from '../exchange/exchangeDetail'
  import iPagination from '@/components/i-pagination'
  import iLoading from '@/components/i-loading'
  import multipleSearchInput from '@/components/multipleSearchInput'
  import videoPlayer from '@/components/videoPlayer'
  import {mapState,mapActions} from 'vuex'
  export default {
    name: "aqStatistics",
    components:{
      iScroll,
      exchangeDeatail,
      iPagination,
      multipleSearchInput,
      iLoading,
      videoPlayer
    },
    data(){
      return{
        allType:[{name:'未回复',value:'0'},{name:'学员追问',value:'3'},{name:'已回复',value:'2'},{name:'已解决',value:'1'}],
        type:0,  //从优播课列表直接点进来 0:已解决 1:未回复 2:已回复 3:追问
        askTime:null,
        start_time:'',
        currentTime:'',
        isWarning:false,
        scrollRefresh:false,
        scrollRefresh1:false,
        end_time:'',
        pickerOptions0: {   //设置提问时间不能大于当天
          disabledDate(time) {
            return time.getTime() > Date.now();//如果没有后面的-8.64e7就是不可以选择今天的
          }
        },
        time:'',
        aqData:'',
        selectObj:'',
        pageNo:1,
        pageSize: 20,
        keyWords:'',
        exchangeListData:'',
        exchangeData:{},
        showVideoSource:false,
        showExamDeatailModal:false,
      }
    },
    computed : {
      ...mapState({
        host: state => state.global.host,
        //envType:state => state.global.envType,
        //teacherClass: state => state.global.teacherClass
      }),
      techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))}
    },
    mounted(){
      this.currentTime = Date.parse(new Date())/1000;
      if(this.webApi.getUrlKey('type')){
        let str = this.webApi.getUrlKey('type')
        if(str == 0){
          this.type = 1
        }else if(str == 1){
          this.type = 0
        }else{
          this.type = str
        }
      }
      //this.drawPie()
      this.getCount()

      this.getExchangeListAjax()
    },
    methods: {
      checkVideoSource(params){
        this.showVideoSource = true
        this.sourceParams = params
      },
      closeVideo(){
        this.showVideoSource = false
      },
      checkExamSource(params){
        let times = new Date().getTime() + 30 * 60 * 1000;
        let date = new Date(times);
        let local = window.location;
        let hostname = local.hostname;
        if (/\.zbgedu\.com/.test(hostname)) {
          hostname = 'zbgedu.com'
        }
        //document.cookie = "zbgeduId=" + this.techLoginInfo.token + ";path=/;domain="+hostname+";expires="+ date.toGMTString() + ";source=source;";
        this.cookie.remove('zbgeduId')
        let str = 'mstiku'
        if(this.envType == '1'){
          str = 'mstikudemo'
        }
        //this.frameUrl = 'https://'+str+'.zbgedu.com/preview?question=getAnswerAnalysis&type=acca&value='+this.examenInfo.taskId+ '&id=' + this.techLoginInfo.token+'agent=0';

        Request.ajax('getTaskInfoAndProgress',{
          token:this.techLoginInfo.token,
          taskId:params.taskId
        }).then(res=>{
          if(res.state == 'success'){
            this.frameUrl = 'https://'+str+'.zbgedu.com/preview?question=paperInfoPreview&type='+(res.data.itemId==1?'acca':'cma')+'&value='+res.data.examenId+ '&id=' + this.techLoginInfo.token+'&agent=0';
            window.open(this.frameUrl)
          }else{
            this.$api.alert('服务器异常，请重试~')
          }
        })
        /*this.showExamSource = true
        this.examParams = params*/
      },
      openDetail(param){
        this.exchangeData = param
        this.showExamDeatailModal = true
      },
      close(){
        this.showExamDeatailModal = false
      },
      search(params) {
        console.log(params)
        this.selectObj = params
        //this.keyWords = searchTxt;
        this.pageNo = 1;
        this.getExchangeListAjax();
        //this.$refs.searches.value = '';
        //this.keyWords = '';
      },
      getExchangeListAjax() {
        this.exchangeListData = ''
        this.firstOpen = true
        this.exchangeDetailData = {}
        let time = this.time
        let params = {
          "self": 0,
          "type": 3,
          "ordertype": 5,
          "pageNo": this.pageNo,
          "pageSize": this.pageSize,
          "subjectId": '',
          'knowledge_node_path1':'',
          'knowledge_node_path2':'',
          'token' : this.techLoginInfo.token,
          'keyWords' : '',
          'classId' : this.$route.params.classId,
          'teaching_type' : '',
          'courseId' : '',
          'solve': this.type,
          'start_time':this.start_time,
          'end_time':this.end_time,
          'taskType': '',
          'time':time,
          'chapterId':'',
          'memberId':this.techLoginInfo.id,
        }
        if(this.selectObj){
          if(this.selectObj.type == 1){
            params.keyWords = this.selectObj.keyWords
          }else if(this.selectObj.type == 2 || this.selectObj.type == 3){
            params.studentId = this.selectObj.selectUser.memberId
          }else{
            params.teacherId = this.selectObj.selectUser.memberId
            params.is_teacher_answer = 1
          }
        }
        Request.ajax('bbslist',params).then((res)=>{
          if(res && res.state == 'success'){
            this.exchangeListData = res
            this.activeIndex = 0
            this.exchangeDetailData = res.data[0]?res.data[0]:{};
          }
          this.$nextTick(()=>{
            this.scrollRefresh = !this.scrollRefresh;
            /*setTimeout(()=>{
              this.scrollRefresh = !this.scrollRefresh;
            },200)*/
          })

        })
      },
      getCount(){
        Request.ajax('classBbsCount',{
          'token':this.techLoginInfo.token,
          'classId' : this.$route.params.classId,
        }).then(res => {
          if(res && res.state=='success'){
            let obj = res.data
            this.aqData = [
              {value: obj.unanswered, name: '未回复'},
              {value: obj.replied, name: '已回复'},
              {value: obj.asked, name: '学员追问'},
              {value: obj.resolved, name: '已解决'},
            ]
            this.drawPie()
          }
        })
      },
      selectType(params){
        this.type = params.value
        this.pageNo = 1
        this.getExchangeListAjax()
      },
      changeAskTime(){   //改变提问时间
        if(this.askTime == null){
          this.start_time = ''
          this.end_time = ''
        }else{
          this.start_time = this.askTime[0]
          this.end_time = this.askTime[1]
        }
        this.pageNo = 1
        this.getExchangeListAjax()
      },
      changeWarning(){
        if(this.isWarning){
          this.time = ''
        }else{
          this.time = 12
        }
        this.isWarning = !this.isWarning
        this.pageNo = 1
        this.type=0
        this.getExchangeListAjax()
      },
      jumpPage(index){
        this.pageNo = index;
        this.getExchangeListAjax();
      },
      prevPage(){
        this.pageNo = this.pageNo-1;
        this.getExchangeListAjax();
      },
      pageNext(){
        this.pageNo = this.pageNo+1;
        this.getExchangeListAjax();
      },
      drawPie() {
        const chartPie = echarts.init(document.getElementById('aqPie'));
        chartPie.setOption({
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            orient: 'horizontal',
            x: 'center',
            y: 'bottom',
            data: ['未回复', '已回复', '学员追问', '已解决']
          },

          color:['#F6B55A','#FC5A5F','#7BC16D','#3AA6FC'],
          series: [
            {
              name: '占比',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '10',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: true
                }
              },
              data: this.aqData
            }
          ]
        })
      }
    }
  }
</script>

<style lang="stylus">
  .aqStatistics-wrap {
    height 100%
    display flex
    flex-direction: column;
    .aq-title{
      height 55px
      line-height 55px
      font-size:18px;
      font-weight:bold;
      color:#333;
    }
    .aq-content{
      flex 1
      display flex
      height 100%
      overflow hidden
      .content-left{
        width 320px
        background #fff
        border-radius:4px;
        .aqPie{
          width 320px
          height 350px
        }
      }
      .content-right{
        flex 1
        background #fff
        padding 0 20px;
        border-radius:4px;
        margin-left 10px;
        height 100%
        display flex
        flex-direction column
        .right-title{
          border-bottom 1px solid #eee
          height auto
          display flex
          .r-t-left{
            flex 1
            .search-wrap{
              margin-top 20px
              margin-right 10px
            }
          }
          .r-t-right{
            width 150px
            text-align right
            line-height 70px
            font-size 12px
            color #666
            .icon-yj{
              display inline-block
              position relative
              top 7px
              width 25px
              height 25px
              margin-right 5px
              background url("../../assets/img/icon_image.png") no-repeat -247px -150px
            }
          }
          .type-ul{
            margin-left 10px
          }
          .type-li{
            float: left
            margin-right 20px
            line-height 24px
            margin-top 24px
            font-size 14px
            color #666
            cursor pointer
          }
          .current{
            color #FC5386
          }
          .date-wrap{
            display inline-block
            height 70px
            line-height 70px
          }
        }
        .right-content{
          flex 1
          overflow hidden
          .no-data-wrap {
            width 100%
            height 100%
            position relative
            .no-data {
              position absolute
              top 50%
              left 50%
              transform: translate(-50%, -50%);
              .img-wrap {
                text-align center
                .img-no {
                  width 196px
                  height 190px
                }
              }
              .no-text {
                margin-top 15px
                text-align center
                font-size 14px
                color #333
              }
            }
          }
        }
      }
    }
  }
  .ac-list-ul
    .ac-list-li
      overflow: hidden;
      border-top: 1px solid #E9E9E9;
      margin-top: -2px;
      padding 12px 10px 12px
      .ac-list-a
        float: left;
        display: inline-block;
        width: 100%;
        height: 100%;
        padding: 0 10px;
        .ac-list-li-content
          position: relative;
          display inline-block
          width 100%
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          padding-left: 0;
          .ac-list-desc
            line-height: 25px;
            overflow: hidden;
            text-overflow: initial;
            white-space: initial;
            width: 100%;
            font-size: 14px;
            margin-top 10px
            color: #333;
          .ac-list-title-span
            font-size 16px
            color #333
            font-weight bold
          .source-wrap
            height 34px
            color #999
            font-size 13px
            line-height 34px
            .icon-wrap
              display inline-block
              width 14px
              height 14px
              margin-right 3px
              position relative
              top 2px
            .icon-source-video
              background url("../../assets/img/icon_image.png") no-repeat -40px -76px
            .icon-source-exam
              background url("../../assets/img/icon_image.png") no-repeat -39px -37px
            .ac-list-info-div
              display inline-block
              height 20px
              padding 0 5px
              font-size 12px
              line-height 20px
              background #ff366d
              border-radius 10px
              color #fff
              position: relative;
              top: -12px;
              .ac-list-info-span
                color #fff
                font-size: 12px;
                color: #B5A2A7;
                cursor: default;
                .iconfont
                  padding-right: 5px;
            .yujing-icon-wrap
              float right
              height 25px
              width 30px
              margin-top 3px
              .yujing-icon
                display inline-block
                width 25px
                height 25px
                background url("../../assets/img/icon_image.png") no-repeat -247px -150px
          .source-wrap-small
            flex 1
            overflow: hidden;
            margin-top 5px
            height: 28px;
            color: #999;
            font-size: 13px;
            line-height 32px
            .source-wrap-mini
              display inline-block
              max-width 80%
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            .icon-wrap
              display inline-block
              width 14px
              height 14px
              margin-right 3px
              position relative
              top 2px
            .icon-source-video
              background url("../../assets/img/icon_image.png") no-repeat -40px -76px
            .icon-source-exam
              background url("../../assets/img/icon_image.png") no-repeat -39px -37px
            .ac-list-info-div
              display inline-block
              height 20px
              padding 0 5px
              font-size 12px
              line-height 20px
              background #ff366d
              border-radius 10px
              color #fff
              position: relative;
              top: -12px;
              .ac-list-info-span
                color #fff
            .ac-list-info-div
              width auto
          .ac-list-title
            display flex
            width: 100%;
            height: 100%;
            line-height: 20px;
            color: #3E4E63;
            font-size: 16px;
            overflow: hidden;
            .flex-l
              flex 1
              height 20px
              overflow hidden
            .flex-r
              width 150px
              text-align right
              .post-time-wrap
                font-size 12px
                color #999
                .yujing-icon-wrap
                  float right
                  height 25px
                  width 30px
                  margin-top -3px
                  .yujing-icon
                    display inline-block
                    width 25px
                    height 25px
                    background url("../../assets/img/icon_image.png") no-repeat -247px -150px
          .iconWrap
            float left
            .chulizhong
              width 77px
              height 22px
              background url("../../assets/img/icon_image.png") no-repeat -0px -282px
            .yujing-wrap
              float right
              .icon-yujing
                display inline-block
                width 25px
                height 25px
                background url("../../assets/img/icon_image.png") no-repeat -247px -113px
            .usual-style
              width 78px
              height 20px
              float: left
              border-radius 10px
              text-align center
              font-size 13px
              padding-left 18px
              position relative
              line-height 18px
              margin-right 5px
              i
                display inline-block
                width 18px
                height 18px
                border-radius 10px
                font-style normal
                text-align center
                color #fff
                line-height 18px
                position absolute
                left 0
            .hasResolve
              color #729cd6
              border 1px solid #729cd6
              i
                background #729cd6
            .noAnswer
              border 1px solid #f29754
              color #f29754
              i
                background #f29754
            .noResolve
              border 1px solid #ff5656
              color #ff5656
              i
                background #ff5656
            .question-closely
              border 1px solid #5BBF48
              color #5BBF48
              i
                background #5BBF48
    .text-count
      font-size 12px
      color #f06e50
      padding-left 10px
      border-top: 1px solid #e9e9e9;
      line-height 30px
    .ac-list-li.active
      .ac-list-a
        .ac-list-li-content
          .ac-list-title-span
            color #ff366d
          .iconWrap
            .yujing-wrap
              .icon-yujing
                background url("../../assets/img/icon_image.png") no-repeat -247px -68px
  .ac-list-ul
    .ac-list-li
      .ac-list-info
        font-size 12px
        color #b5a2a7
        overflow: hidden;
        margin-bottom: 6px;
        .ac-list-info-user
          float: left;
          display: inline-block;
          margin: 3px 0 0;
          line-height: 32px;
          .avatar
            float: left;
            width: 32px;
            height: 32px;
            -moz-border-radius: 50%;
            -webkit-border-radius: 50%;
            border-radius: 50%;
            margin: 0 10px 0 0;
          .user-name
            font-size: 12px;
            color: #B5A2A7;
        .ac-list-info-ul
          overflow: hidden;
          padding: 9px 0;
          .ac-list-info-li
            float: left;
            padding: 0 3px;
            margin-left 20px
            .exam-wrap
              width 75px
              height 20px
              border 1px solid #acacac
              color #fff
              cursor pointer
              .icon-wrap
                display inline-block
                width 18px
                height 18px
                background url("../../assets/img/icon_image.png") no-repeat 3px -36px
                float: left
              .text-wrap
                display inline-block
                font-size 12px
                width 55px
                height 18px
                line-height 18px
                text-align center
                background #acacac
                float left
            .ac-list-info-video
              width 75px
              height 20px
              border 1px solid #acacac
              color #fff
              float: left;
              font-size: 12px;
              cursor: pointer;
              .ac-desc-video-time
                display inline-block
                float: left
                font-size 12px
                width 55px
                height 18px
                line-height 18px
                text-align center
                background #acacac
                color #fff
    .ac-list-li.active
      .ac-list-a
        background-color: #f7f7f7;
        .ac-list-info
          .ac-list-info-ul
            .ac-list-info-li
              .exam-wrap
                border 1px solid #fff
                color #ff366d
                .icon-wrap
                  background url("../../assets/img/icon_image.png") no-repeat 3px -87px
                .text-wrap
                  background #fff
              .ac-list-info-video
                border 1px solid #fff
                color #ff366d
                .ac-desc-video-time
                  background #fff
                  color #ff366d
  .modal-wrap
    position fixed
    top 0
    left 0
    z-index: 10;
    background rgba(0,0,0,0.5)
    width 100%
    height 100%
    .content-wrap
      position absolute
      top 50%
      left 50%
      transform translate(-50%,-50%)
      width: 700px;
      height 70%;
      .close-btn
        display inline-block
        width 26px
        height 26px
        background #333 url("../../assets/img/icon_image.png") no-repeat -127px 0px
        border-radius 50%
        position absolute
        top -13px
        right -13px
        z-index 5
        cursor pointer
      .content
        height 100%
        overflow hidden
        background #fff
  .video-player-wrap
    position fixed
    background rgba(0,0,0,.3)
    width 100%
    height 100%
    top 0
    left 0
    z-index 99
    .v-p-w-content
      position absolute
      top 50%
      left 50%
      width 900px
      height 600px
      transform translate(-50%,-50%)
      .video-title
        height 50px
        text-align center
        line-height 50px
        font-size 14px
        color #333
        background-color: #f1f1f1
        .close-btn
          display inline-block
          width 26px
          height 26px
          background #333 url("../../assets/img/icon_image.png") no-repeat -127px 0px
          border-radius 50%
          float right
          right 20px
          position relative
          top 13px
          cursor pointer
      .video-wrap
        height 550px





</style>
