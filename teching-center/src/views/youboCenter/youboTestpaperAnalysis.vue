<template>
  <div class="youboTestpaperAnalysis-wrap">
    <div class="testpaperAnalysis-content">
      <div class="title-wrap">
        <div class="title-left">当前位置：数据统计><span class="goBack" @click="goBack">作业数据统计</span>>卷面分析</div>
        <div class="title-right">
          <a  @click="exportTable" class="button-a">导出表格</a>
        </div>
      </div>
      <div class="examInfoWrap" v-if="examInfo">
        <div class="name-wrap">
          <span class="name-content">测评名称：{{taskInfo.taskName}}</span>
          <span class="span1">题目数量：共{{taskInfo.questionNum}}题</span>
          <span class="span1">测评时间：{{taskInfo.requireTime}}分钟</span>
        </div>
        <div class="table-wrap">
          <div class="table-content">
            <el-table
              ref="multipleTable"
              :data="tableData"
              v-loading="loading"
              tooltip-effect="dark"
              height="100%"
              style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column
                type="index"
                label="序号">
              </el-table-column>
              <el-table-column
                prop="questionSn"
                label="题目编号">
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                label="题目标题">
                <template slot-scope="scope">
                  <div style="height: 22px;cursor: pointer;color:#ff366d" @click="cheakExam(scope.row)" v-html="scope.row.questionTitle"></div>
                </template>
              </el-table-column>
              <el-table-column
                label="完成情况">
                <template slot-scope="scope">{{ scope.row.finishedNum }}/{{ scope.row.totalNum }}人数</template>
              </el-table-column>
              <el-table-column
                label="完成率">
                <template slot-scope="scope">{{ scope.row.finishedRate }}%</template>
              </el-table-column>
              <el-table-column
                label="答错/答对人数">
                <template slot-scope="scope">{{ scope.row.falseNum }}/{{ scope.row.trueNum }}人数</template>
              </el-table-column>
              <el-table-column
                label="正确率">
                <template slot-scope="scope">{{ scope.row.trueRate }}%</template>
              </el-table-column>
            </el-table>
          </div>
          <div class="pagination-wrap"><el-pagination
            background
            layout="prev, pager, next,sizes,total"
            @current-change="sizeChange"
            @size-change="handleSizeChange"
            @prev-click="prevSize"
            @next-click="nextSize"
            :current-page = "currentPage"
            :pageSize="pageSize"
            :total="totalRecord">
          </el-pagination></div>
        </div>
      </div>
      <div v-else>
        <iLoading></iLoading>
      </div>
      <examSource @closeExam="closeExamPop" v-if="showExamSource" :examParams="examParams"></examSource>
    </div>
  </div>

</template>

<script>
  import iHeader from "@/components/i-header"
  import iLoading from '@/components/i-loading'
  import iScroll from '@/components/i-scroll'
  import examSource from '@/components/examSource'
  import Request from '../../request'
  import {mapState} from 'vuex'
  export default {
    name: "youboTestpaperAnalysis",
    components:{
      iHeader,
      iLoading,
      examSource,
      iScroll
    },
    computed:{
      ...mapState({
        examInfo:state => state.classManage.selectExam,
      }),
      techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))}
    },
    data(){
      return {
        className:'',
        studentName:'',
        allChecked:false,
        dialogVisible:false,
        scrollRefresh:false,
        examParams:'',
        taskInfo:'',
        urlStr:'',
        loading:false,
        totalRecord:0,
        currentPage:1,
        pageSize:20,
        classCourseInfo:'',
        envType:parseInt(this.cookie.get('envType')),
        routeParams:this.$route.params,
        tableData:[],
        showExamSource:false
      }
    },
    mounted(){
      this.getTaskInfo()
      this.getClassDetail()
      this.getExportExcelUrl()
    },
    methods:{
      handleIconClick(){
        console.log('111')
      },
      goBack(){
        this.$router.back(-1)
      },
      exportTable(){
        this.webApi.postExcelFile({
          token:this.techLoginInfo.token,
          classId: this.$route.params.classId,
          courseId: this.classCourseInfo.courseId,
          taskId:this.taskInfo.taskId,
          orderByClause:'',
        },(this.envType=='1'?'https://apidemo.zbgedu.com':'https://zbapi.zbgedu.com')+'/api/study/userAction/statistics/exportStatisticsQuestion')
      },
      cheakExam(params){
        console.log('11111')
        this.examParams = params
        this.showExamSource = true
        /*let str = 'elearning'
        if(this.envType == '1'){
          str = 'elearningdemo'
        }
        window.open('http://'+str+'.zbgedu.com/#showAnswer?exerciseIds='+params.exerciseId+'&showType=2')*/
      },
      sizeChange(val){
        this.currentPage = val
        this.getTestList()
      },
      handleSizeChange(params){
        this.currentPage = 1
        this.pageSize = params
        this.getTestList()
      },
      prevSize(){
        this.currentPage--
        this.getTestList()
      },
      nextSize(){
        this.currentPage++
        this.getTestList()
      },
      handleSelectionChange(val){
        //console.log(val)
      },
      closeExamPop(){
        this.showExamSource = false
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
      getClassDetail(){
        Request.ajax('getClassInfo',{
          token:this.techLoginInfo.token,   //
          classId:this.$route.params.classId
        }).then((res)=>{
          if(res && res.state=='success'){
            console.log(res)
            this.classCourseInfo = res.data
            this.getTestList()
            //this.searchCourseAppraisalTaskBySubjectId()
          }else{
            this.classCourseInfo = {}
            this.webApi.alert(res.msg||'服务器异常，请稍后重试～')
          }
        })
      },
      getTestList(){
        this.loading = true
        Request.ajax('getStatisticsQuestionPageByTask',{
          token:this.techLoginInfo.token,
          classId:this.$route.params.classId,
          courseId:this.classCourseInfo.courseId,
          taskId:this.$route.params.examId,
          orderByClause:'',
          pageSize:this.pageSize,
          pageIndex: this.currentPage
        }).then(res=>{
          if(res && res.state=='success'){
            //this.examInfo = res.data
            this.loading = false
            this.tableData = res.data.result
            this.totalRecord = res.data.total
            this.scrollRefresh = !this.scrollRefresh

          }else{
            //this.examInfo = {}
            this.loading = false
            this.webApi.alert(res.msg||'服务器异常，请稍后重试～')
          }
        })
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
        this.dialogVisible = true
      },
      replay(){

      }
    }
  }
</script>

<style lang="stylus">
    .youboTestpaperAnalysis-wrap
      width 100%
      height 100%
      .testpaperAnalysis-content
        width 100%
        height 100%
        display flex
        flex-direction column
        .title-wrap
          height 50px
          .title-left
            float left
            padding-left 5px
            font-size 14px
            line-height 50px
            .goBack{
              cursor pointer
            }
          .title-right
            float right
            width 100px
            margin-right 10px
            .button-a
              width 100px
              height 25px
              background #FFD4E0
              margin-top 12px
              line-height 25px
              color #ff366d
              cursor pointer
              font-size 14px
              border-radius 13px
              border none
              text-align center
            .button-a:focus
              outline none
        .examInfoWrap
          flex 1
          display flex
          overflow hidden
          flex-direction column
        .name-wrap
          height 70px
          line-height 70px
          font-size 14px
          border-radius 10px
          background #fff
          .name-content
            color #333
            font-size 16px
            margin-right 20px
            margin-left 30px
          .span1
            color #666
            margin-right 30px
          .span2
            color #999
        .table-wrap
          background #fff
          border-radius 10px
          margin-top 10px
          flex 1
          display flex
          margin-bottom 20px
          padding: 30px 15px
          overflow hidden
          flex-direction column
          .table-title-wrap
            height 50px
            .el-input
              width 360px
              height 28px
              margin: 10px 0 0 15px;
              .el-input__inner
                height 28px
                line-height 28px
                border-radius: 14px;
              .el-input__suffix
                top -6px
              .el-input__suffix-inner
                cursor pointer
          .table-content
            width 100%
            overflow: hidden;
            height 100%
            .el-table
              flex 1
              overflow: auto;
              max-height: 100%
              .el-table__header
                th.is-leaf
                  background #f7f7f7
                  border none
                  text-align center
                  .cell
                    font-size 14px
                    font-weight normal
                .el-table-column--selection
                  .el-checkbox
                    display none
              .el-table__body
                tr:nth-of-type(2n)
                  background-color: #f7f7f7;
                td
                  border none
                  text-align center
                  .cell
                    font-size 12px
            .opreating-wrap
              padding 20px
              .send-msg
                display:inline-block;
                width:88px;
                height:26px;
                text-align:center;
                line-height:26px;
                border-radius 13px
                background #FFD4E0
                color:#ff366d;
                font-size:14px;
                cursor:pointer;
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
    .pagination-wrap
      text-align center
      margin-top 20px
    .f
      width 0
</style>

