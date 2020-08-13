<template>
  <div class="no-data">
    <div class="img-wrap">
      <img class="img-no" src="../assets/img/class-nodata.png" alt="暂无内容">
    </div>
    <p class="no-text">{{this.text}}</p>
  </div>
</template>

<script>
  export default {
    name: "noData",
    props:{
      text:{
        type:String,
        default:'暂无数据'
      }
    }
  }
</script>

<style scoped lang="stylus">
  .no-data-wrap
    width 100%
    height 100%
    min-height 500px
    position relative
  .no-data
    position absolute
    top 50%
    left 50%
    transform: translate(-50%,-50%);
    .img-wrap
      text-align center
      .img-no
        width 196px
        height 190px
    .no-text
      margin-top 15px
      text-align center
      font-size 14px
      color #333
</style>
