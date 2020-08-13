<template>
  <div id="app" class="app youboCenter-wrap">
    <el-container class="youboCenter-wrap-container-wrap">
      <el-header><iHeader></iHeader></el-header>
      <el-container class="youboCenter-wrap-container">
        <el-aside width="160px" class="youboCenter-wrap-aside">
          <ul class="menu-wrap-ul">
            <li class="menu-wrap-li">
              <div class="menu-title">教学任务</div>
              <ul class="menu-ul">
                <li class="menu-li" :class="[getRouter()=='/youboCenter/youboCenterIndex'?'active':'']"  @click="changeRouter('/youboCenter/youboCenterIndex/')">任务预览</li>
              </ul>
            </li>
            <li class="menu-wrap-li">
              <div class="menu-title">数据统计</div>
              <ul class="menu-ul">
                <li class="menu-li" :class="[getRouter()=='/youboCenter/taskStatistics'?'active':'']" @click="changeRouter('/youboCenter/taskStatistics/')">任务统计</li>
                <li class="menu-li" :class="[getRouter()=='/youboCenter/practiceStatistics'?'active':'']"  @click="changeRouter('/youboCenter/practiceStatistics/')">作业统计</li>
                <li class="menu-li" :class="[getRouter()=='/youboCenter/liveStatistics'?'active':'']"  @click="changeRouter('/youboCenter/liveStatistics/')">直播统计</li>
                <li class="menu-li" :class="[getRouter()=='/youboCenter/aqStatistics'?'active':'']"  @click="changeRouter('/youboCenter/aqStatistics/')">答疑辅导统计</li>
              </ul>
            </li>
            <!--<li class="menu-wrap-li">
              <div class="menu-title">学习报告</div>
              <ul class="menu-ul">
                <li class="menu-li" :class="[getRouter()=='/youboCenter/overallReport'?'active':'']" @click="changeRouter('/youboCenter/overallReport/')">整体报告</li>
                <li class="menu-li" :class="[getRouter()=='/youboCenter/studentReport'?'active':'']"  @click="changeRouter('/youboCenter/studentReport/')">学员报告</li>
              </ul>
            </li>-->
          </ul>
        </el-aside>
        <el-main class="youboCenter-el-main">
          <div class="class-usual-info-wrap" v-show="!$route.meta.hideHeader">
            <template v-if="classDetailInfo">
              <div class="img-wrap"><img class="course-img" :src="classDetailInfo.bigCoverPath?host.img+classDetailInfo.bigCoverPath:'/static/flippedClassBg.png'" alt="课程封面图片"></div>
              <div class="title-middle">
                <p class="course-p">{{classDetailInfo.className}}</p>
                <p class="subject-name-p"><span class="mr10">课程：{{classDetailInfo.courseName}}</span><span class="mr10">项目-科目：{{classDetailInfo.categoryName+'-'+classDetailInfo.subjectName}}</span><span class="mr10">学员数：{{classDetailInfo.studentNum}}</span></p>
              </div>
              <div class="title-right">
                <ul class="title-right-ul">
                  <li class="title-right-li mr15">
                    <el-tooltip placement="bottom">
                      <div slot="content" style="font-size: 12px;line-height: 18px;padding: 10px">
                        <template v-if="classDetailInfo.lecturerName">讲师：{{classDetailInfo.lecturerName}}</template>
                        <template v-if="classDetailInfo.teacherName"><br/>班主任：{{classDetailInfo.teacherName}}</template>
                      </div>
                      <div><i class="title-i teacher-info-i"></i><br/>教师信息</div>
                    </el-tooltip>
                  </li>
                  <li class="title-right-li">
                    <el-tooltip placement="bottom">
                      <div slot="content" style="font-size: 12px;line-height: 18px;padding: 10px">
                        视频数：{{classDetailInfo.videoNum}}个<br/>
                        作业：{{classDetailInfo.examNum}}个<br/>
                        文档：{{classDetailInfo.pdfreadNum}}个<br/>
                        直播数：{{classDetailInfo.openCourseNum}}个<br/>
                        视频时长：{{$api.formatSeconds(classDetailInfo.videoTime)}}
                      </div>
                      <div><i  class="title-i study-action-i"></i><br/>学习活动</div>
                    </el-tooltip>
                  </li>
                </ul>
              </div>
            </template>
            <template v-else>
              <iLoading></iLoading>
            </template>
          </div>
          <template>
            <div class="router-view-wrap" v-if="classDetailInfo">
              <router-view :classCourseInfo="classDetailInfo"></router-view>
            </div>
            <div v-else style="margin-top: 40px">
              <iLoading></iLoading>
            </div>
          </template>

        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import iHeader from '../../components/i-header'
  import iLoading from '@/components/i-loading'
  import Request from '../../request'
  import {mapState,mapMutations,mapActions} from 'vuex'
  export default {
    name: "youboCenter",
    components:{
      iHeader,
      iLoading
    },
    mounted(){
      this.getClassDetail()
    },
    computed:{
      ...mapState({
        //techLoginInfo:state => state.global.techLoginInfo,
        selectClassInfo:state => state.classManage.selectClassInfo,
        //classDetailInfo:state => state.classManage.classDetailInfo,
        host:state => state.global.host
      }),
      techLoginInfo(){
        return JSON.parse(this.cookie.get('techLoginInfo'))
      },
    },
    data(){
      return{
        classDetailInfo:''
      }
    },
    methods:{
      getRouter(){     //左侧导航栏对应route.path，截取route.path前两项
        let routerPath = this.$route.path
        let routerPath1 = []
        routerPath1=routerPath.split("/");
        if(routerPath1.length>2){  //大于2表示路由有多级
          routerPath = '/'+routerPath1[1]+'/'+routerPath1[2]
        }else{
          routerPath = '/'+routerPath1[1]
        }
        return routerPath
      },
      changeRouter(params){
        this.$router.push({path:params+this.$route.params.classId})
      },
      getClassDetail(){
        Request.ajax('getClassInfo',{
          token:this.techLoginInfo.token,   //
          classId:this.$route.params.classId
        }).then((res)=>{
          if(res && res.state=='success'){
            this.classDetailInfo = res.data
            //this.searchCourseAppraisalTaskBySubjectId()
          }else{
            this.classDetailInfo = {}
            this.webApi.alert(res.msg||'服务器异常，请稍后重试～')
          }
        })
      },
    }
  }
</script>

<style lang="stylus">
  @import "~@/assets/css/reset.styl"
  #app
    width 100%
    height 100%
    min-width 768px
  .youboCenter-wrap-container-wrap
    overflow hidden
  .youboCenter-wrap-container
    overflow hidden
    height 100%
  .el-container
    height 100%
    &.youboCenter-wrap-container
      overflow hidden
      height 100%
    .youboCenter-wrap-aside
      background #3c4b8e
      .menu-wrap-ul
        background #3c4b8e
        .menu-wrap-li
          padding-left 40px
          margin-top 40px
          color #fff
          .menu-title
            height 20px
            font-size 14px
            color #fff
          .menu-ul
            margin-top 10px
            .menu-li
              font-size 14px
              color #fff
              width 90px
              height 30px
              text-align center
              line-height 30px
              cursor pointer
              margin-top 5px
              &.active
                background #fff
                color #3c4b8e
                border-radius 15px
    .el-header
      border-bottom 1px solid #eee
    .youboCenter-el-main.el-main
      display flex
      flex-direction column
      border none
      height 100%
      overflow hidden
      padding 20px
      background #f9fafb
      .class-usual-info-wrap
        display flex
        height 130px
        background #fff
        width 100%
        border-radius 4px
        .img-wrap
          width 250px
          height 130px
          float: left
          .course-img
           width 250px
           height 130px
        .title-middle
          flex 1
          color #333
          margin-left 30px
          .course-p
            height 50px
            font-size 16px
            line-height 50px
            margin-top 10px
          .subject-name-p
            margin-top 15px
            font-size 14px
            .mr10
              margin-right: 15px
        .title-right
          width 200px
          margin-left 20px
          .title-right-li
            float: left
            width 70px
            text-align center
            font-size 12px
            color #666
            .title-i
              display inline-block
              width 62px
              height 62px
              margin-top 20px
              margin-bottom 5px
            .teacher-info-i
              background url("../../assets/img/icon_image.png") no-repeat -353px -313px
            .study-action-i
              background url("../../assets/img/icon_image.png") no-repeat -454px -329px
          .mr15
            margin-right: 15px
      .router-view-wrap
        flex 1
        overflow hidden
  .jj
    width 0
</style>
