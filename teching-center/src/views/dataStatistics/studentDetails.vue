<template>
  <div class="studentDetails-wrap">
    <div class="return-wrap">
      <span class="return-span" @click="returnBack"><i class="el-icon-back icon-usual"></i>返回</span>
    </div>
    <div class="filter-wrap">
      <div class="filter">
        <el-form :inline="true"  size="mini">
          <el-form-item label="教学计划">
            <el-select v-model="filterData.plan" placeholder="教学计划">
              <el-option value="" label="全部计划"></el-option>
              <el-option v-for="(item,index) in planList" :value="item.plan_order" :key="index" :label="item.planTitle"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="filterData.studentName" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="filterData.loginName" placeholder="请输入用户名"></el-input>
          </el-form-item>
        </el-form>
        <div class="btn-wrap">
          <a href="javascript:;" class="search-btn" @click="searchList"><i class="el-icon-search"></i>搜索</a>
          <a href="javascript:;" class="search-btn" @click="exportTable"><i class="el-icon-printer"></i>导出</a>
        </div>
      </div>
    </div>
    <div class="table-wrap">
      <el-table
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        :stripe="true"
        height="100%"
        size="mini"
        style="width: 100%">
        <el-table-column
          prop="studentName"
          fixed
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="loginName"
          fixed
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="completed"
          label="已完成任务">
        </el-table-column>
        <el-table-column
          prop="totalNum"
          label="任务总数">
        </el-table-column>
        <el-table-column
          prop="videoCompleted"
          label="已完成视频">
        </el-table-column>
        <el-table-column
          prop="videoOngoing"
          label="学习中视频">
        </el-table-column>
        <el-table-column
          label="未完成视频">
          <template slot-scope="scope">
            {{scope.row.videoTotal-scope.row.videoCompleted-scope.row.videoOngoing}}
          </template>
        </el-table-column>
        <el-table-column
          prop="videoTotal"
          label="视频总数">
        </el-table-column>
        <el-table-column
          prop="appraisalCompleted"
          label="已完成测评">
        </el-table-column>
        <el-table-column
          prop="appraisalTotal"
          label="测评总数">
        </el-table-column>
        <el-table-column
          prop="practiceCompleted"
          label="已完成练习">
        </el-table-column>
        <el-table-column
          prop="practiceTotal"
          label="练习总数">
        </el-table-column>
        <el-table-column
          prop="openCourseCompleted"
          label="已完成直播">
        </el-table-column>
        <el-table-column
          prop="openCourseTotal"
          label="直播总数">
        </el-table-column>
        <el-table-column
          label="总进度">
          <template slot-scope="scope">
            {{scope.row.totalNum>0?((Math.floor(scope.row.completed/scope.row.totalNum*10000))/100+'%'):'--'}}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="height: 40px;text-align: center;">
      <el-pagination
        background
        layout="prev, pager, next,sizes,total"
        :pageSize="pageSize"
        :current-page="pageNo"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :total="totalCount">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import Request from '@/request'
  export default {
    name: "studentDetails",
    props:{
      studentInfo:{
        type:Object,
        default:()=>{}
      }
    },
    computed:{
      techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))},
    },
    data(){
      return{
        filterData:{
          plan:'',
          studentName:'',
          loginName:''
        },
        pageNo:1,
        pageSize:20,
        loading:true,
        envType:parseInt(this.cookie.get('envType')),
        planList:[],
        tableData:[],
        totalCount:0,
      }
    },
    mounted(){
      console.log('1111')
      this.getStudentInfo()
      this.getClassPlanDetail()
    },
    methods:{
      returnBack(){
        this.$emit('returnBack')
      },
      exportTable(){
        this.webApi.postExcelFile({
          classId:this.studentInfo.classId,
          courseId:this.studentInfo.courseId,
          weekNum:this.filterData.plan,
          studentName:this.filterData.studentName,
          loginName:this.filterData.loginName,
          token:this.techLoginInfo.token,
          versionId:this.studentInfo.courseVersionId
        },(this.envType=='1'?'https://apidemo.zbgedu.com':'https://api.zbgedu.com')+'/api/edu/userAction/classes/yb/studentLearnProgress/export')
      },
      getStudentInfo(){
        this.loading = true
        Request.ajax('findStudentLearnProgress',{
          classId:this.studentInfo.classId,
          courseId:this.studentInfo.courseId,
          weekNum:this.filterData.plan,
          currentPage:this.pageNo,
          studentName:this.filterData.studentName,
          loginName:this.filterData.loginName,
          pageSize:this.pageSize,
          token:this.techLoginInfo.token,
          versionId:this.studentInfo.courseVersionId,
        }).then(res=>{
          this.loading = false
          if(res && res.state == 'success'){
            this.tableData = res.data.studentList
            this.totalCount = res.data.totalRecord
          }else{
            this.webApi.alert(res.msg)
          }
        })
      },
      getClassPlanDetail(){
        Request.ajax('getClassPlanDetail',{
          classId:this.studentInfo.classId,
          courseId:this.studentInfo.courseVersionId,
          token:this.techLoginInfo.token,
          planType:'1'
        }).then(res=>{
          if(res && res.state == 'success'){
            this.planList = res.data
          }else{
            this.webApi.alert(res.msg)
          }
        })
      },
      handleCurrentChange(params){
        this.pageNo = params
        this.getStudentInfo()
      },
      handleSizeChange(params){
        this.pageNo = 1
        this.pageSize = params
        this.getStudentInfo()
      },
      searchList(){
        this.pageNo = 1
        this.getStudentInfo()
      }
    }
  }
</script>

<style lang="stylus">
.studentDetails-wrap
  width 100%
  height 100%
  display flex
  flex-direction column
  .return-wrap
    padding-top 10px
    height 40px
    line-height 30px
    padding-left 20px
    font-size 14px
    font-weight bold
    color #333
    .return-span
      cursor pointer
      .icon-usual
        margin-right 5px
        font-weight bold
  .filter-wrap
    padding 20px
    .filter
      padding 20px
      border 1px solid #f7f7f7
      border-radius 4px
      position relative
      .el-form--inline
        .el-form-item
          margin-right 30px
      .btn-wrap
        width 100%
        position absolute
        left 0
        text-align center
        bottom -12px
        .search-btn
          display inline-block
          padding 0 10px
          height 24px
          font-size 14px
          line-height 24px
          background #fff
          border 1px solid #f7f7f7
          border-radius 4px
  .table-wrap
    padding 0 20px
    margin-top 20px
    .el-table
      th
        text-align center
        background #f7f7f7
        border none
        text-align center
        border none
      .el-table__body
        tr.hover-row
          td
            background #f5f7fa
    .el-pagination
      text-align center
      margin-top 15px
.ffff
  width 1px
</style>
