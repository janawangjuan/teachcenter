<template>
  <div class="header-wrap">
    <div class="header-left icon-layout" @click="toIndex">
      <a href="javascript:;" class="header-link header-link-zbg"></a>
      <a href="javascript:;" class="header-link header-link-studycenter"></a>
    </div>
    <div class="header-right">
      <a href="javascript:;" class="name-a">
        <img :src="host.img+techLoginInfo.avatar" alt="我的头像" class="user-avatar">
        <span class="user-name">{{techLoginInfo.nickName}}</span>
      </a>
      <a href="javascript:;" class="loginout-a" @click="logout">
        <i class="loginout-icon"></i>
        <span class="loginout-text">退出</span>
      </a>
      <!--<menu class="app-exit-options" v-show="isExitOptions">
        <i class="app-exit-arrow"></i>
        <menuitem href="javascript:;" class="app-exit-select">个人中心</menuitem>
        <menuitem href="javascript:;" class="app-exit-select app-exit-btn" @click="logout">退出</menuitem>
      </menu>-->
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: "i-header",
    computed:{
      ...mapState({
        //techLoginInfo : state => state.global.techLoginInfo,
        host : state => state.global.host,
      }),
      techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))}
    },
    methods:{
      logout () {
        this.cookie.remove('techLoginInfo')
        this.$router.push('/login')
      },
      toIndex(){
        this.$router.push('/')
      }
    }
  }
</script>

<style lang="stylus">
.header-wrap
  width 100%
  height 100%
  .header-left
    display inline-block
    cursor pointer
    background url("../assets/img/layout.png") no-repeat
    background-position 0 0
    background-size 100%
    width 217px
    height 35px
    float left
    margin 15px 0 0 15px
  .header-right
    float: right
    color #666
    font-size 14px
    margin-top 15px
    .name-a
      display inline-block
      height 30px
      line-height 30px
      margin-right 40px
      color #666
      .user-avatar
        display inline-block
        width 30px
        height 30px
        border-radius: 50%;
        float: left
        margin-right 5px
    .loginout-a
      display inline-block
      height 30px
      line-height 30px
      color #666
      .loginout-icon
        display inline-block
        position: relative;
        top: 4px;
        width 20px
        height 20px
        background url("../assets/img/icon_image.png") no-repeat -130px -215px;
  .fffff
    width 1px
</style>
