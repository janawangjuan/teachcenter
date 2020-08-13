<template>
  <div class="videoPlayer">
    <iframe id="iframe" name="help" allowFullScreen="true" allowTransparency="true" style="border: 0; width: 100%; height: 100%" scrolling="no" frameBorder="0"
    :src="src">
    </iframe>
  </div>
</template>

<script>
  import Request from '@/request'
  export default {
    name: "videoPlayer.vue",
    props:['videoParams'],
    data(){
      return{
        src:'',
        envType:parseInt(this.cookie.get('envType')),
      }
    },
    mounted(){
      console.log(this.videoParams)
      this.getTaskInfo()

    },
    computed:{
      techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))}
    },
    methods:{
      getTaskInfo(){
        Request.ajax('getTaskInfo',{
          token:this.techLoginInfo.token,
          taskId:this.videoParams.taskId
        }).then(res => {
          const obj = res.data
          let host = ''
          host = this.envType == '1' ?  'https://videodemo.zbgedu.com' : 'https://video.zbgedu.com'
          let str = host + '/example?isShowConfig=false&id='+obj.videoId+'&seek='+this.videoParams.taskprogress
          //let search='?ccid=' + (obj.videoCcid||obj.openCourseCcid) + '&token=' + this.techLoginInfo.token + '&memberId=' + this.techLoginInfo.eduUserId + '&memberName=' + this.techLoginInfo.nickName + '&categoryId=' + obj.categoryId + '&categoryName=' + obj.categoryName + '&subjectId=' + obj.subjectId + '&subjectName=' + obj.subjectName + '&classId=' + obj.classId + '&courseId=' + obj.courseId + '&courseName=' + obj.courseName + '&chapterId=' + obj.chapterId + '&chapterName=' + obj.chapterName + '&taskId=' + obj.taskId + '&taskName=' + obj.taskName + '&courseType=' + obj.teachingType + '&phone=' + this.techLoginInfo.mobile+'&siteid='+obj.videoSiteId+'&seek='+this.videoParams.taskprogress+'&isSlider=true';
          this.src = str
        })
      }
    }
  }
</script>

<style lang="stylus">
  .videoPlayer
    width 100%
    height: 100%
    background #27272f
</style>
