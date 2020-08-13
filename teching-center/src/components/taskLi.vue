<template>
  <div class="task-li-wrap" @click="preview">
    <i :class="['icon-usual',taskInfo.taskType]"></i>{{taskInfo.title}}
    <span v-if="taskInfo.taskType=='exam'" style="margin-left: 30px">作业类型：{{taskInfo.taskLevel=='appraisal'?'测评':'练习'}}</span>
    <span v-if="taskInfo.taskType=='openCourse'" style="margin-left: 30px">开始时间：{{webApi.formatDate(taskInfo.openCourseStartTime,'ALL')}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;结束时间：{{webApi.formatDate(taskInfo.openCourseEndTime,'ALL')}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#ff366d">直播状态：{{taskInfo.openCourseState=='0'?'直播未开始':(taskInfo.openCourseState=='1'?'正在直播':'直播已结束')}}</span> </span>
    <!---->
  </div>
</template>

<script>
  import videoPlayer from '@/components/videoPlayer'
  export default {
    name: "taskLi",
    props:['taskInfo'],
    components:{
      videoPlayer
    },
    methods:{
      preview(){

      }
    },
  }
</script>

<style lang="stylus">
.task-li-wrap
  cursor pointer
  .icon-usual
    display inline-block
    width 20px
    height 20px
    margin-right 5px
    position relative
    top 4px
  .pdfread
    background url("../assets/img/icon_Lc.png") no-repeat 0px -316px
  .video
    background url("../assets/img/icon_Lc.png") no-repeat 1px -347px
  .exam
    background url("../assets/img/icon_Lc.png") no-repeat -48px -348px
  .openCourse
    background url("../assets/img/icon_Lc.png") no-repeat 0px -377px
.ll
  width 0
</style>
