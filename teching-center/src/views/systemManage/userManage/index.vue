<template>
  <div class="userManage-wrap">
    <div class="userManage-content">
      <div>
        <unfoldCollapse @checkForm="checkForm">
          <el-form size="mini" :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="工号">
              <el-input v-model="formInline.nickname" placeholder="工号"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="formInline.name" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="formInline.mobile" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item label="角色">
              <el-select v-model="formInline.roleId" placeholder="角色">
                <el-option :label="item.name" :value="item.id" v-for="(item,index) in roleList" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="formInline.isAccountEnabled" placeholder="状态">
                <el-option label="启用" value="1"></el-option>
                <el-option label="停用" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </unfoldCollapse>
      </div>
      <div class="add-button-wrap">
        <el-button size="mini" @click="addUser">添加用户</el-button>
      </div>
      <div class="table-wrap">
        <el-table
          :data="tableData"
          tooltip-effect="dark"
          v-loading="loading"
          :stripe="true"
          size="mini"
          height="100%"
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="50"></el-table-column>
          <el-table-column
            prop="nickname"
            label="工号">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="手机号">
          </el-table-column>
          <el-table-column
            prop="roleName"
            label="角色">
          </el-table-column>
          <el-table-column
            prop="createDate"
            label="创建时间">
            <template slot-scope="scope">{{webApi.formatDate(scope.row.createDate,'ALL')}}</template>
          </el-table-column>
          <el-table-column
            prop="isAllScope"
            label="是否查看全部数据范围">
            <template slot-scope="scope">{{scope.row.isAllScope==1?'是':'否'}}</template>
          </el-table-column>
          <el-table-column
            prop="isAccountEnabled"
            label="状态">
            <template slot-scope="scope">{{scope.row.isAccountEnabled==1?'启用':'停用'}}</template>
          </el-table-column>
          <el-table-column
            width="220"
            label="操作">
            <template slot-scope="scope">
              <a :class="['color-a','mr10',scope.row.isSystem==1?'disable-a':'']" href="javascript:;" @click="edit(scope.row)">编辑</a>
              <a :class="['color-a','mr10']" href="javascript:;" @click="toDetail(scope.row)">查看详情</a>
              <a :class="['color-a','mr10',scope.row.isSystem==1?'disable-a':'']" href="javascript:;" @click="deleteThis(scope.row)">删除</a>
              <a :class="['color-a']" href="javascript:;" @click="getLoginToken(scope.row)">模拟登录</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-wrap">
        <el-pagination
          background
          layout="prev, pager, next, sizes, total"
          :pageSize="pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="totalCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import systemBreadcrumb from '@/components/systemBreadcrumb'
  import unfoldCollapse from '@/components/unfoldCollapse'
  import Request from '@/request'
  import {mapMutations} from 'vuex'
  export default {
    name: "index",
    computed:{
      techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))},
    },
    components:{
      systemBreadcrumb,
      unfoldCollapse
    },
    data(){
      return{
        pageSize:20,
        totalCount:0,
        pageNo:1,
        loading:false,
        tableData:[],
        roleList:[],
        envType:parseInt(this.cookie.get('envType')),
        formInline:{
          nickname:'',
          name:'',
          roleId:'',
          mobile:'',
          isAccountEnabled:''
        }
      }
    },
    mounted(){
      this.getList()
      this.getRoleList()
      this.updateShowUserBack(false)
    },
    methods:{
      ...mapMutations('systemManage',['updateAddUserType','updateSelectUser','updateShowUserBack']),
      addUser(){
        this.updateAddUserType('create')
        this.$router.push('addUser')
      },
      getLoginToken(params){
        const loading = this.$loading({
          lock: true,
          text: '正在获取链接，请稍后~',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.7)'
        });
        Request.ajax('getLoginToken',{
          data:this.webApi.base64encode(params.memberId+'#'+new Date().getTime())
        }).then(res => {
          if(res && res.state == 'success'){
            loading.close();
            console.log(this.envType)
            let str = (this.envType=='1'?'https://techingdemo.zbgedu.com?token=':'https://teching.zbgedu.com?token=')+res.data.token
            this.$copyText(
              str
            ).then( () => {
                //这是element的Message 消息提示组件
                this.$message({
                  message: "链接地址已经复制成功，请打开另一个浏览器，粘贴进入~",
                  type: "success"
                });
              },
              err => {
                this.$message.error("复制失败");
              }
            );
          }else{
            loading.close();
            this.webApi.alert(res.msg||'服务器异常，请重试~')
          }
        })
      },
      deleteThis(params){
        if(params.isSystem==1){
          this.$message('该用户不可删除~')
          return
        }
        this.$confirm('确定要删除该用户吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showClose:false,
          type: 'warning'
        }).then(() => {
          Request.ajax('deleteUser',{
            'token':this.techLoginInfo.token,
            'memberId':params.memberId,
          }).then(res => {
            if(res.state && res.state=='success'){
              this.webApi.alert('删除成功！')
              this.getList();
            }else{
              this.webApi.alert('删除失败！')
            }
          })
        }).catch(() => {

        });
      },
      edit(params){
        if(params.isSystem==1){
          this.$message('该用户不可编辑~')
          return
        }
        this.updateAddUserType('edit')
        this.updateSelectUser(params)
        this.$router.push('addUser')
      },
      toDetail(params){
        this.updateSelectUser(params)
        this.$router.push('detail')
      },
      getList(){
        Request.ajax('getUserList',{
          token:this.techLoginInfo.token,
          nickname:this.formInline.nickname,  //工号
          name:this.formInline.name,
          mobile:this.formInline.mobile,
          isAccountEnabled:this.formInline.isAccountEnabled,
          roleId:this.formInline.roleId,
          pageIndex:this.pageNo,
          pageSize:this.pageSize,
        }).then(res => {
          this.tableData = res.data.result
          this.totalCount = res.data.total
        })
      },
      getRoleList(){
        Request.ajax('getSelectList',{
          token:this.techLoginInfo.token,
          state:''
        }).then(res => {
          this.roleList = res.data
        })
      },
      checkForm(){
        this.pageNo = 1
        this.getList()
        console.log('查询')
      },
      handleCurrentChange(params){
        this.pageNo = params
        this.getList()
      },
      handleSizeChange(params){
        this.pageSize = params
        this.pageNo = 1
        this.getList()
      },
    }
  }
</script>

<style lang="stylus">
  .userManage-wrap{
    width 100%
    height 100%
    padding 0 0 30px
    overflow hidden
    .el-form-item{
      .el-select{
         width 180px
      }
    }
    .add-button-wrap{
      margin-top 30px
    }
    .table-wrap{
      margin-top 30px
      flex 1
      overflow hidden
      .el-table th, .el-table td{
        text-align center
      }
      .el-table th{
        background #F5F5F5
      }
      .color-a{
        color #3C4B8E
      }
      .disable-a{
        color #999999
      }
    }
    .userManage-content{
      height 100%
      border-radius 4px
      background #fff
      padding 0 30px
      display flex
      flex-direction column
      overflow hidden
      .el-button{
        width 80px
        height 28px
        color #3C4B8E
        border 1px solid #3C4B8E
      }
    }
    .pagination-wrap{
      text-align center
      margin-top 20px
    }
  }
</style>
