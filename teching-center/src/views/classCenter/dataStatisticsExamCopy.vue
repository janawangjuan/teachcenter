<template>
  <div class="dataStatisticsExam-wrap">
    <div class="dataStatisticsExam-wrap-s">
      <classCenterHeader :classId="$route.params.classId"></classCenterHeader>
      <div class="content">
        <div class="content-title">
          <span class="title-p">测评数据统计</span>
        </div>
        <div class="content-content">
          <div class="content-left">
            <div class="content-left-main">
              <div class="echart-wrap-big" v-if="showEcharts">
                <div class="echart-wrap-title">
                  <div class="title-left">
                    <i class="select-exam-i" @click="showExamListBtn"></i>点击左侧图标筛选测评任务
                    <div class="exam-list-wrap" v-if="showExamList" v-on:mouseleave="hideExamlist">
                      <div class="dialog-border"></div>
                      <div class="ul-wrap">
                        <iScroll :is-refresh="scrollRefresh1">
                          <el-checkbox-group v-model="checkedExam" @change="handleCheckedExamsChange">
                            <ul class="exam-list-ul">
                              <li class="exam-list-li" v-for="(item,index) in examList">
                                <el-checkbox :label="item.value" :key="item.value">{{item.name}}</el-checkbox>
                              </li>
                            </ul>
                          </el-checkbox-group>
                        </iScroll>
                      </div>
                    </div>
                  </div>
                  <div class="title-right">
                    <a href="javascript:;" class="title-a-usual check-echarts-a" @click="changeTableEcharts"><i class="icon-check-echarts"></i>查看表格</a>
                    <a href="javascript:;" :href="str" download="教学中心" class="title-a-usual export-table-a">导出表格</a>
                  </div>
                </div>
                <div class="echart-wrap">
                  <p class="name-p">完成情况示例图</p>
                  <div id="completionEchart" class="completionEchart"></div>
                </div>
              </div>
              <div class="table-wrap-big" v-else>
                <div class="table-wrap-title">
                  <div class="title-left">
                    <el-select v-model="status" placeholder="请选择">
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
                    <a href="javascript:;" :href="str" download="教学中心" class="title-a-usual export-table-a">导出表格</a>
                  </div>
                </div>
                <div class="table-wrap">
                  <el-table
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%">
                    <el-table-column
                      prop="loginName"
                      width="120"
                      label="类别">
                    </el-table-column>
                    <el-table-column
                      prop="realName"
                      label="测评名称">
                    </el-table-column>
                    <el-table-column
                      prop="isFinishName"
                      label="完成情况（完成/未完成）">
                    </el-table-column>
                    <el-table-column
                      prop="avage"
                      width="150"
                      label="平均分">
                    </el-table-column>
                    <el-table-column
                      width="240"
                      label="操作">
                      <template slot-scope="scope">
                        <a href="javascript:;" class="mr20 table-a" @click="previewExam()" style="color:#ff366d">预览</a>
                        <a href="javascript:;" class="mr20 table-a">卷面分析</a>
                        <a href="javascript:;" class="table-a">测评统计</a>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </div>
          <div class="content-right">
            <div class="content-right-content">
              <div class="content-right-title">
                <div class="title-left"><i class="icon-zhuangyuan"></i>状元榜</div>
                <div class="title-right">仅限于本次测评</div>
              </div>
              <div class="content-right-main">
                <iScroll :is-refresh="scrollRefresh">
                  <ul class="rank-ul">
                    <li class="rank-li" v-for="(item,index) in rankList">
                      <div class="left">
                        <div class="avater-wrap">
                          <img class="avater-img" src="http://eximg.zbgedu.com/upload/avatar/big_0.png" alt="default">
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
                </iScroll>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import classCenterHeader from '@/components/classCenterHeader'
  import echarts from 'echarts'
  import Request from '../../request'
  import iScroll from '@/components/i-scroll'
  import {mapState} from 'vuex'
  export default {
    name: "dataStatisticsExam",
    components:{
      classCenterHeader,
      iScroll
    },
    data(){
      return{
        str:'',
        xData:[],
        status:'',
        checkedExam:[],
        showEcharts:true,
        scrollRefresh:false,
        scrollRefresh1:false,
        showExamList:false,
        examList:[{name:'第一章测试试卷',value:'1'},{name:'第二张测试试卷',value:'2'},{name:'第二张测试试卷',value:'3'},{name:'第二张测试试卷',value:'4'},{name:'第二张测试试卷',value:'5'},{name:'第二张测试试卷',value:'6'},{name:'第二张测试试卷',value:'7'},{name:'第二张测试试卷',value:'8'},{name:'第二张测试试卷',value:'9'},{name:'第二张测试试卷',value:'10'},{name:'第二张测试试卷',value:'11'}],
        statusList:[{label:'全部测评',value:''},{label:'未提交',value:'1'},{label:'已提交',value:'2'}],   //可选的测评
        tableData:[{},{},{}],
        rankList:[{name:'小二黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'},{name:'小三黑'}]
      }
    },
    computed:{
      ...mapState({
        //techLoginInfo:state => state.global.techLoginInfo
      }),
      techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))}
    },
    mounted(){
      this.getEchartData()
      this.drawPie()
      this.getCourseDeatil()
    },
    methods:{
      getCourseDeatil(){
        Request.ajax('node-course-plan-detail',{
          token: this.techLoginInfo.token,
          memberId: this.techLoginInfo.id,
          courseId: 'ac41351690cf1313b80c1313ecba5417',
          classId: '0f5acb3d2a331ea777dc00e79193252c',
        }).then(res=>{

        })
      },
      handleCheckedExamsChange(){
        console.log(this.checkedExam)
      },
      showExamListBtn(){
        this.showExamList = true
      },
      hideExamlist(){
        this.showExamList = false
      },
      changeTableEcharts(){   //查看图表或者表格
        this.showEcharts = !this.showEcharts
        if(this.showEcharts){
          setTimeout(()=>{
            this.drawPie()
          },100)
        }
      },
      previewExam(){   //预览试卷

      },
      getEchartData(){
        for(let i = 1;i<100;i++){
          this.xData.push(i)
        }
      },
      drawPie(){
        const this_ = this;
        this.chartPie = echarts.init(document.getElementById('completionEchart'));
        this.chartPie.setOption({
          tooltip: {
            formatter: function(params, ticket, callback) {
              console.log(params)
              return params.seriesName + "<br />数量数量数量数量数量数量数量数量数数量数量数数量数量数数量数量数数量数量数数量数量数量数量数量数量：" + params.value;
            },
            position: function (point, params, dom, rect, size) {
              // 固定在顶部
              return [point[0], point[1]];
            }
          },
          legend: {
            data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
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
            name:'名次',
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
              end: 5,
            }
          ],
          series: [
            {
              name:'邮件营销',
              type:'line',
              data:[120, 132, 101, 134, 90, 230, 210]
            },
            {
              name:'联盟广告',
              type:'line',
              data:[220, 182, 191, 234, 290, 330, 310]
            },
            {
              name:'视频广告',
              type:'line',
              data:[150, 232, 201, 154, 190, 330, 410]
            },
            {
              name:'直接访问',
              type:'line',
              data:[320, 332, 301, 334, 390, 330, 320]
            },
            {
              name:'搜索引擎',
              type:'line',
              data:[820, 932, 901, 934, 1290, 1330, 1320]
            }
          ]
        })
      }
    }
  }
</script>

<style lang="stylus">
  .dataStatisticsExam-wrap
    width 100%
    height 100%
    background #f9fafb
    .dataStatisticsExam-wrap-s
      width 100%
      height 100%
      padding 20px
      display flex
      flex-direction column
      .content
        width 100%
        flex 1
        height 0
        display flex
        flex-direction column
        .content-title
          height 55px
          .title-p
            display inline-block
            margin-top 25px
            font-size 18px
            color #333333
            font-weight bold
        .content-content
          flex 1
          display flex
          .content-left
            flex 1
            background #fff
            border-radius 4px
            padding 0 25px 20px
            .content-left-main
              height 100%
            .echart-wrap-big
              .echart-wrap-title
                height 80px
                .title-left
                  float: left
                  margin-top 31px
                  font-size 14px
                  line-height 30px
                  color #333
                  position relative
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
                          padding 0 20px
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
                .el-table
                  flex 1
                  overflow: auto;
                  max-height: 100%
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
          .content-right
            width 320px
            background #fff
            height 100%
            margin-left 10px
            border-radius 4px
            .content-right-content
              display flex
              height 100%
              flex-direction column
              .content-right-title
                height 70px
                font-size 12px
                color #333
                line-height 70px
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
                overflow hidden
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
                        padding-top 7px
                        height 38px
                        .avater-img
                          width 32px
                          height 32px
                    .right
                      float right
                      width 30px
                      font-size 14px
                      font-weight bold
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
    .llll
      width 1px
</style>
