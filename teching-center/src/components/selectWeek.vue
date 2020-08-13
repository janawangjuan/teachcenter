<template>
  <div class="select-week-wrap">
    <div class="s-w-content">
      <div class="content-title">选择导出周数</div>
      <ul class="list-ul">
        <li :class="['list-li',selectList.indexOf('all')>-1?'active':'']" @click="select('all')">全部</li>
        <li :class="['list-li',selectList.indexOf(item.selectWeekId)>-1?'active':'']" @click="select(item.selectWeekId)" :key="index" v-for="(item,index) in weekList">第{{webApi.toZhDigit(index+1)}}周</li>
      </ul>
      <div class="content-bottom">
        <span class="cancel-text" @click="cancel">取消</span> <span @click="confirm" class="confirm-text">确定</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "selectWeek",
    props:['weekList'],
    data(){
      return{
        selectList:[]
      }
    },
    methods:{
      select(params){
        if(params == 'all'){
          if(!(this.selectList.indexOf('all')>-1)){
            this.selectList = []
            this.selectList.push('all')
          }else{
            this.selectList = []
          }
        }else{
          this.selectList.remove('all')
          if(this.selectList.indexOf(params)>-1){
            this.selectList.remove(params)
          }else{
            console.log(this.selectList)
            this.selectList.push(params)
          }
        }
      },
      confirm(){
        if(this.selectList.length == 0){
          this.webApi.alert('请至少选择一项~')
          return
        }
        this.$emit('confirmSelectWeek',this.selectList)
      },
      cancel(){
        this.$emit('cancelSelectWeek')
      }
    }
  }
</script>

<style lang="stylus">
.select-week-wrap
  position fixed
  width 100%
  height 100%
  top 0
  left 0
  z-index: 10;
  background rgba(0,0,0,0.6)
  .s-w-content
    position absolute
    width 660px
    height 280px
    background #fff
    top 50%
    left 50%
    transform translate(-50%, -50%)
    border-radius 10px
    .content-title
      font-weight bold
      text-align center
      font-size 18px
      margin-top 20px
      color #333333
    .list-ul
      margin-left 45px
      margin-top 25px
      height 150px
      overflow auto
      .list-li
        color #333
        transition all 0.2s
        cursor pointer
        font-size 16px
        width 104px
        height 40px
        line-height 40px
        text-align center
        background #f2f2f2
        float: left
        margin-right: 49px
        margin-bottom 20px
        border-radius 5px
        &.active
          background #ffebf0
          color #ff366d
    .content-bottom
      margin-top 10px
      text-align right
      font-size 16px
      color #666666
      .cancel-text
       cursor pointer
      .confirm-text
        color #FF366D
        margin-left 70px
        margin-right 50px
        cursor pointer
  .ff
    width 0
</style>
