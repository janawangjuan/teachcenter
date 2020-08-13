<template>
  <div class="multipleSearchInputWrap">
    <el-autocomplete
      v-model="keyWords"
      v-if="selectType!='1'"
      value-key="name"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入内容"
      @select="handleSelect"
    >
      <el-select v-model="selectType" slot="prepend" @change="changeType" placeholder="请选择">
        <el-option label="关键词查询" value="1"></el-option>
        <el-option label="学员用户名" value="2"></el-option>
        <el-option label="学员姓名" value="3"></el-option>
        <el-option label="教师用户名" value="4"></el-option>
      </el-select>
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-autocomplete>
    <el-input v-else placeholder="请输入内容" v-on:input="listenSearch" v-model="keyWords" class="input-with-select">
      <el-select v-model="selectType" slot="prepend" placeholder="请选择">
        <el-option label="关键词查询" value="1"></el-option>
        <el-option label="学员用户名" value="2"></el-option>
        <el-option label="学员姓名" value="3"></el-option>
        <el-option label="教师用户名" value="4"></el-option>
      </el-select>
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
  </div>
</template>

<script>
  import Request from '@/request'
  export default {
    name: "multipleSearchInput",
    data(){
      return{
        selectType:'1',
        keyWords:'',
        selectUser:''
      }
    },
    computed : {
      techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))}
    },
    methods:{
      querySearchAsync(queryString, cb){
        let type = 0
        if(this.selectType==2||this.selectType==4){
          type = 2
        }else{
          type = 1
        }
        Request.ajax('queryMemberByNameAndNickname',{
          token:this.techLoginInfo.token,
          name:queryString,
          type:type,
          limit:50
        }).then(res => {
          cb(res.data)
        })
      },
      handleSelect(params){
        this.selectUser = params
      },
      listenSearch(){
        if(!this.webApi.trim(this.keyWords)){
          //this.pageNo = 1
          //this.keyWords = ''
          //this.getExchangeListAjax();
        }
      },
      search(){
        let params = {
          keyWords:this.keyWords,
          type:this.selectType,
          selectUser:this.selectUser
        }
        this.$emit('search',params)
      },
      changeType(param){
        this.keyWords = ''
        this.selectUser = ''
        //console.log(param)
      }
    }
  }
</script>

<style lang="stylus">
.multipleSearchInputWrap{
  display inline-block
  .el-input{
    width 120px
    .el-input__inner{
      height 28px
      line-height 28px
      width 120px
    }
    .el-select__caret{
      line-height 28px
    }
  }
}
</style>
