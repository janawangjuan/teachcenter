<template>
<div class="user-detail-wrap">
  <div class="form-wrap">
    <el-form ref="form" :model="formData" label-position="left" label-width="140px" size="mini">
      <el-form-item label="个人信息" class="el-form-item-inline">
        {{userInfo.loginName}}
      </el-form-item>
      <el-form-item label="姓名" class="el-form-item-inline">
        {{userInfo.realName}}
      </el-form-item>
      <el-form-item label="手机号" class="el-form-item-inline">
        {{userInfo.mobile}}
      </el-form-item>
      <el-form-item label="教学中心角色" class="el-form-item-inline">
        {{userInfo.roleName}}
      </el-form-item>
      <el-form-item label="菜单权限">
        <div style="overflow: hidden">
          <el-table
            :data="userInfo.funList"
            border
            style="width: 95%">
            <el-table-column
              label="一级功能菜单"
              width="200">
              <template slot-scope="scope" >
                <span class="fs14">{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="二级功能菜单">
              <template slot-scope="scope" >
                <span class="mr60 usual-span fz12" v-for="item in scope.row.childList" :key="item.id">{{item.name}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
      <el-form-item label="授课类型">
        <div v-if="userInfo.isAllScope==1">全部</div>
        <div v-else>
          <span class="mr60" v-for="item in userInfo.teachingTypeList" :key="item">{{handleType(item)}}</span>
        </div>
      </el-form-item>
      <el-form-item label="项目科目权限">
        <div v-if="userInfo.isAllScope==1">全部</div>
        <div style="overflow: hidden" v-else>
          <el-table
            :data="userInfo.scopeList"
            border
            style="width: 95%">
            <el-table-column
              label="项目"
              width="200">
              <template slot-scope="scope">
                <span class="fs14">{{scope.row.itemName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="科目">
              <template slot-scope="scope" >
                <span class="mr60 usual-span fz12" v-for="(item) in scope.row.courseCategoryList" :key="item.courseCategoryId">{{item.courseCategoryName}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>
  import {mapState,mapMutations} from 'vuex'
  import Request from '@/request'
  export default {
    name: "detail",
    computed:{
      ...mapState({
        selectUser: state => state.systemManage.selectUser
      }),
      techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))},
    },
    mounted(){
      this.getCourseType()
      this.getUserInfo()
      this.updateShowUserBack(true)
    },
    data(){
      return{
        formData:{

        },
        userInfo:'',
        courseTypeList:[]
      }
    },
    methods:{
      ...mapMutations('systemManage',['updateShowUserBack']),
      getUserInfo(){
        Request.ajax('getUserInfo',{
          token:this.techLoginInfo.token,
          memberId:this.selectUser.memberId
        }).then(res => {
          if(res && res.state == 'success'){
            this.userInfo = res.data
          }else{
            this.webApi.alert(res.msg||'系统异常，请重试~')
          }

        })
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
      handleType(params){
        let str = ''
        this.courseTypeList.forEach(item => {
          if(item.value == params){
            str = item.title
          }
        })
        return str
      }
    }
  }
</script>

<style lang="stylus">
.user-detail-wrap{
  overflow auto
  height 100%
  .form-wrap .el-table th {
    background: #f5f5f5;
    padding-left: 30px;
  }
  .form-wrap{
    padding 0px 30px 40px;
    .fs14{
      font-size:14px;
      font-weight bold;
    }
    .usual-span{
      display inline-block
      width 200px
      padding 5px 0px
    }
    .fz12{
      font-size 12px;
      line-height 20px;
      display inline-block
    }
    .el-form-item{
      margin-top 45px
    }
    .el-form-item-inline{
      display inline-block
      width 340px
      border-right: 2px solid rgba(0,0,0,0.05);
      margin-right 80px
    }
  }
  .form-wrap .el-form-item__label {
    margin-right: 30px;
    font-size: 16px;
    color: #333;
    font-weight: bold;
  }
}
</style>
