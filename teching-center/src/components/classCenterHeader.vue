<template>
  <div class="classCenterHeader-wrap">
    <template v-if="classDetailInfo">
      <div class="img-wrap"><img class="course-img" :src="classDetailInfo.coverPath?host.img+classDetailInfo.coverPath:'/static/classImg.png'" alt="课程封面图片"></div>
      <div class="title-right">
        <p class="course-p">{{classDetailInfo.courseplanName}}</p>
        <p class="subject-name-p">项目-科目：{{classDetailInfo.itemName+'-'+classDetailInfo.courseCategoryName}}</p>
        <p class="teacher-p">讲师：{{classDetailInfo.realNames}}</p>
      </div>
    </template>
    <template v-else>
      <iLoading></iLoading>
    </template>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import Request from '../request'
  import iLoading from '@/components/i-loading'

  export default {
    name: "classCenterHeader",
    components:{
      iLoading
    },
    props:{
      classId:''
    },
    data(){
      return{
        classDetailInfo:"",
      }
    },
    mounted(){
      this.getClassDetail()
    },
    computed:{
      ...mapState({
        //techLoginInfo:state=>state.global.techLoginInfo
        host: state => state.global.host,
      }),
      techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))}
    },
    methods:{
      getClassDetail(){
        Request.ajax('queryCourseDetail',{
          token:this.techLoginInfo.token,   //
          courseArrangeId:this.classId
        }).then((res)=>{
          if(res && res.state=='success'){
            this.classDetailInfo = res.data
            this.$emit('returnDetailInfo',this.classDetailInfo)
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
  .classCenterHeader-wrap
    width 100%
    height 130px
    background #fff
    border-radius 4px
    overflow hidden
    .img-wrap
      width 250px
      height 130px
      float: left
      .course-img
        width 250px
        height 130px
    .title-right
      float: left
      color #333
      margin-left 30px
      .course-p
        height 50px
        font-size 16px
        line-height 50px
        margin-top 10px
      .subject-name-p
        font-size 14px
      .teacher-p
        height 50px
        font-size 14px
        margin-top 10px
</style>
