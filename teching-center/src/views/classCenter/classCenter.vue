<template>
<div id="app" class="app classCenter-wrap">
  <el-container class="classCenter-wrap-container-wrap">
    <el-header><iHeader></iHeader></el-header>
    <el-container class="classCenter-wrap-container">
      <el-aside width="160px" class="classCenter-wrap-aside">
        <ul class="menu-wrap-ul">
          <li class="menu-wrap-li">
            <div class="menu-title">班级课表</div>
            <ul class="menu-ul">
              <li class="menu-li" :class="[getRouter()=='classCenterIndex'?'active':'']"  @click="changeRouter('/classCenterIndex/')">班级课表</li>
            </ul>
          </li>
          <li class="menu-wrap-li">
            <div class="menu-title">数据统计</div>
            <ul class="menu-ul">
              <li class="menu-li" :class="[getRouter()=='dataStatisticsAq'?'active':'']" @click="changeRouter('/dataStatisticsAq/')">答疑辅导统计</li>
              <li class="menu-li" :class="[getRouter()=='dataStatisticsExam'?'active':'']"  @click="changeRouter('/dataStatisticsExam/')">作业统计</li>
            </ul>
          </li>
        </ul>
      </el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</div>
</template>

<script>
  import iHeader from '../../components/i-header'
  export default {
    name: "classCenter",
    components:{
      iHeader
    },
    methods:{
      getRouter(){     //左侧导航栏对应route.path，截取route.path前两项
        let routerPath = this.$route.path
        let routerPath1 = []
        routerPath1=routerPath.split("/");
        if(routerPath1.length>2){  //大于2表示路由有多级
          routerPath = routerPath1[2]
        }else{
          routerPath = '/'+routerPath1[1]
        }
        return routerPath
      },
      changeRouter(params){
        this.$router.push({path:'/classCenter'+params+this.$route.params.classId})
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
  .classCenter-wrap-container-wrap
    overflow hidden
    .classCenter-wrap-container
      height 100%
      overflow hidden
  .el-container
    height 100%
    &.classCenter-wrap-ontainer
      overflow hidden
      height auto
    .classCenter-wrap-aside
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
    .el-main
      padding 0
      border: 1px solid #ddd;
</style>
