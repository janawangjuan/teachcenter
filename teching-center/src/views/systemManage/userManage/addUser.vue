<template>
  <div class="addUser-wrap">
    <div class="first-step" v-if="showFirstStep&&addUserType=='create'">
      <div class="jobNumber-wrap"><span>工号</span>   <el-input v-model="jobNumber" placeHolder="请输入工号查找用户信息"></el-input></div>
      <div class="btn-wrap"><el-button :disabled="noCheck" @click="check">查询</el-button></div>
    </div>
    <div class="second-step" v-else>
      <div class="form-wrap">
        <el-form ref="form" :model="formData" label-position="left" label-width="190px" size="mini">
          <el-form-item label="个人信息">
            <div class="person-info-wrap"><span class="title-span">工号</span>{{selectUser.loginName||selectUser.nickname}}</div><div  class="person-info-wrap"><span class="title-span">姓名</span>{{selectUser.realName||selectUser.name}}</div><div  class="person-info-wrap"><span class="title-span">手机号</span>{{selectUser.mobile}}</div>
          </el-form-item>
          <el-form-item label="所属角色">
            <el-select v-model="formData.roleId" placeholder="请选择角色">
              <el-option :label="item.name" :value="item.id" v-for="(item,index) in roleList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否查看全部数据范围">
            <el-radio-group v-model="formData.isAllScope" @change="radioChange">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="授课类型配置" v-if="showOtherSet">
            <el-checkbox-group v-model="formData.teachingTypes">
              <el-checkbox :label="item.value" name="type" v-for="item in courseTypeList" :key="item.value">{{item.title}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="项目科目权限配置" v-if="showOtherSet">
            <div style="overflow: hidden">
              <el-table
                :data="tableData"
                border
                style="width: 95%">
                <el-table-column
                  label="项目"
                  width="200">
                  <template slot-scope="scope">
                    <el-checkbox @change="checked => changeCheckBoxLeft(checked,scope.row.itemId)"
                                 :value="checkList.indexOf(scope.row.itemId)>-1" >{{scope.row.itemName}}
                    </el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="科目">
                  <template slot-scope="scope" >
                    <span class="el-checkbox-wrap"  v-for="(item) in scope.row.courseCategoryList" :key="item.courseCategoryId">
                      <el-checkbox @change="checked => changeCheckBoxLeft2(checked,item)" :value="checkList2.indexOf(item.courseCategoryId)>-1">{{item.courseCategoryName}}</el-checkbox>
                    </span>

                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
          <div class="btn-wrap"><el-button class="mr20" @click="confirm">确定</el-button> <el-button @click="cancel">取消</el-button></div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import Request from '@/request'
  import {mapState,mapMutations} from 'vuex'
  export default {
    name: "addUser",
    computed:{
      ...mapState({
        addUserType: state => state.systemManage.addUserType,
        selectUser: state => state.systemManage.selectUser
      }),
      techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))},
    },
    data(){
      return{
        jobNumber:'',
        showFirstStep:true,
        noCheck:true,
        userInfo:'',
        showOtherSet:true, //显示全部数据范围时，隐藏菜单和项目科目配置项。
        formData:{
          roleId:'',
          isAllScope:0,
          teachingTypes:['1']
        },
        roleList:[],
        tableData:[{name:''}],
        ACCA:'',
        flag:true,
        checkList:[],
        checkList2:[],
        courseTypeList:[],
      }
    },
    mounted(){
      this.getCourseType()
      this.getAllItemCategoryList()
      this.getRoleList()
      if(this.addUserType == 'edit'){
        this.getEditUserInfo()
      }
      this.updateShowUserBack(true)
    },
    methods:{
      ...mapMutations('systemManage',['updateAddUserType','updateSelectUser','updateShowUserBack']),
      check(){
        Request.ajax('getUserByNumber',{
          token:this.techLoginInfo.token,
          number:this.jobNumber
        }).then(res => {
          if(res.data){
            //this.userInfo = res.data
            this.updateSelectUser(res.data)
            this.showFirstStep = false
          }else{
            this.webApi.alert(res.msg||'系统异常，请稍后重试~')
          }
        })
      },
      cancel(){
        this.$router.go(-1)
      },
      radioChange(val){
        if(val == 1){  //显示全部数据范围时。隐藏菜单和项目科目选项
          this.showOtherSet = false
        }else{
          this.showOtherSet = true
        }
      },
      getCourseType(){
        Request.ajax('getCourseTeacheringType',{
          token:this.techLoginInfo.token
        }).then((res)=>{
          if(res&&res.state=='success'){
            this.courseTypeList = res.data
          }
        })
      },
      confirm(){
        if(this.formData.roleId == ''){
          this.$message('请选择用户角色~')
        }
        Request.ajax('saveTechUser',{
          token:this.techLoginInfo.token,
          memberId:this.selectUser.memberId,
          roleId:this.formData.roleId,
          isAllScope:this.formData.isAllScope,
          teachingTypes:this.formData.teachingTypes.join(','),
          itemIds:this.checkList.join(','),
          courseCategoryIds:this.checkList2.join(','),
        }).then(res => {
          if(res && res.state=='success'){
            this.$message({
              type:'success',
              message:(this.addUserType=='create'?'添加':'编辑')+'用户成功~'
            })
            this.$router.push('index')
          }else{
            this.$message(res.msg)
          }
        })
      },
      getEditUserInfo(){
        Request.ajax('getEditUserInfo',{
          token:this.techLoginInfo.token,
          memberId:this.selectUser.memberId
        }).then(res => {
          this.formData.roleId = res.data.roleId
          this.formData.teachingTypes = res.data.teachingTypes?res.data.teachingTypes.split(','):[]
          this.formData.isAllScope = res.data.isAllScope
          if(this.formData.isAllScope == 1){
            this.showOtherSet = false
          }
          this.checkList = res.data.itemIds?res.data.itemIds.split(','):[]
          this.checkList2 = res.data.courseCategoryIds?res.data.courseCategoryIds.split(','):[]
        })
      },
      changeCheckBoxLeft(val,params){
        if(val){
          this.checkList.push(params)
        }else{   //若取消一级菜单，则把对应的二级菜单置为空
            //要重新渲染表格 页面的复选框状态才会生效
          this.checkList.remove(params)
          this.tableData.forEach(item => {
            if(item.itemId == params){
              console.log(item.courseCategoryList)
              item.courseCategoryList.forEach(option => {
                this.checkList2.remove(option.courseCategoryId)
              })
            }
          })
        }
      },
      changeCheckBoxLeft2(val,params){
        if(val){
          this.checkList2.push(params.courseCategoryId)
          if(this.checkList.indexOf(params.itemId)==-1){  //看对应的一级菜单是否勾选，若没勾选，需要选中
            this.checkList.push(params.itemId)
          }
        }else{
          this.checkList2.remove(params.courseCategoryId)
        }
      },
      getAllItemCategoryList(){
        Request.ajax('getAllItemCategoryList',{
          token:this.techLoginInfo.token
        }).then(res => {
          this.tableData = res.data
        })
      },
      getRoleList(){
        Request.ajax('getSelectList',{
          token:this.techLoginInfo.token,
          state:'1'
        }).then(res => {
          this.roleList = res.data.filter(item=>item.isSystem!=1)
        })
      }
    },
    watch:{
      jobNumber(val){
        if(val == ''){
          this.noCheck = true
        }else{
          this.noCheck = false
        }
      }
    }
  }
</script>

<style lang="stylus">
.addUser-wrap{
  overflow auto
  height 100%
  .form-wrap{
    padding-left 30px
    .btn-wrap{
      text-align center
      margin-top 20px
      height 60px
      .el-button{
        width 120px
        height 38px
        background #3C4B8E
        color:#fff;
      }
    }
    .person-info-wrap{
      float: left
      color #999;
      margin-right 60px
    }
    .el-table{
      th{
        background #F5F5F5
        padding-left 30px
      }
      .el-checkbox{
        white-space unset
        display: flex;
        .el-checkbox__label{
          position relative
          top -3px
        }
      }
      .el-checkbox-wrap{
        display inline-block
        width 200px
        margin-right 30px
        margin-bottom 10px
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
      border-right 2px solid rgba(0,0,0,0.05)
      margin-right 30px
      font-size 16px
      color:#333;
      font-weight bold
    }
  }
  .jobNumber-wrap{
    font-size 14px
    font-weight bold
    padding 50px 0 0 30px
    color:#333;
    .el-input{
      width 260px
      margin-left 100px
    }
  }
  .el-button{
    width 120px
    height 38px
    background #3C4B8E
    color:#fff
  }
  .is-disabled{
    background #eee;
    color:#999;
  }
  .btn-wrap{
    text-align center
    margin-top 140px
  }
}
</style>
