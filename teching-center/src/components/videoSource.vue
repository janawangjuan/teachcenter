<template>
  <div class="videoSource-wrap">
    <div class="videoSource-w">
      <el-container>
        <el-header height="50px">问题来源
          <i class="close-btn" @click="close"></i>
        </el-header>
        <el-container>
          <!--<el-aside width="400px">
            <div class="iscroll-wrap">
              <iScroll :id="'videoSourceChapterId'" :is-refresh="scrollRefresh">
                <p class="courseName">{{videoParams.courseName}}</p>
                <el-tree
                  :data="chapterData"
                  :default-expand-all="true"
                  :props="defaultProps"
                  node-key="chapterId"
                  @node-expand="changeScroll"
                  @node-collapse="changeScroll"
                  check-strictly
                  :default-checked-keys="defaultCheckedKeys"
                ></el-tree>
              </iScroll>
            </div>
          </el-aside>-->
          <el-main>
      			<!--<video :muted='isMuted' class="video-player" autoplay="true" id='videoPlay' :src='srcImg' controls>
      			</video>-->
            <iframe allowtransparency="true" width="100%" height="100%" scrolling="no" frameborder="0" :src="prex+'/player.html?ccid='+ccid+'&time='+videoParams.taskprogress"></iframe>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
  import Request from '@/request'
  import iScroll from '@/components/i-scroll'
  export default {
    name: "videoSource",
    props:{
      videoParams:{
        type:Object
      }
    },
    components:{
      iScroll
    },
    data(){
      return{
      	srcImg : 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
        scrollRefresh:false,
      	isMuted: true,
        chapterData:[],
        defaultProps:{
          children: 'children',
          label: 'chapterTitle',
        },
        ccid:'',
        prex:'',
      }
    },
    computed:{
      defaultCheckedKeys(){
        let arr = []
        arr.push(this.videoParams.chapterId)
        return arr
      }
    },
    mounted() {
      this.getChapterData()
      let envType = this.cookie.getJSON('envType') || 0;
      if(envType == 0){
        this.prex = 'https://elearning.zbgedu.com'
      }else{
        this.prex = 'https://elearningdemo.zbgedu.com'
      }
      console.log(this.videoParams)
      console.log(window.location.href.match('localhost'))
			/*this.playVideo()
			var vdo = document.getElementById("videoPlay");
			this.isMuted = false
			vdo.play();*/
		},
   	methods:{
   		/*playVideo(){
        var vdo = document.getElementById("videoPlay");
        //vdo.currentTime = this.videoParams.taskprogress;
        vdo.pause();
     	},*/
      changeScroll(){
        setTimeout(()=>{
          this.scrollRefresh = !this.scrollRefresh
        },500)
      },
      close(){
   		  this.$emit('on-closeVideo')
      },
      getChapterData(){
        Request.ajax('courseDetail',{
          courseId:this.videoParams.courseId
        }).then(res => {
          if(!res || res.state != 'success'){
            this.webApi.alert("查询失败");
            return false;
          }
          this.chapterData = res.data[0].chapters
          this.chapterData.forEach((value, index, array) => {
            if(value.chapterId == this.videoParams.chapterId){
              value.tasks.forEach((value,index,array) => {
                if(value.taskId == this.videoParams.taskId){
                  if(value.taskType == 'openCourse'){
                    this.ccid = value.openCourseCcid
                  }else{
                    this.ccid = value.videoCcid
                  }
                }
              })
            }
            if(value.children.length != 0){
              value.children.forEach((value,index,array) => {
                if(value.chapterId == this.videoParams.chapterId){
                  value.tasks.forEach((value,index,array) => {
                    if(value.taskId == this.videoParams.taskId){
                      if(value.taskType == 'openCourse'){
                        this.ccid = value.openCourseCcid
                      }else{
                        this.ccid = value.videoCcid
                      }
                    }
                  })
                }
                if(value.children.length != 0){
                  value.children.forEach((value,index,array) => {
                    if(value.chapterId == this.videoParams.chapterId){
                      value.tasks.forEach((value,index,array) => {
                        if(value.taskId == this.videoParams.taskId){
                          if(value.taskType == 'openCourse'){
                            this.ccid = value.openCourseCcid
                          }else{
                            this.ccid = value.videoCcid
                          }
                        }
                      })
                    }
                    if(value.children.length != 0){
                      value.children.forEach((value,index,array) => {
                        if(value.chapterId == this.videoParams.chapterId){
                          value.tasks.forEach((value,index,array) => {
                            if(value.taskId == this.videoParams.taskId){
                              if(value.taskType == 'openCourse'){
                                this.ccid = value.openCourseCcid
                              }else{
                                this.ccid = value.videoCcid
                              }
                            }
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          })
          this.scrollRefresh = !this.scrollRefresh
        })
        console.log(this.videoParams)
      }
   	},


  }
</script>

<style lang="stylus">
  .videoSource-wrap
    position fixed
    width 100%
    height 100%
    background rgba(0,0,0,0.6)
    top 0
    left 0
    z-index 999
    .videoSource-w
      width 1200px
      height 80%
      position absolute
      top 50%
      left 50%
      background #fff
      transform: translate(-50%, -50%)
      .el-container
        height 100%
        overflow hidden
        .el-header
          text-align center
          line-height 50px
          font-size 14px
          color #333
          background-color: #f1f1f1
          .close-btn
            display inline-block
            width 26px
            height 26px
            background #333 url("../assets/img/icon_image.png") no-repeat -127px 0px
            border-radius 50%
            float right
            position relative
            top 13px
            cursor pointer
        .el-container
          .el-aside
            padding 10px
            .iscroll-wrap
              height 100%
              .scroll
                .courseName
                  color #666666
                  font-size 14px
                  font-weight bold
                  line-height 28px
                .el-tree
                  .el-tree-node.is-checked>.el-tree-node__content
                    color #f45
          .el-main
            padding 0
            background #000
            height 100%
            text-align center
            .video-player
            	position relative
            	top 50%
            	transform translateY(-50%)
  .jjj
    width 1px

  video::-webkit-media-controls-enclosure {
        overflow:hidden;
    }
  video::-webkit-media-controls-panel {
    width: calc(100% + 30px);
	}
</style>
