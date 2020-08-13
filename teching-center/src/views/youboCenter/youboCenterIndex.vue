<template>
<div class="youboCenterIndex-wrap">
  <div v-if="classDetailInfo" class="youboCenterIndex-content">
    <iScroll  :id="'youboCenterIndexContent'" :is-refresh="scrollRefresh" :toTop="false">
      <div class="week-wrap" v-for="(item,index) in classDetailInfo" :key="index">
        <div class="week-title" @click="toggleWeek(item,index)">
          <div class="week-title-left">第{{index+1}}周计划：{{webApi.formatDate(item.classStartDate,'YMD')}}至{{webApi.formatDate(item.classEndDate,'YMD')}}</div>
          <div class="week-title-right">任务总数：{{item.taskNum?item.taskNum:0}}个      视频总时长：{{item.videoTime?webApi.formatSeconds(item.videoTime):'0h0m0s'}}</div>
        </div>
        <template v-if="item.showDetail">
          <div v-for="(option,index) in item.chapters" :key="index" class="week-content">
            <div class="chapter-wrap" v-if="!option.isTasks">
              <div :class="['chapter-title','chapter-title'+option.level]">{{option.chapterTitle}}</div>
              <div v-if="option.tasks&&option.tasks.length>0">
                <ul class="node-ul">
                  <li class="node-li" @click="previewTask(option2)" v-for="(option2,index) in option.tasks" :key="index"><taskLi :taskInfo="option2"></taskLi></li>
                </ul>
              </div>
            </div>
            <div v-else>
              <div class="chapter-node-title">{{option.title}}</div>
              <ul class="node-ul">
                <li class="node-li" @click="previewTask(option2)" v-for="(option2,index) in option.tasks" :key="index"><taskLi :taskInfo="option2"></taskLi></li>
              </ul>
            </div>
          </div>
        </template>
      </div>
    </iScroll>
  </div>
  <div v-else>
    <iLoading></iLoading>
  </div>
  <div class="videoPlayer-wrap" v-if="showPreview">
    <examenSource @closeExamen="closeExamen" :examenInfo="taskInfo" v-if="taskInfo.taskType=='exam'"></examenSource>
    <div class="videoPlayer-wrap-content" v-else>
      <videoPlayer :videoParams="taskInfo" v-if="taskInfo.taskType=='video'"></videoPlayer>
      <pdfPreview :taskInfo="taskInfo" v-if="taskInfo.taskType=='pdfread'"></pdfPreview>
      <i class="close-btn" @click="close"></i>
    </div>

  </div>


</div>
</template>

<script>
  import Request from '../../request'
  import iLoading from '@/components/i-loading'
  import iScroll from '@/components/i-scroll'
  import {mapState} from 'vuex'
  import taskLi from '@/components/taskLi'
  import videoPlayer from '@/components/videoPlayer'
  import examenSource from '@/components/examenSource'
  import pdfPreview from '@/components/pdfPreview'
  export default {
    name: "youboCenterIndex",
    components:{
      iLoading,
      iScroll,
      taskLi,
      videoPlayer,
      pdfPreview,
      examenSource
    },
    props:{
      test:String
    },
    computed:{
      ...mapState({
        host: state => state.global.host,
      }),
      techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))}
    },
    data(){
      return{
        classDetailInfo:'',
        scrollRefresh:false,
        showPreview:false,
        showVideoPlayer:false,
        showPdfPreview:false,
        taskInfo:'',
      }
    },
    mounted(){
      this.getClassDetail()
    },
    methods:{
      getClassDetail(){
        Request.ajax('queryStudyPlanDetail',{
          classId: this.$route.params.classId,
          token: this.techLoginInfo.token,
        }).then((res)=>{
          if(res && res.state=='success'){
            res.data.forEach((item,index) => {
              item.showDetail = false    //展开收起
              if(item.isCurrentWeek){
                item.showDetail = true
              }
            })
            this.classDetailInfo = res.data
            this.scrollRefresh = !this.scrollRefresh
            //this.searchCourseAppraisalTaskBySubjectId()
          }else{
            //this.classDetailInfo = {}
            //this.webApi.alert(res.msg||'服务器异常，请稍后重试～')
          }
        })
      },
      close(){
        this.showPreview = false
      },
      closeExamen(){
        this.showPreview = false
      },
      toggleWeek(weekItem,weekIndex){
        this.classDetailInfo.forEach((item,index) => {
          if(weekIndex == index){
            item.showDetail = !item.showDetail
          }
        })
        this.scrollRefresh = !this.scrollRefresh
      },
      previewTask(params){

        /*if(params.taskType=='exam'){
          this.webApi.alert('暂不支持预览该类型任务~')
          //return
        }*/
        if(params.taskType == 'openCourse'){
          if(params.openCourseSiteId||params.openCourseCcid){
            params.taskType = 'video'
          }else{
            this.webApi.alert('暂不支持预览该类型任务~')
            return
          }
        }
        this.taskInfo = params
        this.showPreview = true
      }
    }
  }
</script>

<style lang="stylus">
.youboCenterIndex-wrap
  height 100%
  .youboCenterIndex-content
    height 100%
    padding-bottom 20px
    .week-wrap
      border-radius:10px;
      overflow hidden
      background #fff
      margin-top 20px
      .week-title
        height 50px
        line-height 50px
        background #f2f2f2
        cursor pointer
        .week-title-left
          font-size 14px
          font-weight bold
          color #333
          float: left
          margin-left 30px
        .week-title-right
          font-size 12px
          float: right
          margin-right 15px
      .week-content
        .chapter-wrap
          .chapter-title
            height 40px
            line-height 40px
            font-size 14px
            color #333
            margin-left: 30px
          .chapter-title2
            margin-left: 45px
          .chapter-title3
            margin-left: 60px
        .chapter-node-title
          font-size 14px
          color #333
          height 40px
          line-height 40px
          margin-left: 60px
        .node-ul
          margin-left: 90px
          .node-li
            height 30px
            line-height 30px
            font-size 14px
            color #666
  .videoPlayer-wrap
    position fixed
    width 100%
    height 100%
    top 0
    left 0
    background rgba(0,0,0,0.6)
    .videoPlayer-wrap-content
      width 1200px
      height 80%
      position absolute
      top 50%
      left 50%
      transform translate(-50%,-50%)
      .close-btn
        display inline-block
        width 26px
        height 26px
        background #333 url("../../assets/img/icon_image.png") no-repeat -127px 0px
        border-radius 50%
        float right
        position absolute
        top -14px
        right -10px
        cursor pointer
  .ll
    width 0
</style>
