<template>
  <div class="userManageLayout-wrap">
    <systemBreadcrumb :showBack="showUserBack">
      <el-breadcrumb-item :to="{ path: '/tmIndex/systemManage' }">系统设置</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/tmIndex/systemManage/userManage'}"><span style="cursor: pointer;">用户管理</span></el-breadcrumb-item>
      <template #back><span class="back-btn"  @click="goback" v-if="showUserBack">返回</span></template>
    </systemBreadcrumb>

    <div class="userManageLayout-content">
      <router-view></router-view>
    </div>

  </div>

</template>

<script>
  import systemBreadcrumb from '@/components/systemBreadcrumb'
  import {mapState} from 'vuex'
  export default {
    name: "userManageLayout",
    components:{
      systemBreadcrumb
    },
    computed:{
      ...mapState({
        showUserBack:state => state.systemManage.showUserBack
      })
    },
    mounted(){
      console.log(this.showUserBack)
    },
    methods:{
      goback(){
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="stylus">
.userManageLayout-wrap{
  padding 0 30px 30px 30px
  height 100%
  display flex
  flex-direction column
  .el-breadcrumb{
    float: left
  }
  .userManageLayout-content{
    flex:1;
    overflow hidden
    background #fff;
    border-radius 4px;
  }
}
</style>
