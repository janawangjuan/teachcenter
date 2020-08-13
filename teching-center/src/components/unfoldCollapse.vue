<template>
  <div  :class="['unfold-collapse-wrap',showForm?'show-form':'']">
    <div class="form-wrap" v-if="showForm">
      <slot></slot>
    </div>
    <div v-if="showForm" class="collapse-wrap"><span class="check-btn usual-btn" @click="check">查询</span><span class="unfold-btn usual-btn" @click="collapse">检索收起</span></div>
    <div class="unfold-wrap" v-if="!showForm">
      <span class="unfold-btn usual-btn" @click="unfold">检索展开</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "unfoldCollapse",
    data(){
      return{
        showForm:true
      }
    },
    methods:{
      unfold(){
        this.showForm = true
      },
      collapse(){
        this.showForm = false
      },
      check(){
        this.$emit('checkForm')
      }
    }
  }
</script>

<style lang="stylus">
  .unfold-collapse-wrap{
    padding-top 50px
    overflow hidden
    height 90px
    transition all 0.5s ease
    &.show-form{
      height auto
    }
    .el-form--inline .el-form-item{
      width: 33%;
      margin-right: 0;
    }
    .form-wrap{
      padding-bottom 20px
    }
    .collapse-wrap{
      text-align center
    }
    .el-range-editor--mini.el-input__inner{
      width 220px
    }
    .el-form-item__label{
      width 100px
      text-align left
      font-weight: bold
    }
    .el-input{
      width 220px
    }
    .usual-btn{
      display inline-block;
      width 80px;
      height 28px
      line-height 28px
      background #3C4B8E
      border-radius 5px
      color:#fff;
      text-align center;
      cursor pointer
      font-size: 12px;
    }
    .check-btn{
      margin-right 80px
    }
  }
  .unfold-wrap{
    border-top:1px solid #F3F5FF;
    text-align center
    .unfold-btn,check-btn{
      position relative
      top -19px;
    }
  }
</style>
