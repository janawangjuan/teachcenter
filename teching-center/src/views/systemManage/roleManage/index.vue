<template>
  <div class="roleManage-wrap">
    <div class="roleManage-content">
      <div>
        <unfoldCollapse @checkForm="checkForm">
          <el-form :inline="true" size="mini" :model="formInline" class="demo-form-inline">
            <el-form-item label="角色名称">
              <el-input v-model="formInline.name" placeholder="角色名称"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="formInline.state" placeholder="状态">
                <el-option label="启用" value="1"></el-option>
                <el-option label="停用" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </unfoldCollapse>
      </div>
      <div class="add-button-wrap">
        <el-button size="mini" @click="addRole">添加角色</el-button>
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
            prop="name"
            label="角色名称">
          </el-table-column>
          <el-table-column
            label="创建时间">
            <template slot-scope="scope">{{webApi.formatDate(scope.row.createDate,'ALL')}}</template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态">
            <template slot-scope="scope">{{scope.row.state==1?'启用':'停用'}}</template>
          </el-table-column>
          <el-table-column
            prop="description"
            label="备注">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <a :class="['color-a','mr20',scope.row.isSystem==1?'disable-a':'']" href="javascript:;" @click="edit(scope.row)">编辑</a>
              <a :class="['color-a',scope.row.hasMember>0||scope.row.isSystem==1?'disable-a':'']" href="javascript:;" @click="delete1(scope.row)">删除</a>
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
    components:{
      systemBreadcrumb,
      unfoldCollapse
    },
    computed:{
      techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))},
    },
    mounted(){
      this.getList()
      this.updateShowUserBack(false)
    },
    data(){
      return{
        pageSize:20,
        totalCount:0,
        pageNo:1,
        loading:false,
        tableData:[],
        formInline:{
          name:'',
          state:''
        }
      }
    },
    methods:{
      ...mapMutations('systemManage',['updateAddRoleType','updateSelectRole','updateShowUserBack']),
      getList(){
        Request.ajax('getRoleList',{
          token:this.techLoginInfo.token,
          name:this.formInline.name,
          state:this.formInline.state,
          pageIndex:this.pageNo,
          pageSize:this.pageSize
        }).then(res => {
          this.tableData = res.data.result
          this.totalCount = res.data.total
        })
      },
      addRole(){
        this.updateAddRoleType('create')
        this.$router.push('addRole')
      },
      edit(params){
        if(params.isSystem==1){
          this.$message('该角色不可编辑~')
          return
        }
        this.updateAddRoleType('edit')
        this.updateSelectRole(params)
        this.$router.push('addRole')
      },
      delete1(params){
        if(params.hasMember > 0){
          this.$message('该角色不可删除~')
          return
        }
        this.$confirm('确定要删除该角色吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showClose:false,
          type: 'warning'
        }).then(() => {
          Request.ajax('deleteRole',{
            'token':this.techLoginInfo.token,
            'roleId':params.id,
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
      checkForm(){
        this.pageNo = 1
        this.getList()
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
.roleManage-wrap{
  width 100%
  height 100%
  padding 0 0 30px
  overflow hidden
  display flex
  flex-direction column
  .color-a{
    color #3C4B8E
  }
  .disable-a{
    color #999999
  }
  .el-table th, .el-table td{
    text-align center
  }
  .el-table th{
    background #F5F5F5
  }
  .add-button-wrap{
    margin-top 30px
  }
  .table-wrap{
    margin-top 30px
    flex 1;
    overflow hidden
  }
  .roleManage-content{
    flex 1
    border-radius 4px
    background #fff
    padding 0 30px
    overflow: hidden;
    display flex
    flex-direction column
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
