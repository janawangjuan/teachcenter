<template>
  <div class="taskStatistics-wrap">
    <div class="taskStatistics-title-wrap">
      <div class="title-name">学习任务数据统计</div>
      <div class="changeWeek-wrap">
        <el-select v-model="selectWeek" @change="changeWeek" placeholder="请选择">
          <el-option
            v-for="item in weekList"
            :key="item.studyPlanExtendId"
            :label="item.title+'（'+(webApi.formatDate(item.startDate,'YMD'))+'至'+webApi.formatDate(item.endDate,'YMD')+'）'"
            :value="item.studyPlanExtendId">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="taskStatistics-content">
      <div class="video-task-wrap">
        <div id="videoTaskPie" class="videoTaskPie"></div>
      </div>
      <div class="student-task-wrap">
        <div class="student-tast-title">
          学生任务完成情况统计图表
          <div class="title-right">
            <el-input :placeholder="'请输入'+(selectNameType=='1'?'用户名':'姓名')" v-model="searchText" class="input-with-select">
              <el-select v-model="selectNameType" slot="prepend" placeholder="请选择姓名/用户名">
                <el-option label="用户名" value="1"></el-option>
                <el-option label="姓名" value="2"></el-option>
              </el-select>
              <el-button slot="append" @click="search" icon="el-icon-search"></el-button>
            </el-input>
            <span class="export-btn" @click="exportTable">导出表格</span>
          </div>
        </div>
        <div class="table-wrap">
          <el-table
            ref="multipleTable"
            stripe
            max-height="800"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
          >
            <el-table-column
              prop="memberNickname"
              fixed
              width="120"
              label="用户名">
            </el-table-column>
            <el-table-column
              prop="memberName"
              fixed
              label="姓名">
            </el-table-column>
            <template v-if="tableData&&tableData.length>0">
              <el-table-column
                v-for="(item,index) in tableData[0].taskList"
                :key="index"
                width="130"
                :label="item.taskName.slice(0,6)+'...'">
                <template slot-scope="scope">
                  {{scope.row.taskList[index].value=='-1'?'未开始':(scope.row.taskList[index].taskType=='exam'?(scope.row.taskList[index].value==0?'进行中':(scope.row.taskList[index].value+'%')):(scope.row.taskList[index].value+'%'))}}
                </template>
              </el-table-column>
            </template>
          </el-table>
        </div>
      </div>
      <!--<iScroll  id="taskStatisticsContentScroll" :is-refresh="scrollRefresh">

      </iScroll>-->
    </div>
    <selectWeek v-if="showSelectWeek" @confirmSelectWeek="confirmSelectWeek" @cancelSelectWeek="cancelSelectWeek" :weekList="weekList"></selectWeek>
  </div>
</template>

<script>
  import iScroll from '@/components/i-scroll'
  import echarts from 'echarts'
  import Request from '../../request'
  import {mapState} from 'vuex'
  import selectWeek from '@/components/selectWeek'
  export default {
    name: "taskStatistics",
    props:['classCourseInfo'],
    computed: {
      techLoginInfo() {
        return JSON.parse(this.cookie.get('techLoginInfo'))
      },
      ...mapState({
        envType:state => state.global.envType,
      }),
    },
    components:{
      iScroll,
      selectWeek
    },
    data(){
      return{
        scrollRefresh:false,
        name:'',
        selectWeek:'',
        searchText:'',
        showSelectWeek:false,
        selectNameType:'1',
        tableData:[],
        weekList:[],
        xAxisData:'',
        notStartedList:'',
        goingList:'',
        doneList:'',
      }
    },
    mounted(){
      this.getWeekList()
    },
    methods:{
      exportTable(){
        this.showSelectWeek = true
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
          studyPlanExtendIds:params.join(','),
        },(this.envType=='1'?'https://apidemo.zbgedu.com':'https://zbapi.zbgedu.com')+'/api/study/userAction/statistics/task/exportMemberTaskList')
        this.showSelectWeek = false
      },
      cancelSelectWeek(){
        this.showSelectWeek = false
      },
      kankan(params){
        console.log(params)
      },
      changeWeek(){
        this.getTaskList()
        this.getPieData()
      },
      getWeekList(){
        Request.ajax('queryStudyPlanExtendSelect',{
          token:this.techLoginInfo.token,
          classId:this.$route.params.classId,
        }).then((res)=>{
          if(res && res.state == 'success'){
            if(res.data.length>0){
              res.data = res.data.sort(this.$api.compare('planOrder'))
            }
            this.weekList = res.data
            this.weekList.forEach((item) => {
              item.selectWeekId = item.studyPlanExtendId
            })
            this.selectWeek = this.weekList[0].studyPlanExtendId
            this.getTaskList()
            this.getPieData()
          }else{
            this.webApi.alert('服务器异常，请重试～')
          }

        })
      },
      getPieData(){
        Request.ajax('getMemberTaskStatistics',{
          token:this.techLoginInfo.token,
          classId:this.$route.params.classId,
          courseId:this.classCourseInfo.courseId,
          studyPlanExtendId:this.selectWeek,
        }).then((res)=>{
          if(res && res.state == 'success'){
            this.xAxisData = []
            this.notStartedList = []
            this.goingList = []
            this.doneList = []
            for(let i = 0;i<res.data.length;i++){
              this.xAxisData.push(res.data[i].name)
              this.notStartedList.push(res.data[i].notStarted)
              this.goingList.push(res.data[i].going)
              this.doneList.push(res.data[i].done)
            }
            setTimeout(()=>{
              this.drawPie()
            },200)
          }else{
            this.webApi.alert('服务器异常，请重试～')
          }

        })
      },
      search(){
        this.getTaskList()
      },
      getTaskList(){
        Request.ajax('getMemberTaskList',{
          token:this.techLoginInfo.token,
          classId:this.$route.params.classId,
          courseId:this.classCourseInfo.courseId,
          studyPlanExtendId:this.selectWeek,
          keyword:this.searchText,
          searchType:this.selectNameType,
        }).then(res => {
          if(res.state=='success'){
            this.tableData = res.data
            setTimeout(() => {
              this.scrollRefresh = !this.scrollRefresh
            },1000)

          }else{
            this.webApi.alert('服务器异常，请重试～')
          }
        })
      },
      drawPie(){
        const this_ = this;
        this.chartPie = echarts.init(document.getElementById('videoTaskPie'));
        this.chartPie.setOption({
          title: {
            text: '学生任务完成情况统计图表',
            textAlign:'left'
          },
          tooltip : {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              label: {
                show: true
              }
            }
          },
          toolbox: {
            show : true,
            feature : {
              mark : {show: true},
            }
          },
          calculable : true,
          legend: {
            data:['Growth', '未开始', '进行中','已完成'],
            itemGap: 5
          },
          grid: {
            top: '12%',
            left: '1%',
            right: '10%',
            containLabel: true
          },
          xAxis: [
            {
              type : 'category',
              data : this.xAxisData,
              axisLabel: {
                interval:0,
                rotate:45,
                formatter(value){
                  let str = ''
                  if(value.length>6){
                    str = value.slice(0,6)+'...'
                  }else{
                    str = value
                  }
                  return str
                }
              }
            }
          ],
          yAxis: [
            {
              type : 'value',
              name : '学员人数',
            }
          ],
          dataZoom: [
            {
              show: true,
              start: 0,
              end: 50
            },
          ],
          series : [
            {
              name: '未开始',
              type: 'bar',
              data: this.notStartedList,
              color:'#DB8E92',
              label: {
                show: true,
                position: 'top'
              },
            },
            {
              name: '进行中',
              type: 'bar',
              data: this.goingList,
              color:'#D7DD9A',
              label: {
                show: true,
                position: 'top'
              },
            },
            {
              name: '已完成',
              type: 'bar',
              data: this.doneList,
              color:'#FCE58D',
              label: {
                show: true,
                position: 'top'
              },
            }
          ]
        })
      }
    }
  }
</script>

<style lang="stylus">
  .taskStatistics-wrap
    width 100%
    height 100%
    display flex
    flex-direction column
    .taskStatistics-title-wrap
      height 60px
      line-height 60px
      .title-name
        float: left
        font-size 18px
        color #333333
        font-weight bold
        margin-right 50px
      .changeWeek-wrap
        float: left
        font-weight bold
        font-size 14px
        color #ff366d
        .el-select
          .el-input
            height 30px
            line-height 30px
          .el-input__inner
            height 28px
            line-height 28px
          .el-input__icon
            line-height 28px
    .taskStatistics-content
      flex 1
      overflow auto
      .video-task-wrap
        width 100%
        height 510px
        background #fff
        border-radius 4px
        .videoTaskPie
          width 100%
          height 100%
      .student-task-wrap
        margin-top 30px
        height auto
        background #fff
        border-radius 4px
        .student-tast-title
          height 90px
          line-height 90px
          font-size 18px
          color #333
          text-align center
          position relative
          .title-right
            position absolute
            top 0
            right 50px
            .input-with-select
              margin-top 31px
            .el-input
              float: left
              width 80px
              height 30px
              line-height 28px
              .el-input__inner
                height 30px
                width 100px
                line-height 30px
              .el-input__icon
                line-height 28px
            .serch-btn
              margin-left 10px
              font-size 14px
            .export-btn
              cursor pointer
              display inline-block
              font-size 14px
              margin-left 10px
              width 90px
              height 25px
              line-height 25px
              text-align center
              background #FFD4E0
              color #ff366d
              border-radius 13px
        .table-wrap
          padding 0 20px
          .el-table
            border 1px solid #eee
  .j
    width 0
</style>
