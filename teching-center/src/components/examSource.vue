<template>
  <div class="examSource-wrap">
    <div class="examSource-w">
      <el-container>
        <el-header height="50px">问题来源
          <i class="close-btn" @click="close"></i>
        </el-header>
        <el-container>
          <el-main>
            <div class="model-wrap-fix"></div>
            <iframe :src="frameUrl" frameborder="0" style="width:1200px;height:100%" v-show="showIframe"></iframe>
            <iLoading v-if="!showIframe"></iLoading>
            <!--<iframe :src="'http://tm.zbgedu.com/getexamen/index.html#/question/exercise/'+exerciseId" frameborder="0" style="width:100%;height:100%"></iframe>-->
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
  import iScroll from '@/components/i-scroll'
  import iLoading from '@/components/i-loading'
  import Request from '@/request'
  import {mapState,mapActions} from 'vuex'
  export default {
    name: "examSource",
    components:{
      iScroll,
      iLoading
    },
    props:{
      examParams:{
        type:Object
      }
    },
    computed:{
      ...mapState({
        envType:state => state.global.envType,
      }),
      defaultCheckedKeys(){
        let arr = []
        arr.push(this.examParams.chapterId)
        return arr
      },
      techLoginInfo(){
        return JSON.parse(this.cookie.get('techLoginInfo'))
      }
    },
    data(){
      return {
        scrollRefresh:false,
        chapterData:[],
        courseId:this.examParams.courseId,
        //defaultCheckedKeys:['ff8080814eaf7474014eb50fd3370d25'],
        defaultProps:{
          children: 'children',
          label: 'chapterTitle',
        },
        exerciseId:this.examParams.taskId,
        examId:'',
        showIframe:false,
        frameUrl:''
      }
    },
    mounted(){
      this.getFrameUrl()
    },
    methods:{
      close(){
        this.$emit('closeExam')
      },
      getFrameUrl(){
        let times = new Date().getTime() + 30 * 60 * 1000;
        let date = new Date(times);
        let local = window.location;
        let hostname = local.hostname;
        if (/\.zbgedu\.com/.test(hostname)) {
          hostname = 'zbgedu.com'
        }
        document.cookie = "zbgeduId=" + this.techLoginInfo.token + ";path=/;domain="+hostname+";expires="+ date.toGMTString() + ";source=source;";
        let str = 'tiku'
        if(this.envType == '1'){
          str = 'tikudemo'
        }
        const questionVersionId = this.examParams.exerciseVersionId||this.examParams.exerciseId||this.examParams.questionId||''
        Request.ajax('getQuestionById',{
          questionVersionId:questionVersionId
        }).then(res=>{
          if(res.state == 'success'){
            if(res.data.baseInfo.itemId == '1'){
              this.frameUrl = 'https://'+str+'.zbgedu.com/questionTest?question=questionVersionInfo&itemId='+res.data.baseInfo.itemId+'&questionVersionId=' + questionVersionId + '&title=' + this.examParams.sourcePath+'isParsing=1';
            }else{
              this.frameUrl = 'https://'+str+'.zbgedu.com/page/questionTest?question=questionVersionInfo&itemId=' + res.data.baseInfo.itemId + '&questionVersionId=' + questionVersionId + '&title=' + this.examParams.sourcePath+'isParsing=1';
            }
            this.scrollRefresh = !this.scrollRefresh
            setTimeout(()=>{
              this.showIframe = true
            },2000)
          }else{
            this.$api.alert('服务器异常，请重试~')
          }

        })
        //this.frameUrl = window.location.protocol+'//'+str+'.zbgedu.com/#showAnswer?exerciseIds='+this.examParams.exerciseId
      },
      changeScroll(){
        setTimeout(()=>{
          this.scrollRefresh = !this.scrollRefresh
        },500)
      },
    }
  }
</script>

<style lang="stylus">
  .examSource-wrap
    position fixed
    top 0
    left 0
    background rgba(0,0,0,0.6)
    width 100%
    height 100%
    z-index 999
    .examSource-w
      max-width 1200px
      width 100%
      height 80%
      position absolute
      top 50%
      left 50%
      background #fff
      transform: translate(-50%, -50%)
      .el-container
        height 100%
        .el-header
          text-align center
          line-height 50px
          font-size 14px
          color #333
          background #f1f1f1
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
                .el-tree
                  .el-tree-node.is-checked>.el-tree-node__content
                    color #f45
          .el-main
            padding 10px
            background #fff
            position relative
            .model-wrap-fix
              width 300px
              height 200px
              right: 0
              top: 0
              cursor not-allowed
              position absolute
  .aaa
    width 10px
</style>
