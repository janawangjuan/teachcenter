<template>
  <div id="app" class="app">
    <div class="faceCompletion-wrap">
      <el-container>
        <el-header>
          <iHeader></iHeader>
        </el-header>
        <el-main>
          <div class="faceCompletion-content">
            <div class="youboCompletion-title"><span class="goBack">{{this.$route.params.className}}&gt;完成情况</span>
              <span class="export-btn" @click="exportExcel">导出表格</span>
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
                      width="180"
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
                <div class="table-bottom">

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
            <examSource @closeExam="closeExamPop" v-if="showExamSource" :examParams="examParams"></examSource>
          </div>
        </el-main>
      </el-container>

    </div>
  </div>

</template>

<script>
  import iHeader from "@/components/i-header"
  import iLoading from '@/components/i-loading'
  import examSource from '@/components/examSource'
  import Request from '../../request'
  import studyExamReport from '@/components/studyExamReport'
  import axios from 'axios';
  import {mapState} from 'vuex'
  export default {
    name: "faceCompletion",
    components:{
      iHeader,
      iLoading,
      examSource,
      studyExamReport
    },
    computed:{
      ...mapState({
        //techLoginInfo:state=>state.global.techLoginInfo
      }),
      techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))}
    },
    data(){
      return {
        className:'',
        typeOptions:[{name:'全部',value:''},{name:'已完成',value:'1'},{name:'未完成',value:'0'},{name:'未开始',value:'-1'}],
        studentName:'',
        minPercent:'',
        maxPercent:'',
        allChecked:false,
        dialogVisible:false,
        dialogHistory:false,
        dialogReport:false,
        totalRecord:0,
        pageSize:20,
        selectStudent:'',
        examInfo:'',
        historyData:[],
        isLoading:false,
        searchText:'',
        status:'',
        message:'',
        examParams:'',
        selectNameType:'1',
        urlStr:'',
        taskInfo:'',
        envType:parseInt(this.cookie.get('envType')),
        routeParams:this.$route.params,
        tableData:[],
        showExamSource:false
      }
    },
    mounted(){
      this.getTableData()
      this.getTaskInfo()
      //this.getExportExcelUrl()
    },
    methods:{
      handleIconClick(){
        console.log('111')
      },
      handleSelectionChange(val){
        this.selectStudent = val
      },
      changeType(){
        this.getTableData()
      },
      sortChange(column){ //表格排序触发函数
        this.currentPage = 1
      },
      checkHistory(params){
        this.historyStudent = params
        this.dialogHistory = true
        this.getHistoryData()
      },
      handleSizeChange(params){
        this.pageSize = params
        this.currentPage = 1
        this.getTableData()
      },
      sizeChange(params){
        this.currentPage = params
        this.getTableData()
      },
      checkReport(params){
        this.clickStudent = params
        this.dialogReport = true
      },
      getHistoryData(){
        axios.post('https://'+(this.envType=='1'?'apitikudemo':'apitiku')+'.zbgedu.com/manager/managerInterface/v1/studentTestPaperAnswerHistory',
          {
            teacherToken:this.techLoginInfo.token,
            studentId:this.historyStudent.memberId,
            testPaperId:this.historyStudent.testPaperId,
            //testPaperType:3
          }).then(res => {
            console.log(res)
            if(res && res.state == 'success'){
              this.historyData = res.data
            }else{
              this.webApi.alert('服务器异常，请稍后重试~')
            }
          }).catch(err => {
          this.webApi.alert(err.msg)
          })
      },
      exportExcel(){
        this.webApi.postExcelFile({
          token:this.techLoginInfo.token,
          classId: this.$route.params.classId,
          taskId:this.$route.params.examenId
        },(this.envType=='1'?'https://apidemo.zbgedu.com':'https://zbapi.zbgedu.com')+'/api/study/userAction/statistics/faceCoursePaper/exportStatisticsFaceMemberPaper')
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
      cheakExam(params){
        this.examParams = params
        this.showExamSource = true
        /*let str = 'elearning'
        if(this.envType == '1'){
          str = 'elearningdemo'
        }
        window.open('http://'+str+'.zbgedu.com/#showAnswer?exerciseIds='+params.exerciseId+'&showType=2')*/
      },
      closeExamPop(){
        this.showExamSource = false
      },
      getTableData(){
        this.isLoading = true
        let params = {
          token:this.techLoginInfo.token,
          classId:this.$route.params.classId,
          taskId:this.$route.params.examenId,
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
        Request.ajax('getStatisticsFaceMemberPaperPage',params).then(res=>{
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
      getTaskInfo(){
        Request.ajax('getTaskInfoAndProgress',{
          token:this.techLoginInfo.token,
          taskId:this.$route.params.examenId
        }).then(res => {
          if(res && res.state=='success'){
            this.taskInfo = res.data
          }else{
            this.webApi.alert(res.msg||'服务器异常，请稍后重试～')
          }
        })
      },
      getExportExcelUrl(){
        let host = '';
        if(this.envType == '1'){
          host = 'https://apidemo.zbgedu.com'
        }else{
          host = 'https://api.zbgedu.com'
        }
        console.log(host)
        this.urlStr = host+'/api/edu/userAction/examen/exportUserExerciseAllRecord?verTT='+new Date().getTime()+'&token='+this.techLoginInfo.token+'&classId='+this.routeParams.classId+'&examId='+this.routeParams.examenId+'&pageSize=1000&pageNum=1'
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
        console.log(this.selectStudent)
        if(this.selectStudent.length == 0){
          this.webApi.alert('请至少选中一个学生～')
          return
        }
        let receiveIdsArr = [];
        this.selectStudent.forEach(item => {
          receiveIdsArr.push(item.memberId);
        });
        this.receiveIds = receiveIdsArr.join(",");
        this.message = `同学您好！您的"${this.$route.params.className}"的"${this.taskInfo.taskName}"任务尚未完成！请尽快完成哦！`
        this.dialogVisible = true
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
    }
  }
</script>

<style lang="stylus">
  @import "~@/assets/css/reset.styl"
  #app
    width 100%
    height 100%
    min-width 768px
    .faceCompletion-wrap
      width 100%
      height 100%
      .el-container
        height 100%
        .el-main
          background #f7f7f7
          padding 0
          .faceCompletion-content
            height 100%
            width 1200px
            margin 0 auto
            overflow: hidden
            font-size 14px
            color #666
            display flex
            flex-direction column
            .youboCompletion-title{
              font-size 14px
              color #666
              height 50px;
              line-height: 50px;
              .goBack{
                cursor pointer
              }
              .export-btn{
                float: right
                display inline-block
                width 93px
                height 25px
                line-height 25px
                margin-top 12px
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
              overflow-y auto
              flex-direction column
              border-radius 4px
              background #fff
              padding 0 25px
              margin-bottom: 20px;
              .name-wrap{
                height 70px
                line-height 70px
                font-size 14px
                border-radius 10px
                background #fff
              }
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
                min-height 28px
                .fw-left{
                  flex 1
                  .mr20{
                    margin-right: 20px
                  }
                }
                .fw-right{
                  width 560px
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
                display flex
                flex-direction column
                .table-content{
                  flex 1
                  .el-table{
                    border 1px solid #eee
                    border-bottom none
                    .button-b{
                      cursor pointer
                    }
                  }
                  .pagination-wrap{
                    text-align center
                    margin-top 10px
                  }
                }
                .table-bottom{
                  height 60px
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
      .el-dialog
        .el-dialog__body
          .replay-content
            width 100%
            min-height 160px
            padding: 5px;
            box-sizing: border-box;
          .replay-content:focus
            outline none
        .el-dialog__footer
          text-align right
    .f
      width 0
</style>
