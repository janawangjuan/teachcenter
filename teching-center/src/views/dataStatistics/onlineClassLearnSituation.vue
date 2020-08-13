<template>
  <div class="onlineClassLearnSituation-wrap">
    <systemBreadcrumb>
      <el-breadcrumb-item :to="{ path: '/tmIndex/systemManage' }">查询统计分析</el-breadcrumb-item>
      <el-breadcrumb-item>网课学员学情查询</el-breadcrumb-item>
    </systemBreadcrumb>
    <div class="onlineClassLearnSituation-content">
      <div>
        <unfoldCollapse @checkForm="checkForm">
          <el-form :inline="true" :model="formInline"
                   size="mini"
                   label-position="left" label-width="100px" class="demo-form-inline">
            <el-form-item label="项目">
              <el-select v-model="formInline.item" placeholder="项目" @change="changeItem">
                <el-option value="" label="全部项目"></el-option>
                <el-option v-for="(item,index) in options1" :value="item.itemId" :key="index" :label="item.itemName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="科目">
              <el-select v-model="formInline.subject" placeholder="科目">
                <el-option value="" label="全部科目"></el-option>
                <el-option v-for="(item,index) in options2" :value="item.courseCategoryId" :key="index" :label="item.courseCategoryName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属分部">
              <el-select v-model="formInline.branchId" clearable placeholder="所属分部">
                <el-option :label="item.orgName" :value="item.orgId" v-for="(item,index) in branchList" :key="index+'org'"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="授课类型">
              <el-select v-model="formInline.teachingType" clearable placeholder="授课类型">
                <el-option :label="item.title" :value="item.value" v-for="item in classSelectList" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="课程名称">
              <el-input v-model="formInline.courseName" placeholder="请输入课程名称"></el-input>
            </el-form-item>
            <el-form-item label="教学课程名称">
              <el-input v-model="formInline.courseVersionName" placeholder="请输入教学课程名称"></el-input>
            </el-form-item>
            <el-form-item label="课程学习情况">
              <el-select v-model="formInline.courseStatus" clearable placeholder="课程学习情况">
                <el-option label="未激活" value="1"></el-option>
                <el-option label="学习中" value="2"></el-option>
                <el-option label="已过期" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否赠送">
              <el-select v-model="formInline.isGive" clearable placeholder="状态">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单类型">
              <el-select v-model="formInline.orderType" clearable placeholder="订单类型">
                <el-option label="个人订单" value="1"></el-option>
                <el-option label="大客户方向班订单" value="2"></el-option>
                <el-option label="大客户精英班订单" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="学员姓名">
              <el-input v-model="formInline.studentName" placeholder="请输入学员姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号码">
              <el-input v-model="formInline.mobile" placeholder="请输入学员手机号码"></el-input>
            </el-form-item>
            <el-form-item label="是否重修">
              <el-select v-model="formInline.isRehear" clearable placeholder="状态">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="激活时间">
              <el-date-picker
                v-model="formInline.activeTime"
                type="daterange"
                unlink-panels
                range-separator="至"
                size="mini"
                @change="changeRangeTime(1)"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始日期"
                :picker-options="pickerOptions0"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="课程到期时间">
              <el-date-picker
                v-model="formInline.endTime"
                type="daterange"
                unlink-panels
                range-separator="至"
                size="mini"
                @change="changeRangeTime(2)"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始日期"
                :picker-options="pickerOptions0"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="学籍状态">
              <el-select v-model="formInline.studyStatus" clearable placeholder="状态">
                <el-option label="未开始" value="1"></el-option>
                <el-option label="正常" value="2"></el-option>
                <el-option label="已到期" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="总进度">
              <el-input v-model="formInline.minProgress" placeHolder="开始"><template slot="append">%</template></el-input>至
              <el-input v-model="formInline.maxProgress" placeHolder="结束"><template slot="append">%</template></el-input>
            </el-form-item>
          </el-form>
        </unfoldCollapse>
      </div>
      <div class="export-btn-wrap">
        <el-button size="mini" @click="exportTable">导出</el-button>
      </div>
      <div class="table-wrap">
        <el-table
          :data="tableData"
          tooltip-effect="dark"
          v-loading="loading"
          :stripe="true"
          size="mini"
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            fixed
            width="50"></el-table-column>
          <el-table-column
            prop="studentName"
            fixed
            label="学员姓名">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="手机号码">
          </el-table-column>
          <el-table-column
            prop="branchName"
            label="所属分部">
          </el-table-column>
          <el-table-column
            prop="itemName"
            label="项目">
          </el-table-column>
          <el-table-column
            prop="courseCategoryName"
            label="科目">
          </el-table-column>
          <el-table-column
            prop="studyStatusName"
            label="学籍状态">
          </el-table-column>
          <el-table-column
            prop="courseName"
            label="课程名称">
          </el-table-column>
          <el-table-column
            prop="teachingTypeName"
            label="授课类型">
          </el-table-column>
          <el-table-column
            prop="orderTypeName"
            label="订单类型">
          </el-table-column>
          <el-table-column
            prop="courseStatusName"
            label="课程学习情况">
          </el-table-column>
          <el-table-column
            prop="isGiveName"
            label="是否赠送">
          </el-table-column>
          <el-table-column
            prop="isRehearName"
            label="是否重修">
          </el-table-column>
          <el-table-column
            prop="rehearNum"
            label="重修次数">
          </el-table-column>
          <el-table-column
            prop="courseVersionName"
            label="教学课程名称">
          </el-table-column>
          <el-table-column
            prop="planTypeName"
            label="学习模式">
          </el-table-column>
          <el-table-column
            prop="totalProgress"
            label="总进度">
            <template slot-scope="scope">{{scope.row.totalProgress}}%</template>
          </el-table-column>
          <el-table-column
            prop="completedNum"
            label="已完成数">
          </el-table-column>
          <el-table-column
            prop="unlearnedNum"
            label="未开始数">
          </el-table-column>
          <el-table-column
            prop="learningNum"
            label="学习中数">
          </el-table-column>
          <el-table-column
            label="激活时间">
            <template slot-scope="scope">{{scope.row.activeTime?webApi.formatDate(scope.row.activeTime,'ALL'):'----'}}</template>
          </el-table-column>
          <el-table-column
            label="课程到期时间">
            <template slot-scope="scope">{{scope.row.endTime?webApi.formatDate(scope.row.endTime,'ALL'):'----'}}</template>
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
  export default {
    name: "onlineClassLearnSituation",
    components:{
      systemBreadcrumb,
      unfoldCollapse
    },
    computed:{
      techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))}
    },
    data(){
      return{
        formInline:{
          name:'',
          state:'',
          item:'',
          subject:'',
          courseName:'',
          courseStatus:'',
          courseVersionName:'',
          studentName:'',
          isGive:'',
          orderType:'',
          mobile:'',
          studyStatus:'',
          teachingType:'',
          isRehear:'',
          minProgress:'',
          maxProgress:'',
          branchId:'',
          endTime:null,
          activeTime:null
        },
        activeTimeBegin:'',
        activeTimeEnd:'',
        endTimeBegin:'',
        endTimeEnd:'',
        pickerOptions0: {   //设置提问时间不能大于当天
          disabledDate(time) {
            return time.getTime() > Date.now();//如果没有后面的-8.64e7就是不可以选择今天的
          }
        },
        envType:parseInt(this.cookie.get('envType')),
        classSelectList:[],
        loading:false,
        tableData:[1,1,1,1,1,1,1,,,1,1,,1,11,11,1,1,1,1,1,1,1,1,1,1,1,1],
        totalCount:0,
        pageSize:20,
        pageNo:1,
        options1:'',
        options2:'',
        branchList:[]
      }
    },
    mounted(){
      this.getTableData()
      this.findItemCategoryList()
      this.getCourseType()
      this.getTechBranch()
    },
    methods:{
      checkForm(){
        this.getTableData()
      },
      getTableData(){
        this.loading = true
        if(this.formInline.minProgress&&this.formInline.maxProgress){
          if(Number(this.formInline.maxProgress)<Number(this.formInline.minProgress)){
            this.webApi.alert('总进度开始值不能大于结束值~')
          }
        }
        Request.ajax('selectStatisticsOnlineCoursePage',{
          token:this.techLoginInfo.token,
          itemId:this.formInline.item,
          courseCategoryId:this.formInline.subject,
          branchId:this.formInline.branchId,
          teachingType:this.formInline.teachingType,
          courseName:this.formInline.courseName,
          courseVersionName:this.formInline.courseVersionName,
          courseStatus:this.formInline.courseStatus,
          isGive:this.formInline.isGive,
          orderType:this.formInline.orderType,
          studentName:this.formInline.studentName,
          mobile:this.formInline.mobile,
          isRehear:this.formInline.isRehear,
          activeTimeBegin:this.activeTimeBegin,
          activeTimeEnd:this.activeTimeEnd,
          endTimeBegin:this.endTimeBegin,
          endTimeEnd:this.endTimeEnd,
          studyStatus:this.formInline.studyStatus,
          totalProgressBegin:this.formInline.minProgress,
          totalProgressEnd:this.formInline.maxProgress,
          pageIndex:this.pageNo,
          pageSize:this.pageSize
        }).then(res => {
          this.loading = false
          if(res && res.state == 'success'){
            this.tableData = res.data.result
            this.totalCount = res.data.total
            //this.options1 = res.data
            //this.totalCount = res.data.totalRecord
          }else{
            this.webApi.alert(res.msg||'服务器异常，请重试~')
          }
        })
      },
      exportTable(){   //导出表格数据
        if(this.formInline.courseName == ''){
          this.webApi.alert('课程名称为必填项~')
          return
        }
        this.webApi.postExcelFile({
          token:this.techLoginInfo.token,
          itemId:this.formInline.item,
          courseCategoryId:this.formInline.subject,
          branchId:this.formInline.branchId,
          teachingType:this.formInline.teachingType,
          courseName:this.formInline.courseName,
          courseVersionName:this.formInline.courseVersionName,
          courseStatus:this.formInline.courseStatus,
          isGive:this.formInline.isGive,
          orderType:this.formInline.orderType,
          studentName:this.formInline.studentName,
          mobile:this.formInline.mobile,
          isRehear:this.formInline.isRehear,
          activeTimeBeginDate: this.activeTimeBegin,
          activeTimeEndDate: this.activeTimeEnd,
          endTimeBeginDate: this.endTimeBegin,
          endTimeEndDate: this.endTimeEnd,
          studyStatus:this.formInline.studyStatus,
          totalProgressBeginBigDecimal: this.formInline.minProgress,
          totalProgressEndBigDecimal: this.formInline.maxProgress
        },(this.envType=='1'?'https://apidemo.zbgedu.com':'https://zbapi.zbgedu.com')+'/api/study/userAction/statistics/onlineCourse/exportStatisticsOnlineCourse')
      },
      changeRangeTime(params){   //改变提问时间
        if(params == 1){
          if(this.formInline.activeTime == null){
            this.activeTimeBegin = ''
            this.activeTimeEnd = ''
          }else{
            this.activeTimeBegin = this.formInline.activeTime[0]
            this.activeTimeEnd = this.formInline.activeTime[1]
          }
        }else{
          if(this.formInline.endTime == null){
            this.endTimeBegin = ''
            this.endTimeEnd = ''
          }else{
            this.endTimeBegin = this.formInline.endTime[0]
            this.endTimeEnd = this.formInline.endTime[1]
          }
        }

      },
      findItemCategoryList(){
        Request.ajax('getItemCategory',{
          token:this.techLoginInfo.token,
        }).then(res=>{
          if(res && res.state == 'success'){
            this.options1 = res.data
            //this.totalCount = res.data.totalRecord
          }else{
            this.webApi.alert(res.msg||'服务器异常，请重试~')
          }
        })
      },
      getTechBranch(){
        Request.ajax('getTechBranch',{
          token:this.techLoginInfo.token,
        }).then(res => {
          if(res && res.state == 'success'){
            this.branchList = res.data
          }else{
            this.webApi.alert(res.msg||'服务器异常，请重试~')
          }
        })
      },
      getCourseType(){    //获取课程类型
        Request.ajax('getTeachingType',{
          token:this.techLoginInfo.token
        }).then((res)=>{
          if(res&&res.state=='success'){
            //暂时屏蔽ez和优博
            this.classSelectList = res.data.filter(item => item.value!='flipped'&&item.value!='facecourse')
          }
        })
      },
      changeItem(params){
        if(params == ''){
          this.options2 = []
        }else{
          this.options2 = this.options1.filter(item => params == item.itemId)[0].courseCategoryList
        }
        this.formInline.subject = ''
      },
      handleCurrentChange(params){
        this.pageNo = params
        this.getTableData()
      },
      handleSizeChange(params){
        this.pageSize = params
        this.pageNo = 1
        this.getTableData()
      }
    }
  }
</script>

<style lang="stylus">
.onlineClassLearnSituation-wrap{
  padding 0 30px 30px
  width 100%
  height 100%
  flex-direction column
  overflow auto
  .el-input{
    width 220px
  }
  .el-input-group--append{
    width 101px
  }
  .el-range-editor--mini .el-range-separator{
    line-height 18px
  }
  .el-range-editor--mini.el-input__inner{
    width 220px
    height 28px
    line-height 28px
  }
  .el-input-group__append{
    padding 0 5px
  }
  .el-form-item__label{
    font-weight bold
  }
  .onlineClassLearnSituation-content{
    flex 1
    display flex
    flex-direction: column
    overflow hidden
  }
  .el-select{
    width 220px
  }
  .export-btn-wrap{
    text-align right
    height 60px
    .el-button{
      width 80px
      border 1px solid #3C4B8E
      color #3C4B8E
    }
  }
  .table-wrap{
    overflow hidden
  }
  .el-table th.is-leaf{
    background #F5F5F5
    min-height 50px
  }
}
</style>
