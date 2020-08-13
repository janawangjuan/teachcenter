<template>
  <div id="app" class="app">
    <div class="faceTestpaperAnalysis-wrap">
      <el-container>
        <el-header>
          <iHeader></iHeader>
        </el-header>
        <el-main>
          <div class="testpaperAnalysis-content">
            <div class="title-wrap">
              <div class="title-left">当前位置：{{this.$route.params.className}}&gt;卷面分析</div>
              <div class="title-right">
                <a @click="exportExcel" class="button-a">导出表格</a>
              </div>
            </div>
            <div v-if="examInfo">
              <div class="name-wrap">
                <span class="name-content">测评名称：{{examInfo.taskName}}</span>
                <span class="span1">题目数量：共{{examInfo.questionNum}}题</span>
                <span class="span1">测评时间：{{examInfo.requireTime}}分钟</span>
              </div>
              <div class="table-wrap">
                <div class="table-content">
                  <el-table
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
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
              </div>
            </div>
            <div v-else>
              <iLoading></iLoading>
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
  import {mapState} from 'vuex'
  export default {
    name: "faceTestpaperAnalysis",
    components:{
      iHeader,
      iLoading,
      examSource
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
        studentName:'',
        allChecked:false,
        dialogVisible:false,
        examInfo:'',
        examParams:'',
        urlStr:'',
        envType:parseInt(this.cookie.get('envType')),
        routeParams:this.$route.params,
        tableData:[],
        showExamSource:false
      }
    },
    mounted(){
      this.getTestList()
      this.getTaskInfo()
      //this.getExportExcelUrl()
    },
    methods:{
      handleIconClick(){
        console.log('111')
      },
      exportExcel(){
        this.webApi.postExcelFile({
          token:this.techLoginInfo.token,
          classId: this.$route.params.classId,
          taskId:this.$route.params.examenId
        },(this.envType=='1'?'https://apidemo.zbgedu.com':'https://zbapi.zbgedu.com')+'/api/study/userAction/statistics/faceCoursePaper/exportStatisticsFaceQuestion')
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
      handleSelectionChange(val){
        //console.log(val)
      },
      closeExamPop(){
        this.showExamSource = false
      },
      getTaskInfo(){
        console.log(this.$route.params)
        Request.ajax('getTaskInfoAndProgress',{
          token:this.techLoginInfo.token,
          taskId:this.$route.params.examenId
        }).then(res => {
          if(res && res.state=='success'){
            this.examInfo = res.data
            console.log(this.examInfo)
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
      getTestList(){
        Request.ajax('getFaceStatisticsQuestionPageByTask',{
          token:this.techLoginInfo.token,
          classId:this.$route.params.classId,
          taskId:this.$route.params.examenId,
          pageSize:1000,
          pageNum: 1
        }).then(res=>{
          if(res && res.state=='success'){
            //this.examInfo = res.data
            this.tableData = res.data.result
          }else{
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
  @import "~@/assets/css/reset.styl"
  #app
    width 100%
    height 100%
    min-width 768px
    .faceTestpaperAnalysis-wrap
      width 100%
      height 100%
      .el-container
        height 100%
        .el-main
          background #f7f7f7
          padding 0
          .testpaperAnalysis-content
            width 1200px
            margin 0 auto
            height 100%
            display flex
            flex-direction column
            .title-wrap
              height 50px
              .title-left
                float left
                padding-left 5px
                color #ff366d
                font-size 14px
                line-height 50px
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
              margin-bottom 20px
              display flex
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
                padding 30px 15px
                flex 1
                overflow: hidden;
                display flex
                flex-direction column
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
    .f
      width 0
</style>

