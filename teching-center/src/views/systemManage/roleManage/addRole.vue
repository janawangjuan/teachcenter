<template>
<div class="addRole-wrap">
  <div class="form-wrap">
    <el-form ref="form" :model="formData" label-position="left" label-width="120px" size="normal">
      <el-form-item label="角色名称">
        <el-input placeholder="请输入角色名称" v-model="formData.name" width="200"></el-input>
      </el-form-item>

      <el-form-item label="菜单权限配置">
        <div style="overflow: hidden">
          <el-table
            :data="tableData"
            border
            v-if="flag"
            style="width: 95%">
            <el-table-column
              label="一级功能菜单"
              width="200">
              <template slot-scope="scope" >
                  <el-checkbox @change="checked => changeCheckBoxLeft(checked,scope.row.id)" :checked="formData.checkList.indexOf(scope.row.id)>-1" >{{scope.row.name}}</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="二级功能菜单">
              <template slot-scope="scope" >
                <span class="el-select-wrap" :key="item.id" v-for="(item) in scope.row.childList">
                  <el-checkbox @change="checked => changeCheckBoxLeft2(checked,item)" :disabled="item.isDefault == '1'" :checked="item.isDefault=='1'||formData.checkList.indexOf(item.id)>-1">{{item.name}}</el-checkbox>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" resize="none" placeholder="请输入备注内容" v-model="formData.description"></el-input>
      </el-form-item>
      <el-form-item label="启用状态">
        <el-radio-group v-model="formData.state">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="btn-wrap"><el-button :class="['mr20',disabled?'disabled':'']" @click="confirm" :disabled="disabled">确定</el-button> <el-button :class="[resetDisabled?'disabled':'']" :disabled="resetDisabled" @click="reset">重置</el-button></div>
    </el-form>
  </div>
</div>
</template>

<script>
  import {mapState,mapMutations} from 'vuex'
  import Request from '@/request'
  let defaultForm = {
    name:'',
    description:'',
    state:1,
    checkList:[]
  }
  export default {
    name: "addRole",
    computed:{
      ...mapState({
        addRoleType: state => state.systemManage.addRoleType,
        selectRole: state => state.systemManage.selectRole
      }),
      techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))},
    },
    created(){
      this.formData = Object.assign({}, defaultForm)
    },
    mounted(){
      if(this.addRoleType == 'edit'){
        this.getRoleDetail()
      }
      this.getMenuList()
      this.updateShowUserBack(true)
    },
    watch:{
      formData: {
        handler: function (nowVal, oldVal) {
          var $this = this;
          if(nowVal.name == ''){  //只需要用户名 就可以确认添加
            this.disabled = true
          }else{
            this.disabled = false
          }
          if(nowVal.checkList.length>0){
            $this.resetDisabled = false;
          }else{
            for (let i in defaultForm) {
              if(i != 'checkList'){
                if (nowVal[i] != defaultForm[i] ) {  //有变更，重置可点
                  $this.resetDisabled = false;
                  break;
                } else {
                  $this.resetDisabled = true;
                }
              }
            }
            //$this.resetDisabled = true;
          }
        },
        deep: true
      }
    },
    data(){
      return{
        formData:null,
        tableData:[],
        flag:true,
        disabled:true,
        resetDisabled:true
      }
    },
    methods:{
      ...mapMutations('systemManage',['updateShowUserBack']),
      reset(){ //重置
        console.log(defaultForm)
        this.formData = defaultForm
        this.formData.checkList = []
        console.log(this.formData)
        this.flag = false
        this.$nextTick(() => {
          this.flag = !this.flag
        })
      },
      getRoleDetail(){
        Request.ajax('getRoleDetail',{
          token:this.techLoginInfo.token,
          roleId:this.selectRole.id
        }).then(res => {
          this.formData.name = res.data.name
          this.formData.description = res.data.description
          this.formData.state = res.data.state
          this.formData.checkList = res.data.funIdList
          if(this.formData.checkList.length>0){
            this.flag = false
            this.$nextTick(() => {
              this.flag = !this.flag
            })
          }
        })
      },
      changeCheckBoxLeft(val,params){
        if(val){
          this.formData.checkList.push(params)
        }else{   //若取消一级菜单，则把对应的二级菜单置为空
          this.flag = false   //要重新渲染表格 页面的复选框状态才会生效
          this.formData.checkList.remove(params)
          this.tableData.forEach(item => {
            if(item.id == params){
              item.childList.forEach(option => {
                this.formData.checkList.remove(option.id)
              })
              this.$nextTick(() => {
                this.flag = !this.flag
              })
            }
          })
        }
      },
      changeCheckBoxLeft2(val,params){
        if(val){
          this.formData.checkList.push(params.id)
          if(this.formData.checkList.indexOf(params.parentId)==-1){  //看对应的一级菜单是否勾选，若没勾选，需要选中
            this.flag = false  //重新渲染表格
            this.formData.checkList.push(params.parentId)
            this.$nextTick(() => {
              this.flag = !this.flag
            })
          }
        }else{
          this.formData.checkList.remove(params.id)
        }
      },
      confirm(){
        if(this.formData.name==''){
          this.$message('请输入角色名')
          return
        }
        this.disabled = true
        let obj = {
          roleId:this.addRoleType=='create'?'':this.selectRole.id,
          roleName:this.formData.name,
          state:this.formData.state,
          description:this.formData.description,
          funIdList:this.formData.checkList
        }
        Request.ajax('saveTechRole',{
          token:this.techLoginInfo.token,
          roleData:JSON.stringify(obj)
        }).then(res => {
          if(res && res.state == 'success'){
            this.disabled = false
            this.$message({
              type:'success',
              message:'角色'+(this.addRoleType=='create'?'创建':'修改')+'成功~'
            })
            this.$router.push('index')
          }else{
            this.disabled = false
            this.webApi.alert(res.msg||'服务器异常，请重试~')
          }
        })
      },
      getMenuList(){
        Request.ajax('getMenuList',{
          token:this.techLoginInfo.token
        }).then(res => {
          this.tableData = res.data
        })
      }
    }
  }
</script>

<style lang="stylus">
.addRole-wrap{
  padding-bottom 30px
  .btn-wrap{
    text-align center
    margin-top 20px
    .el-button{
      width 120px
      height 38px
      background #3C4B8E
      color:#fff;
    }
  }
  .form-wrap{
    padding-left 30px
    .el-input{
      width 260px
    }
    .el-button.disabled{
      background #eee;
      color:#999;
    }
    .el-select-wrap{
      display inline-block
      width 200px
    }
    .el-textarea{
      width 600px
      height 200px
    }
    .el-textarea__inner{
      height: 200px
    }
    .el-table{
      th{
        background #F5F5F5
        padding-left 30px
      }
    }
    .title-span{
      color:#666;
      font-weight bold
      font-size 16px
      margin-right 20px
    }
    .el-form-item{
      margin-top 45px
    }
    .el-form-item__label{
      margin-right 30px
      font-size 16px
      color:#333;
      font-weight bold
    }
  }
}
</style>
