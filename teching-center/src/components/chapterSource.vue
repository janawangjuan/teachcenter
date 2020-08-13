<template>
  <div class="chapterSource-wrap">
    <div class="chapterSourceW">
      <el-container>
        <el-header height="50px">问题来源
          <i class="close-btn" @click="close"></i>
        </el-header>
        <el-main>
          <div class="iscroll-wrap">
            <iScroll :id="'videoSourceChapterId'" :is-refresh="scrollRefresh">
              <p class="courseName">{{chapterParams.courseName}}</p>
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
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
  import Request from '@/request'
  import iScroll from '@/components/i-scroll'
  export default {
    name: "chapterSource",
    components:{
      iScroll
    },
    computed:{
      defaultCheckedKeys(){
        let arr = []
        arr.push(this.chapterParams.chapterId)
        return arr
      }
    },
    data(){
      return {
        scrollRefresh:false,
        defaultProps:{
          children: 'children',
          label: 'chapterTitle',
        },
        chapterData:[],
      }
    },
    props:{
      chapterParams:{
        type:Object
      }
    },
    mounted() {
      this.getChapterData()
    },
    methods:{
      close(){
        this.$emit('closeChapter')
      },
      changeScroll(){
        setTimeout(()=>{
          this.scrollRefresh = !this.scrollRefresh
        },500)
      },
      getChapterData(){
        Request.ajax('courseDetail',{
          courseId:this.chapterParams.courseId
        }).then(res => {
          if(!res || res.state != 'success'){
            this.webApi.alert("查询失败");
            return false;
          }
          this.chapterData = res.data[0].chapters
          this.scrollRefresh = !this.scrollRefresh
        })
      }
    }
  }
</script>

<style lang="stylus">
  .chapterSource-wrap
    position fixed
    width 100%
    height 100%
    background rgba(0,0,0,0.6)
    top 0
    left 0
    z-index 999
    .chapterSourceW
      width 600px
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
        .el-main
          height 100%
          .iscroll-wrap
            height 100%
            overflow hidden
          .scroll
            .courseName
              color #666666
              font-size 14px
              font-weight bold
              line-height 28px
            .el-tree
              .el-tree-node.is-checked>.el-tree-node__content
                color #f45
          .jjj
            width 20px
</style>
