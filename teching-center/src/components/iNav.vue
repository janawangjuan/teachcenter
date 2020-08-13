<template>
  <div class="nav-wrap-big">
    <div class="nav-wrap">
      <div class="change-collapse-wrap">
        <button class="change-collapse" :class="[isCollapse?'':'expansion']" @click="changeCollapse"></button>
      </div>
      <el-menu :default-active="getRouter($route.path)" :default-openeds="openMenu" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :router="false" :collapse="isCollapse">
        <el-submenu :index="index+''" v-for="(item,index) in userMenu" :key="item.id">
          <template slot="title">
            <i :class="[item.icon,'icon-i']"></i>
            <span class="text-span">{{item.name}}</span>
          </template>
          <el-menu-item :index="getRouter(option.url)" @click="changeRoute(option.url)" v-for="(option) in item.childList" :key="option.id">{{option.name}} <span class="xiaokuai"></span></el-menu-item>
        </el-submenu>
        <el-submenu index="6">
          <template slot="title">
            <i :class="['icon-i']"></i>
            <span class="text-span">消息管理</span>
          </template>
          <el-menu-item :index="getRouter('1111')" @click="changeRoute('222')">网课公告管理 <span class="xiaokuai"></span></el-menu-item>
          <el-menu-item :index="getRouter('1111')" @click="changeRoute('222')">优播课公告管理 <span class="xiaokuai"></span></el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div class="child-nav" v-if="showChildNav">
      <ul class="yiji-ul">
        <li class="yiji-li" v-for="(item,index) in childNavList">
          <div class="yiji-title"  @click="item.showLi=!item.showLi"><i :class="[item.showLi?'el-icon-caret-bottom':'el-icon-caret-right']"></i>{{item.title}}</div>
          <ul class="erji-ul" v-if="item.showLi">
            <li class="erji-li" v-for="(option,index) in item.children" @click="changeRoute(option.url)" :class="[option.url==$router.currentRoute.fullPath?'active':'']">
              <div class="erji-title">{{option.title}}</div>
            </li>
          </ul>
        </li>
      </ul>
      <div class="jiantou-wrap" :style="{top:jiantouWrapTop}" ref="jiantouLeft">
        <div class="triangle-left"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    name: "iNav",
    data() {
      return {
        isCollapse: false,
        showChildNav:false,
        jiantouWrapTop:'10px',
        routerFLag:true,
        openMenu:['0','1','2','3'],
        childNavList:[{
          title:'网课统计',
          showLi:true,
          children:[/*{
            title:'EZ课学习行为',
          },*/{
            title:'优播课学习行为',
            url:'/tmIndex/dataStatistics/youboStudyAction'
          }]
        },{
          title:'答疑辅导统计',
          showLi:true,
          children:[{
            title:'教师答疑统计',
            url:'/tmIndex/dataStatistics/teacherAQStatistics'
          }]
        }]
      };
    },
    computed:{
      ...mapState({
        userMenu:state => state.global.userMenu
      })
    },
    methods: {
      handleOpen(key, keyPath) {
      },
      changeCollapse(){
        this.isCollapse = !this.isCollapse
      },
      handleClose(key, keyPath) {
      },
      changeChildNav(params,event){
        this.jiantouWrapTop = event.currentTarget.getBoundingClientRect().top-43+'px'  //获取点击的元素高度赋值给子菜单向左的箭头
        /*if(params=='/tmIndex/dataStatistics'){
          this.showChildNav = !this.showChildNav
          if(this.getRouter()!='/tmIndex/dataStatistics'){
            this.$router.push({path:'/tmIndex/dataStatistics/youboStudyAction'})
          }
        }else{
          this.showChildNav = false
          this.$router.push({path:params})
        }*/
        //this.showChildNav = !this.showChildNav

      },
      selectMenu(e,index, indexPath){
        if(index == null){
          this.routerFLag = false
          if(this.getRouter()=='/tmIndex/dataStatistics'){
            this.showChildNav = !this.showChildNav
          }else{
            this.$router.push({path:'/tmIndex/dataStatistics/youboStudyAction'})
            this.showChildNav = true
          }
          //this.$router.push({path:'/tmIndex/dataStatistics/youboStudyAction'})

        }else{
          this.showChildNav = false
          //this.$router.push({path:indexPath})
        }
      },
      getRouter(params){     //左侧导航栏对应route.path，截取route.path前两项
        let routerPath = params
        let routerPath1 = []
        routerPath1=routerPath.split("/");
        routerPath = '/'+routerPath1[1]+(routerPath1[2]?('/'+routerPath1[2]):'')+(routerPath1[3]?('/'+routerPath1[3]):'')
        return routerPath
      },
      changeRoute(params){
        this.$router.push({path:params})
      }
    }
  }
</script>

<style lang="stylus">
.nav-wrap-big
  height 100%
  .child-nav
    width 140px
    height 100%
    float left
    background #fff
    position relative
    .yiji-ul
      .yiji-li
        cursor pointer
        margin-top 20px
        min-height 20px
        .yiji-title
          padding-left 5px
          font-size 14px
          color #333
        .erji-ul
          margin-top 10px
          .erji-li
            cursor pointer
            height 30px
            line-height 30px
            .erji-title
              padding-left 20px
              font-size 14px
              color #333
            &:hover
              background #f7f7f7
            &.active
              background #f7f7f7
              .erji-title
                color #ff366d
    .jiantou-wrap
      position absolute
      top 0px
      left -5px
      .triangle-left
        width: 0;
        height: 0;
        border-width: 5px 5px 5px 0;
        border-style: solid;
        border-color: transparent #fff transparent transparent;
  .nav-wrap
    height 100%
    float left
    overflow: auto
    .el-menu--collapse
      .icon-i
        left 0
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
      }
    .el-radio-button--mini
      .el-radio-button__inner
        padding 8px
    .el-menu.el-menu--collapse > .el-menu-item
      margin-left 0
    .el-menu--collapse > .el-menu-item span
      position absolute
    .el-menu--collapse > .el-menu-item .menu-item-div
      width 42px
      height 42px
      margin-left 14px
    .change-collapse-wrap
      text-align: center;
      margin: 20px 0 10px 0;
      .change-collapse
        width 32px
        height 32px
        cursor pointer
        background url("../assets/img/icon_image.png") no-repeat -126px -169px;
        &.expansion
          background url("../assets/img/icon_image.png") no-repeat -126px -123px;
    .el-menu
      background #3C4B8E
      border-right none
      width: 100%
      text-align center
    .text-span
      color #fff
      display inline-block
      width 90px
      text-align center
      position: relative;
      left: -10px;
    .el-menu-item
      height 42px
      width 150px
      margin-left 25px
      line-height 42px
      margin-bottom 15px
      padding 0
      position relative
      .xiaokuai
        position absolute
        right 0
        top 13px
        border-radius 5px 0 0 5px
        display inline-block
        width 30px;
        height 10px;
        background #3C4B8E;
    .icon-i
      display inline-block
      width 42px
      height 42px
      position relative
      left:-6px
    .icon-index
      background url("../assets/img/icon_image.png") no-repeat -575px -155px;
    .icon-mycourse
      background url("../assets/img/icon_image.png") no-repeat -573px -33px;
    .icon-system
      background url("../assets/img/icon_image.png") no-repeat -573px -268px;
    .icon-qa-manage
      background url("../assets/img/icon_image.png") no-repeat -572px 9px;
    .icon-data-statistics
      background url("../assets/img/icon_image.png") no-repeat -575px -194px;
    .el-submenu
      .el-menu-item
        font-size 12px
        min-width 80px
        width 100%
        padding-left 0px !important;
        margin-left 0px
        color #fff
        height 36px
        line-height 36px
        border-radius 0
        &.is-active
          background #fff
          border-radius 0px
          font-weight bold
          color: #3C4B8E;
    .el-menu-item
      &.is-active
        background #fff
        border-radius 0px
        .menu-item-div
          background #fff
          border-radius 21px
          .icon-index
            background url("../assets/img/icon_image.png") no-repeat -526px -155px;
          .icon-mycourse
            background url("../assets/img/icon_image.png") no-repeat -525px -33px;
          .icon-qa-manage
            background url("../assets/img/icon_image.png") no-repeat -523px 9px;
          .icon-data-statistics
            background url("../assets/img/icon_image.png") no-repeat -525px -194px;
          .text-span
            color #29335F
    .el-menu-item,.el-submenu__title:hover
      outline: none;
      background: none;
    .el-menu-item,el-submenu__title:focus
      outline: none;
      background: none;
</style>
