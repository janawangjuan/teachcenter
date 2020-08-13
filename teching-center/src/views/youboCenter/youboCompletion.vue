<template>
<div class="youboCompletion-wrap">
  <div class="youboCompletion-title"><span class="goBack">当前位置：数据统计><span @click="goBack">作业数据统计</span>>完成情况</span>
    <span class="export-btn" @click="exportTable">导出表格</span>
  </div>
  <div class="ybc-content">
    <div class="exam-title">{{taskInfo.taskName}}</div>
    <div class="filter-wrap">
      <div class="fw-left">
        <span class="mr20">题目数量：共{{taskInfo.questionNum}}题</span><span class="mr20" v-if="taskInfo.examenStartDate!=0&&taskInfo.examenStartDate!=''">发布时间：{{webApi.formatDate(taskInfo.examenStartDate,'YMD')}}</span><!--<span class="mr20">完成情况：30/50人</span>-->
      </div>
      <div class="fw-right">
        <div class="name-input">
          <el-input :placeholder="'请输入'+(selectNameType=='1'?'姓名':'用户名')" v-model="searchText" class="input-with-select">
            <el-select v-model="selectNameType" slot="prepend" placeholder="请选择姓名/用户名">
              <el-option label="姓名" value="1"></el-option>
              <el-option label="用户名" value="2"></el-option>
            </el-select>
            <el-button slot="append" @click="search" icon="el-icon-search"></el-button>
          </el-input>
        </div>
        <div class="type-select">
          <el-select v-model="status" @change="changeType" placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <el-input placeholder="正确率" v-model="minPercent">
          <template slot="append">%</template>
        </el-input>至
        <el-input placeholder="正确率" v-model="maxPercent">
          <template slot="append">%</template>
        </el-input>
        <span @click="search" class="clear-button">搜索</span>
      </div>
    </div>
    <div class="table-wrap">
      <div class="table-content">
        <el-table
          :data="tableData"
          v-loading="isLoading"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          stripe
          height="100%"
          @selection-change="handleSelectionChange"
          lazy
          ref="multipleTable"
          @sort-change = "sortChange"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="序号"
            type="index">
          </el-table-column>
          <el-table-column
            label="用户名"
            prop="memberNickname">
          </el-table-column>
          <el-table-column
            label="姓名"
            prop="memberName">
          </el-table-column>
          <el-table-column
            label="提交时间"
            prop="submitDate">
            <template slot-scope="scope">{{scope.row.submitDate?webApi.formatDate(scope.row.submitDate,'ALL'):'--'}}</template>
          </el-table-column>
          <el-table-column
            label="完成情况"
            prop="taskState">
            <template slot-scope="scope">{{scope.row.taskState=='-1'?'未开始':(scope.row.taskState=='0'?'未完成':'已完成')}}</template>
          </el-table-column>
          <el-table-column
            label="答对题数/总题数"
            prop="">
            <template slot-scope="scope">{{scope.row.trueNum+'/'+scope.row.totalNum}}</template>
          </el-table-column>
          <el-table-column
            label="正确率"
            prop="trueRate">
            <template slot-scope="scope">{{scope.row.trueRate=='-1'?'--':(scope.row.trueRate+'%')}}</template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <template v-if="scope.row.taskState=='1'">
                <span class="button-b" @click="checkReport(scope.row)">查看报告</span>
                <span class="button-b" @click="checkHistory(scope.row)">做题记录</span>
              </template>
              <template v-else>
                ----
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-bottom">
        <div style="margin-top: 20px;">
          <el-checkbox v-model="allChecked" @change="allCheck()">全选</el-checkbox>
          <span class="send-msg" @click="sendMessage">发送通知</span>
        </div>
        <div class="pagination-wrap"><el-pagination
          background
          layout="prev, pager, next, sizes, total"
          @current-change="sizeChange"
          @size-change="handleSizeChange"
          @prev-click="prevSize"
          @next-click="nextSize"
          :current-page = "currentPage"
          :pageSize="pageSize"
          :total="totalRecord">
        </el-pagination></div>
      </div>
      <el-dialog
        title="发送通知"
        :visible.sync="dialogVisible"
        width="40%"
        center>
        <textarea class="replay-content" ref="replayContent" v-model="message"></textarea>
        <span slot="footer" class="dialog-footer">

			    <el-button size="small" @click="dialogVisible = false">取消</el-button>
           <el-button size="small" type="primary" @click="replay()">发送</el-button>
			  </span>
      </el-dialog>
      <el-dialog
        title="做题记录"
        class="history-dialog"
        :visible.sync="dialogHistory"
        width="80%"
        center>
        <el-table
          :data="historyData"
          v-loading="isLoading"
          height="80%"
          stripe
          ref="historyTable"
        >
          <el-table-column
            label="序号"
            type="index">
          </el-table-column>
          <el-table-column
            label="用户名">
            <template slot-scope="scope">{{historyStudent.memberNickname}}</template>
          </el-table-column>
          <el-table-column
            label="姓名">
            <template slot-scope="scope">{{historyStudent.memberName}}</template>
          </el-table-column>
          <el-table-column
            label="提交时间"
            prop="submitDate">
            <template slot-scope="scope">{{scope.row.answerTime?webApi.formatDate(scope.row.answerTime,'ALL'):'--'}}</template>
          </el-table-column>
          <el-table-column
            label="完成情况"
            prop="taskState">
            <template slot-scope="scope">{{scope.row.taskState=='-1'?'未开始':(scope.row.taskState=='0'?'未完成':'已完成')}}</template>
          </el-table-column>
          <el-table-column
            label="答对题数/总题数"
            prop="">
            <template slot-scope="scope">{{scope.row.questionCount-scope.row.misCount+'/'+scope.row.questionCount}}</template>
          </el-table-column>
          <el-table-column
            label="正确率"
            prop="trueRate">
            <template slot-scope="scope">{{Math.round((scope.row.questionCount-scope.row.misCount)/scope.row.questionCount * 10000)/100+'%'}}</template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <span class="button-b" @click="checkReport(scope.row)">查看报告</span>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <div v-if="dialogReport">
        <el-dialog
          title="学习报告"
          :visible.sync="dialogReport"
          width="80%"
          center>
          <studyExamReport :studentInfo="clickStudent"></studyExamReport>
        </el-dialog>
      </div>
    </div>
  </div>
</div>
</template>

<script>
  import Request from '@/request'
  import axios from 'axios';
  import {mapState} from 'vuex'
  import studyExamReport from '@/components/studyExamReport'
  export default {
    name: "youboCompletion",
    components:{
      studyExamReport
    },
    computed : {
      ...mapState({
        envType:state => state.global.envType,
      }),
      techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))}
    },
    mounted(){
      this.getTaskInfo()
      this.getClassDetail()
    },
    data(){
      return{
        searchText:'',
        minPercent:'',
        maxPercent:'',
        isLoading:false,
        selectNameType:'1',
        classCourseInfo:'',
        dialogHistory:false,
        dialogReport:false,
        historyData:[],
        taskInfo:'',
        totalRecord:0,
        receiveIds:'',
        status:'',
        selectStudent:'',
        historyStudent:'', //查看做题记录的学生
        clickStudent:'',
        currentPage:1,
        pageSize:20,
        tableData:[],
        message:'',
        typeOptions:[{name:'全部',value:''},{name:'已完成',value:'1'},{name:'未完成',value:'0'},{name:'未开始',value:'-1'}],
        allChecked:false,
        dialogVisible:false,
      }
    },
    methods:{
      changeType(){
        this.getTableData()
      },
      handleSelectionChange(val){
        this.selectStudent = val
      },
      getClassDetail(){
        Request.ajax('getClassInfo',{
          token:this.techLoginInfo.token,   //
          classId:this.$route.params.classId
        }).then((res)=>{
          if(res && res.state=='success'){
            this.classCourseInfo = res.data
            this.getTableData()
            //this.searchCourseAppraisalTaskBySubjectId()
          }else{
            this.classCourseInfo = {}
            this.webApi.alert(res.msg||'服务器异常，请稍后重试～')
          }
        })
      },
      getHistoryData(){
        axios.post('https://'+(this.envType=='1'?'apitikudemo':'apitiku')+'.zbgedu.com/manager/managerInterface/v1/studentTestPaperAnswerHistory',
          {
            teacherToken:this.techLoginInfo.token,
            studentId:this.historyStudent.memberId,
            testPaperId:this.historyStudent.testPaperId,
            //testPaperType:3
          }).then(res => {
            if(res && res.state == 'success'){
              this.historyData = res.data
            }else{
              this.webApi.alert('服务器异常，请稍后重试~')
            }
        })
        /*Request.ajax('getStudentTestPaperAnswerHistory',{
          "teacherToken":this.techLoginInfo.token,
          "studentId":"b12a8ae5c4d711e989b300163e0f507b",
          "testPaperId":"49d459255368e585030438540351823a",
          "testPaperType":3,
        }).then( res => {

        })*/
      },
      checkHistory(params){
        this.historyStudent = params
        this.dialogHistory = true
        this.getHistoryData()
      },
      checkReport(params){
        this.clickStudent = params
        this.dialogReport = true
      },
      exportTable(){
        this.webApi.postExcelFile({
          token:this.techLoginInfo.token,
          classId: this.$route.params.classId,
          courseId: this.classCourseInfo.courseId,
          courseTeachingType:'flipped',
          taskId:this.taskInfo.taskId,
        },(this.envType=='1'?'https://apidemo.zbgedu.com':'https://zbapi.zbgedu.com')+'/api/study/userAction/statistics/exportStatisticsMemberPaper')
      },

      goBack(){
        this.$router.back(-1)
      },
      sortChange(column){ //表格排序触发函数
        this.currentPage = 1
      },
      getTableData(){
        this.isLoading = true
        let params = {
          token:this.techLoginInfo.token,
          courseTeachingType:'flipped',
          classId:this.$route.params.classId,
          courseId:this.classCourseInfo.courseId,
          taskId:this.$route.params.examId,
          taskState:this.status,
          trueRateBegin:this.minPercent,
          trueRateEnd:this.maxPercent,
          pageIndex:this.currentPage,
          pageSize:this.pageSize
        }
        if(this.selectNameType == '1'){
          params.memberNameLike = this.searchText
        }else{
          params.memberNicknameLike = this.searchText
        }
        Request.ajax('getStatisticsMemberPaperPage',params).then(res=>{
          if(res.state == 'success'){
            res.data.result.forEach((item) => {
              item.hasChildren = true
            })
            this.tableData=res.data.result
            this.totalRecord = res.data.total
          }else{
            this.webApi.alert(res.msg||'服务器异常，请稍后重试～')
          }
          this.isLoading = false
        })
      },
      replay(){
        var content = this.$refs.replayContent.value;
        if(!content){
          this.webApi.alert("请输入通知内容！");
          return;
        }
        Request.ajax('insertMessage',{
          "sendId": this.techLoginInfo.id,
          "textTitle": '通知',
          "text": content,
          "type": 0,
          "author": this.techLoginInfo.nickName,
          "receiveIds": this.receiveIds,
        }).then(res=>{
          if(res && res.state=="success"){
            this.webApi.alert("发送成功～");
            this.dialogVisible = false
          }else{
            this.webApi.alert(res.msg)
          }
        })
      },
      sizeChange(val){
        this.currentPage = val
        this.getTableData()
      },
      handleSizeChange(val){
        this.pageSize = val
        this.currentPage = 1
        this.getTableData()
      },

      prevSize(){
        this.currentPage--
        this.getTableData()
      },
      nextSize(){
        this.currentPage++
        this.getTableData()
      },
      getTaskInfo(){
        Request.ajax('getTaskInfoAndProgress',{
          token:this.techLoginInfo.token,
          taskId:this.$route.params.examId
        }).then(res => {
          if(res && res.state=='success'){
            this.taskInfo = res.data
          }else{
            this.webApi.alert(res.msg||'服务器异常，请稍后重试～')
          }
        })
      },
      search(){
        this.currentPage = 1
        if(this.minPercent&&this.maxPercent){
          if(Number(this.minPercent) > Number(this.maxPercent)){
            this.webApi.alert('正确率范围开始值不能大于结束值~')
            return
          }
        }
        this.getTableData()
      },
      allCheck(data){
        this.toggleSelection(this.tableData)
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row,!this.allSelect);
          });
          this.allSelect = !this.allSelect;
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      sendMessage(){
        if(this.selectStudent.length == 0){
          this.webApi.alert('请至少选中一个学生～')
          return
        }
        let receiveIdsArr = [];
        this.selectStudent.forEach(item => {
          receiveIdsArr.push(item.memberId);
        });
        this.receiveIds = receiveIdsArr.join(",");
        this.message = `同学您好！您的"${this.classCourseInfo.className}"的"${this.taskInfo.taskName}"任务尚未完成！请尽快完成哦！`
        this.dialogVisible = true
      }
    }
  }
</script>

<style lang="stylus">
.youboCompletion-wrap{
  height 100%
  overflow: hidden
  font-size 14px
  color #666
  display flex
  flex-direction column
  .youboCompletion-title{
    font-size 14px
    color #666
    height 40px;
    .goBack{
      cursor pointer
    }
    .export-btn{
      float: right
      display inline-block
      width 93px
      height 25px
      line-height 25px
      text-align center
      color #FF366D
      cursor pointer
      background #FFD4E0
      border-radius 13px
    }
  }
  .ybc-content{
    flex 1
    display flex
    overflow-y hidden
    flex-direction column
    border-radius 4px
    background #fff
    padding 0 25px
    .exam-title{
      font-weight bold
      font-size 16px
      line-height 30px
      padding 10px 0
      color #333
    }
    .filter-wrap{
      overflow: hidden
      display flex
      .fw-left{
        flex 1
        .mr20{
          margin-right: 20px
        }
      }
      .fw-right{
        width 555px
        .type-select{
          display inline-block
          margin-right: 15px
        }
        .name-input{
          display inline-block
          margin-right: 15px
          .el-input{
            width auto
            .el-input__inner{
              width 80px
            }
          }
        }
        .el-input{
          width 80px
          .el-input-group__prepend{
            .el-select{
              width 100px
            }
          }
          .el-input__icon{
            line-height 28px
          }
          .el-input__inner{
            height 28px;
            line-height 28px
            padding 0 5px
          }
          .el-input-group__append{
            padding 0 5px
          }
        }
        .clear-button{
          cursor pointer
          margin-left: 15px
        }
      }
    }
    .table-wrap{
      margin-top 20px
      flex 1
      overflow hidden
      display flex
      flex-direction column
      .table-content{
        flex 1
        overflow hidden
        .el-table{
          border 1px solid #eee
          border-bottom none
          .button-b{
            cursor pointer
          }
        }
      }
      .table-bottom{
        height 100px
        .pagination-wrap{
          text-align center
          margin-top 10px
        }
      }
      .send-msg{
        display:inline-block;
        width:88px;
        height:26px;
        text-align:center;
        line-height:26px;
        margin-left 10px
        border-radius 13px
        background #FFD4E0
        color:#ff366d;
        font-size:14px;
        cursor:pointer;
      }
    }
    .el-dialog{
      .el-dialog__body{
        .replay-content{
          width 100%
          min-height 160px
          font-size 14px
          resize none
          color #333333
          border 1px solid #eee
          padding: 5px;
          box-sizing: border-box;
        }
        .replay-content:focus{
          outline none
        }
      }
      .el-dialog__footer{
        text-align right
      }
    }
    .history-dialog{
      .el-dialog{
        height 70%
      }
    }
  }
}
</style>
