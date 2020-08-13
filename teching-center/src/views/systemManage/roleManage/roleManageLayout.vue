<template>
  <div class="roleManageLayout-wrap">
    <systemBreadcrumb>
      <el-breadcrumb-item :to="{ path: '/tmIndex/systemManage' }">系统设置</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <template #back><span class="back-btn"  @click="goback" v-if="showUserBack">返回</span></template>
    </systemBreadcrumb>
    <div class="roleManageLayout-content">
      <router-view></router-view>
    </div>

  </div>

</template>

<script>
  import systemBreadcrumb from '@/components/systemBreadcrumb'
  import {mapState} from 'vuex'
  export default {
    name: "roleManageLayout",
    components:{
      systemBreadcrumb
    },
    computed:{
      ...mapState({
        showUserBack:state => state.systemManage.showUserBack
      })
    },
    methods:{
      goback(){
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="stylus">
  .roleManageLayout-wrap{
    padding 0 30px 30px 30px
    height 100%
    display flex
    flex-direction column
    .roleManageLayout-content{
      flex:1;
      background #fff;
      border-radius 4px;
      overflow auto
    }
  }
</style>
