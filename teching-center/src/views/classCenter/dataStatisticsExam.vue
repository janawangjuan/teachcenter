<template>
  <div class="practiceStatistics-wrap">
    <div class="dataStatisticsExam-wrap-s">
      <classCenterHeader style="overflow: unset" :classId="$route.params.classId" @returnDetailInfo="returnDetailInfo"></classCenterHeader>
      <div class="content">
        <div class="content-title">
          <span class="title-p">作业数据统计</span>
          <!--<div class="title-left">
            <i class="select-exam-i" @click="showExamListBtn"></i>
            <div class="exam-list-wrap" v-if="showExamList" v-on:mouseleave="hideExamlist">
              <div class="dialog-border"></div>
              <div class="ul-wrap">
                <iScroll :is-refresh="scrollRefresh1">
                  <el-checkbox-group v-model="checkedExam" @change="handleCheckedExamsChange">
                    <ul class="exam-list-ul">
                      <li class="exam-list-li" v-for="(item,index) in weekList">
                        <el-checkbox :label="item.weekIndex" :key="item.weekIndex">{{item.title}}（{{webApi.formatDate(item.startDate,'YMD')}}至{{webApi.formatDate(item.endDate,'YMD')}}）</el-checkbox>
                      </li>
                    </ul>
                  </el-checkbox-group>
                </iScroll>
              </div>
            </div>
          </div>-->
        </div>
        <div class="content-content">
          <div class="content-left">
            <div class="content-left-main">
              <div class="echart-wrap-big" v-if="showEcharts">
                <div class="echart-wrap-title">
                  <div class="title-right">
                    <a href="javascript:;" class="title-a-usual check-echarts-a" @click="changeTableEcharts"><i class="icon-check-echarts"></i>查看表格</a>
                    <a href="javascript:;" @click="exportTable" class="title-a-usual export-table-a">导出表格</a>
                  </div>
                </div>
                <div class="echart-wrap">
                  <p class="name-p">完成情况示例图</p>
                  <div id="completionEchart" class="completionEchart"></div>
                </div>
              </div>
              <div class="table-wrap-big" v-if="!showEcharts">
                <div class="table-wrap-title">
                  <div class="title-left">
                    <el-select v-model="examType" @change="changeType" placeholder="请选择">
                      <el-option
                        v-for="item in typeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-select v-model="status" @change="changeStatus" placeholder="请选择">
                      <el-option
                        v-for="item in statusList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="title-right">
                    <a href="javascript:;" class="title-a-usual check-echarts-a" @click="changeTableEcharts"><i class="icon-check-echarts"></i>查看图表</a>
                    <a href="javascript:;" @click="exportTable" class="title-a-usual export-table-a">导出表格</a>
                  </div>
                </div>
                <div class="table-wrap">
                  <el-table
                    ref="multipleTable"
                    :data="tableData"
                    :highlight-current-row="true"
                    @row-click="clickSelectExam"
                    tooltip-effect="dark"
                    style="width: 100%">
                    <el-table-column
                      label="是否提交">
                      <template slot-scope="scope">{{scope.row.isSubmit == '1'?'已提交':'未提交'}}</template>
                    </el-table-column>
                    <el-table-column
                      :show-overflow-tooltip="true"
                      label="作业名称">
                      <template slot-scope="scope">
                        <i :class="['table-usual-icon',scope.row.taskLevel+'-icon']"></i>{{scope.row.taskName}}
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="isFinishName"
                      label="完成情况（完成/未完成/未学习）">
                      <template slot-scope="scope">{{scope.row.finishedNum+'/'+scope.row.unfinishedNum+'/'+scope.row.notstartNum}}</template>
                    </el-table-column>
                    <el-table-column
                      prop="avgScore"
                      width="150"
                      label="平均分">
                      <template slot-scope="scope">{{scope.row.avgScore == '-1'?'--':scope.row.avgScore}}</template>
                    </el-table-column>
                    <el-table-column
                      prop="trueRate"
                      width="150"
                      label="正确率">
                      <template slot-scope="scope">{{scope.row.trueRate == '-1'?'--':(scope.row.trueRate+'%')}}</template>
                    </el-table-column>
                    <el-table-column
                      width="240"
                      label="操作">
                      <template slot-scope="scope">
                        <a href="javascript:;" class="mr20 table-a" @click="checkExamSource(scope.row)" style="color:#ff366d">预览</a>
                        <a href="javascript:;" class="mr20 table-a" @click="toTestpaper(scope.row)">卷面分析</a>
                        <a href="javascript:;" class="table-a" @click="toCompletion(scope.row)">完成情况</a>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </div>
          <div class="content-right" v-if="!showEcharts">
            <div class="content-right-content">
              <template v-if="currentExam">
                <template v-if="rankList">
                  <div class="content-right-title">
                    {{currentExam.taskName}}
                    <!--<div class="title-left"><i class="icon-zhuangyuan"></i>状元榜</div>
                    <div class="title-right">仅限于本次测评</div>-->
                  </div>
                  <div class="content-right-main">
                    <ul class="rank-ul">
                      <li class="rank-li" v-for="(item,index) in rankList">
                        <div class="left">
                          <div class="avater-wrap">
                            <img class="avater-img" :src="'http://eximg.zbgedu.com'+item.memberAvatar" alt="default">
                          </div>
                          {{item.name}}
                        </div>
                        <div class="right">
                          <template v-if="index>2">{{index+1}}</template>
                          <template v-else>
                            <div class="jiangbei" :class="[{first:index==0},{second:index==1},{third:index==2}]"></div>
                          </template>
                        </div>
                      </li>
                    </ul>
                    <!--<iScroll :is-refresh="scrollRefresh">
                      <ul class="rank-ul">
                        <li class="rank-li" v-for="(item,index) in rankList">
                          <div class="left">
                            <div class="avater-wrap">
                              <img class="avater-img" :src="'http://eximg.zbgedu.com'+item.memberAvatar" alt="default">
                            </div>
                            {{item.name}}
                          </div>
                          <div class="right">
                            <template v-if="index>2">{{index+1}}</template>
                            <template v-else>
                              <div class="jiangbei" :class="[{first:index==0},{second:index==1},{third:index==2}]"></div>
                            </template>
                          </div>
                        </li>
                      </ul>
                    </iScroll>-->
                  </div>
                  <div class="student-num-wrap">共{{rankData.totalCount}}位学员，还有{{rankData.unansweredCount}}位学员未开启学习进程！</div>
                </template>
                <template v-else>
                  <div class="loading-wrap">
                    <iLoading></iLoading>
                  </div>
                </template>
              </template>
              <template v-else>
                <div class="no-data">暂无数据</div></template>
            </div>
          </div>
        </div>
      </div>
      <examSource @closeExam="closeExamPop" v-if="showExamSource" :examParams="examParams"></examSource>
      <selectWeek v-if="showSelectWeek" @confirmSelectWeek="confirmSelectWeek" @cancelSelectWeek="cancelSelectWeek" :weekList="weekList"></selectWeek>
    </div>
  </div>
</template>

<script>
  import iScroll from '@/components/i-scroll'
  import examSource from '@/components/examSource'
  import selectWeek from '@/components/selectWeek'
  import classCenterHeader from '@/components/classCenterHeader'
  import echarts from 'echarts'
  import iLoading from '@/components/i-loading'
  import Request from '../../request'
  import {mapMutations,mapState} from 'vuex'
  export default {
    name: "practiceStatistics",
    components:{
      iScroll,
      examSource,
      selectWeek,
      classCenterHeader,
      iLoading
    },
    mounted(){
      //this.getWeekList()
      //this.getEchartData()
      //this.drawPie()
      //this.getRankData()
      //this.getCourseDeatil()
      this.getExamenTaskList()
    },
    computed: {
      ...mapState({
        envType:state => state.global.envType,
      }),
      techLoginInfo() {
        return JSON.parse(this.cookie.get('techLoginInfo'))
      },
    },
    data(){
      return{
        showEcharts:false,
        showExamList:false,
        scrollRefresh:false,
        scrollRefresh1:false,
        str:'',
        showSelectWeek:false,
        xData:[],
        ySeris:[],
        legendData:[],
        examParams:'',
        showExamSource:false,
        examData:'',
        checkedExam:[],
        rankData:'',
        status:'',
        weekList:'',
        selectWeekList:'',
        classCourseInfo:'',
        examList:[],
        tableData:[],
        statusList:[{label:'全部状态',value:''},{label:'未提交',value:'0'},{label:'已提交',value:'1'}],   //可选的测评s
        typeList:[{label:'全部类型',value:''},{label:'测评试卷',value:'appraisal'},{label:'练习试卷',value:'practice'}],   //可选的测评s
        examType:'',
        rankList:'',
        currentExam:'',
      }
    },
    methods:{
      ...mapMutations('classManage',[
        'updateSelectExam'
      ]),
      exportTable(){   //导出表格数据
        this.webApi.postExcelFile({
          token:this.techLoginInfo.token,
          classId: this.$route.params.classId,
          taskLevel:'',
          isSubmit:this.status,
        },(this.envType=='1'?'https://apidemo.zbgedu.com':'https://zbapi.zbgedu.com')+'/api/study/userAction/statistics/faceCoursePaper/exportStatisticsFaceCoursePaper')
        /*Request.ajax('exportStatisticsCoursePaper',{
          token:this.techLoginInfo.token,
          classId: this.$route.params.classId,
          courseId: this.classCourseInfo.courseId,
          courseTeachingType:'flipped',
          studyPlanExtendIndexList:this.checkedExam.join(','),
          taskLevel:'',
          isSubmit:'',
        }).then((res)=>{
          if(res && res.state == 'success'){

          }else{
            this.webApi.alert('服务器异常，请重试～')
          }
        })*/
      },
      returnDetailInfo(params){
        this.classCourseInfo = params
      },
      showExamListBtn(){
        this.showExamList = true
        setTimeout(() => {
          this.scrollRefresh1 =!this.scrollRefresh1
        },500)
      },
      confirmSelectWeek(params){   //确认导出
        console.log(params)
        if(params.indexOf('all')>-1){
          params = []
        }
        this.webApi.postExcelFile({
          token:this.techLoginInfo.token,
          classId: this.$route.params.classId,
          courseId: this.classCourseInfo.courseId,
          courseTeachingType:'flipped',
          studyPlanExtendIndexList:params.join(','),
          taskLevel:'',
          isSubmit:this.status,
        },(this.envType=='1'?'https://apidemo.zbgedu.com':'https://zbapi.zbgedu.com')+'/api/study/userAction/statistics/exportStatisticsCoursePaper')
        this.showSelectWeek = false
      },
      cancelSelectWeek(){
        this.showSelectWeek = false
      },
      checkExamSource(params){
        let times = new Date().getTime() + 30 * 60 * 1000;
        let date = new Date(times);
        let local = window.location;
        let hostname = local.hostname;
        if (/\.zbgedu\.com/.test(hostname)) {
          hostname = 'zbgedu.com'
        }
        //document.cookie = "zbgeduId=" + this.techLoginInfo.token + ";path=/;domain="+hostname+";expires="+ date.toGMTString() + ";source=source;";
        this.cookie.remove('zbgeduId')
        let str = 'mstiku'
        if(this.envType == '1'){
          str = 'mstikudemo'
        }
        //this.frameUrl = 'https://'+str+'.zbgedu.com/preview?question=getAnswerAnalysis&type=acca&value='+this.examenInfo.taskId+ '&id=' + this.techLoginInfo.token+'agent=0';

        Request.ajax('getTaskInfoAndProgress',{
          token:this.techLoginInfo.token,
          taskId:params.taskId
        }).then(res=>{
          if(res.state == 'success'){
            this.frameUrl = 'https://'+str+'.zbgedu.com/preview?question=paperInfoPreview&type='+(res.data.itemId==1?'acca':'cma')+'&value='+res.data.examenId+ '&id=' + this.techLoginInfo.token+'&agent=0';
            window.open(this.frameUrl)
          }else{
            this.$api.alert('服务器异常，请重试~')
          }
        })
        /*this.showExamSource = true
        this.examParams = params*/
      },
      closeExamPop(){
        this.showExamSource = false
      },
      hideExamlist(){
        this.showExamList = false
      },
      handleCheckedExamsChange(){
        this.xData = []
        this.ySeris = []
        this.legendData = []
        if(this.showEcharts){
          this.getEchartData()
        }else{
          this.getExamenTaskList()
        }
      },
      changeStatus(params){
        this.status=params
        this.getExamenTaskList()
      },
      changeType(params){
        this.examType = params
        this.getExamenTaskList()
      },
      clickSelectExam(row, column, event){
        this.currentExam = row
        this.getRankData(row.taskId)
      },
      changeTableEcharts(){   //查看图表或者表格
        this.showEcharts = !this.showEcharts
        if(this.showEcharts){
          setTimeout(()=>{
            this.getEchartData()
          },100)
        }else{
          this.getExamenTaskList()
        }
      },
      toTestpaper(params){  //去卷面分析页
        this.updateSelectExam({
          selectExam:params
        })
        window.open('/#/faceTestpaperAnalysis/'+this.$route.params.classId+'/'+params.taskId+'/'+this.classCourseInfo.courseplanName,'_blank')
        //this.$router.push(this.$route.path+'/youboTestpaperAnalysis/'+params.taskId)
      },
      toCompletion(params){  //去完成情况
        this.updateSelectExam({
          selectExam:params
        })
        window.open('/#/faceCompletion/'+this.$route.params.classId+'/'+params.taskId+'/'+this.classCourseInfo.courseplanName,'_blank')
      },
      getEchartData(){
        this.xData = []
        this.ySeris = []
        this.legendData = []
        Request.ajax('getStatisticsFaceCoursePaperByChart',{
          token:this.techLoginInfo.token,
          classId: this.$route.params.classId
        }).then((res)=>{
          if(res && res.state == 'success'){
            if(res.data){
              for(let i = 0;i<res.data.studentList.length;i++){
                this.xData.push(res.data.studentList[i].name||'无姓名')
              }
              for(let i = 0;i<res.data.examList.length;i++){
                let obj = {
                  name:(i+1)+'.'+res.data.examList[i].name,
                  type:'line',
                  data:res.data.examList[i].data,
                  id:res.data.examList[i].weekIndex+'/'+i
                }
                this.ySeris.push(obj)
                this.legendData.push((i+1)+'.'+res.data.examList[i].name)

              }
            }

            this.drawPie()
          }else{
            this.webApi.alert('服务器异常，请重试～')
          }

        })
      },
      getRankData(params){
        this.rankList = ''
        Request.ajax('getFaceStatisticsCoursePaperByLeader',{
          token:this.techLoginInfo.token,
          classId:this.$route.params.classId,
          taskId:params,
        }).then((res)=>{
          if(res && res.state == 'success'){
            this.rankData = res.data
            this.rankList = res.data.memberList
            this.scrollRefresh = !this.scrollRefresh
          }else{
            this.webApi.alert('服务器异常，请重试～')
          }

        })
      },
      getExamenTaskList(){  //获取表格统计数据
        Request.ajax('getStatisticsFaceCoursePaperList',{
          token:this.techLoginInfo.token,
          classId:this.$route.params.classId,
          taskLevel:this.examType,
          isSubmit:this.status
        }).then((res)=>{
          if(res && res.state == 'success'){
            this.tableData = res.data
            if(this.tableData.length>0){
              this.$refs.multipleTable.setCurrentRow(this.tableData[0])
              this.currentExam = this.tableData[0]
              this.getRankData(this.tableData[0].taskId)
            }else{
              this.currentExam = ''
            }
          }else{
            this.webApi.alert('服务器异常，请重试～')
          }

        })
      },
      getWeekList(){
        Request.ajax('getStatisticsFaceCoursePaperList',{
          token:this.techLoginInfo.token,
          classId:this.$route.params.classId,
        }).then((res)=>{
          if(res && res.state == 'success'){
            if(res.data.length>0){
              res.data = res.data.sort(this.$api.compare('weekIndex'))
            }
            this.weekList = res.data
            this.weekList.forEach((item,index) => {
              item.selectWeekId = item.weekIndex   //给导出表格时选择周传数据
              this.checkedExam.push(index+1)    //默认选中全部
            })
            if(res.data.length>0){
              this.getExamenTaskList()
            }

          }else{
            this.webApi.alert('服务器异常，请重试～')
          }

        })
      },
      drawPie(){
        const this_ = this;
        this.chartPie = echarts.init(document.getElementById('completionEchart'));
        this.chartPie.setOption({
          tooltip: {
            formatter: function(params, ticket, callback) {
              return params.seriesId.split('/')[0]+' '+params.seriesName +' '+ params.name+' '+'正确率'+params.value+'%'+' 当前排名'+params.data.rank;
            },
            position: function (point, params, dom, rect, size) {
              // 固定在顶部
              return [point[0], point[1]];
            }
          },
          legend: {
            data:this.legendData
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
          },
          toolbox: {
            feature: {
              //saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            name:'姓名',
            data: this.xData
          },
          yAxis: {
            name:'正确率',
            type: 'value'
          },
          dataZoom: [
            {
              type: 'slider',
              start: 0,
              end: 50,
            }
          ],
          series: this.ySeris
        })
      }
    },

  }
</script>

<style lang="stylus">
  .practiceStatistics-wrap
    width 100%
    height 100%
    background: #f9fafb;
    .dataStatisticsExam-wrap-s
      padding 20px
      height 100%
      display flex
      overflow hidden
      flex-direction column
    .content
      width 100%
      flex 1
      display flex
      overflow hidden
      flex-direction column
      .content-title
        height 55px
        .title-p
          display inline-block
          line-height 55px
          font-size 18px
          color #333333
          font-weight bold
        .title-left
          display inline-block
          font-size 14px
          color #333
          position relative
          top 10px
          .select-exam-i
            display inline-block
            width 30px
            height 30px
            float left
            margin-right 6px
            background url("../../assets/img/icon_image.png") no-repeat -638px -96px
            cursor pointer
          .exam-list-wrap
            position absolute
            top 30px
            left 0px
            width 340px
            height 240px
            padding-top 10px
            z-index 10
            .dialog-border
              position absolute
            .dialog-border::before
              content: '';
              position: absolute;
              top: -7px;
              left: 6px;
              border-left: 8px solid transparent;
              border-right: 8px solid transparent;
              border-bottom: 8px solid #e9e9e9;
            .dialog-border::after
              content: '';
              position: absolute;
              top: -6px;
              left: 6px;
              border-left: 8px solid transparent;
              border-right: 8px solid transparent;
              border-bottom: 8px solid #fff;
            .ul-wrap
              background #fff
              height 100%
              border 1px solid #e9e9e9
              box-sizing border-box
              overflow hidden
              .exam-list-ul
                .exam-list-li
                  height 30px
                  line-height: 30px;
                  padding 0 20px
      .content-content
        flex 1
        display flex
        overflow: hidden
        .content-left
          flex 1
          overflow-y: auto
          background #fff
          border-radius 4px
          padding 0 25px 20px
          .content-left-main
            height 100%
          .echart-wrap-big
            .echart-wrap-title
              height 80px
              .title-right
                float: right
                margin-top 33px
                .title-a-usual
                  display inline-block
                  height 25px
                  line-height 25px
                  width 95px
                  font-size 14px
                  color #ff366d
                .check-echarts-a
                  .icon-check-echarts
                    display inline-block
                    margin 5px 5px 0 7px
                    width 16px
                    height 16px
                    float: left
                    background url("../../assets/img/icon_image.png") no-repeat -684px -128px
                .export-table-a
                  background #FFD4E0
                  text-align center
                  border-radius 13px
            .echart-wrap
              .name-p
                height 40px
                line-height 40px
                text-align center
                font-size 18px
                color #333
              .completionEchart
                margin-top 10px
                width 100%
                height 400px
          .table-wrap-big
            height: 100%;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            .table-wrap-title
              height 80px
              .title-left
                float: left
                margin-top 30px
                .el-input__inner
                  height 30px
                  border-radius 0
                  border-color #eee
                  line-height 30px
                  font-size 12px
                .el-input__icon
                  line-height 28px
              .title-right
                float: right
                margin-top 33px
                .title-a-usual
                  display inline-block
                  height 25px
                  line-height 25px
                  width 95px
                  font-size 14px
                  color #ff366d
                .check-echarts-a
                  .icon-check-echarts
                    display inline-block
                    margin 5px 5px 0 7px
                    width 16px
                    height 16px
                    float: left
                    background url("../../assets/img/icon_image.png") no-repeat -683px -96px
                .export-table-a
                  background #FFD4E0
                  text-align center
                  border-radius 13px
            .table-wrap
              flex: 1;
              overflow: hidden;
              .el-table
                flex 1
                overflow: auto;
                max-height: 100%
                .el-table__body tr:hover>td
                  background #eee!important
                .el-table__body tr.current-row>td
                  background #ffebf0!important;
                .el-table__header
                  th.is-leaf
                    background #f7f7f7
                    border none
                    text-align center
                  .el-table-column--selection
                    .el-checkbox
                      display none
                .el-table__body
                  tr:nth-of-type(2n)
                    background-color: #f7f7f7;
                  td
                    border none
                    text-align center
                  .table-a
                    color #ff366d
                  .mr20
                    margin-right 20px
                .table-usual-icon
                  display inline-block
                  width 24px
                  height 13px
                  margin-right 10px
                  position relative
                  top 1px
                .practice-icon
                  background url("../../assets/img/icon_image.png") no-repeat -582px -365px
                .appraisal-icon
                  background url("../../assets/img/icon_image.png") no-repeat -582px -328px
        .loading-wrap
          margin-top 40px
        .content-right
          width 320px
          background #fff
          height 100%
          margin-left 10px
          border-radius 4px
          .no-data
            text-align center
            margin-top 40px
          .content-right-content
            display flex
            height 100%
            padding-bottom 40px
            flex-direction column
            position relative
            .student-num-wrap
              position: absolute;
              bottom: 0px;
              padding-left 12px
              height 38px
              width 320px;
              box-shadow:0px 0px 10px 0px rgba(0, 0, 0, 0.05);
              line-height 38px
              color:#333;
              font-size 12px
            .content-right-title
              height 70px
              font-size 14px
              color #333
              font-weight bold
              line-height 70px
              padding 0 20px
              white-space nowrap
              text-overflow ellipsis
              overflow: hidden
              .title-left
                float left
                font-weight bold
                .icon-zhuangyuan
                  display inline-block
                  width 16px
                  height 16px
                  margin 27px 7px 0 27px
                  background url("../../assets/img/icon_image.png") no-repeat -638px -143px
                  float left
              .title-right
                float right
                height 70px
                margin-right 28px
            .content-right-main
              flex 1
              overflow auto
              .rank-ul
                padding-bottom 20px
                .rank-li
                  height 45px
                  line-height 45px
                  .left
                    float left
                    font-size 14px
                    color #666
                    .avater-wrap
                      float left
                      margin-left 25px
                      margin-right 10px
                      margin-top 6px
                      height 32px
                      border-radius: 50%;
                      overflow: hidden;
                      .avater-img
                        width 32px
                        height 32px
                  .right
                    float right
                    width 30px
                    font-size 14px
                    font-weight bold
                    margin-right 20px
                    height 45px
                    text-align center
                    color #666
                    .jiangbei
                      width 20px
                      height 24px
                      margin-left 5px
                      margin-top 10px
                    .first
                      background url("../../assets/img/icon_image.png") no-repeat -638px -231px
                    .second
                      background url("../../assets/img/icon_image.png") no-repeat -638px -200px
                    .third
                      background url("../../assets/img/icon_image.png") no-repeat -638px -167px
</style>
