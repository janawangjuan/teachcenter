<template>
  <div class="breadcrumb-wrap">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <slot></slot>
    </el-breadcrumb>
    <slot name="back"></slot>
  </div>
</template>

<script>
  export default {
    props:{
      showBack:{
        default:false
      }
    },
    name: "systemBreadcrumb",
    watch:{
      showBack(val){
        console.log(val)
      }
    }
  }
</script>

<style lang="stylus">
  .breadcrumb-wrap{
    height 60px
    .el-breadcrumb{
      line-height 60px
      float: left
    }
    .el-breadcrumb__item:last-child .el-breadcrumb__inner{
      color #3C4B8E
    }
    .el-breadcrumb__inner.is-link{
      font-weight normal
    }
    .back-btn{
      float: right
      line-height 60px
      color #3C4B8E
      font-size 14px
      cursor: pointer
    }
  }
</style>
