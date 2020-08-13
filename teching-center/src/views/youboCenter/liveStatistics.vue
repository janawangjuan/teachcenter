<template>
  <div class="liveStatistics-wrap">
    <div class="content">
      <div class="content-title">
        <span class="title-p">参与直播录播数据统计</span>
        <a href="javascript:;" class="check-table-a" @click="changeShowEchart"><i class="icon-table"></i>查看{{showEchart?'表格':'图表'}}</a>
        <!--<a href="javascript:;" v-show="showEchart" class="check-table-a" @click="changeShowEchart"><i class="icon-table"></i>查看表格</a>-->
        <a  @click="exportTable" class="button-a" >{{isExporting?'正在导出...':'导出表格'}}</a>
      </div>
      <div class="content-content">
        <!--<div class="content-top">
          <ul class="top-ul">
            <li class="li-usual special">本月度问题统计</li>
            <li class="li-usual">所有问题 1111个</li>
            <li class="li-usual">已追问 753个</li>
            <li class="li-usual">已解决 5个</li>
            <li class="li-usual">未回复 5个</li>
            <li class="li-usual border-right-has">已回复 600个</li>
          </ul>
        </div>-->
        <div class="content-middle">
          <div class="example-map-wrap" v-show="showEchart">
            <div class="text-p">
              本月度直播参与统计：本月直播场次  {{echartData.taskTotal}}场 <span class="live-span">观看直播人数   {{echartData.inSceneNum}}人</span> <span class="video-span">观看录播人数   {{echartData.notInSceneNum}}人</span>
            </div>
            <div class="echart-wrap" id="pieId"></div>
            <p class="echart-name-p">
              <!--2019年4月份学员参与直播活动示例图-->

            </p>
          </div>
          <div class="example-table-wrap" v-show="!showEchart">
            <div class="text-p">
              直播场次：{{tableListData.openCourseTotal}}场 <span class="live-span">观看直播人数{{tableListData.inSceneNum}}人</span> <span class="video-span">观看录播人数{{tableListData.notInSceneTotal}}人</span>
            </div>
            <div class="table-wrap">
              <table class="table-wrap-s">
                <tr class="tr-th">
                  <td class="first" colspan="1"><span class="title1">参与方式</span><br><span class="title2">直播场次</span></td>
                  <td>周计划数</td>
                  <td>参与直播人数</td>
                  <td>参与录播人数</td>
                  <td>小计</td>
                </tr>
                <tr class="tr-th" v-if="!tableListData">
                  <td colspan="5" >暂无数据</td>
                </tr>
                <template  v-if="tableListData">
                  <tr v-for="(item,index) in tableListData.openCourseStatisticsList" :key="index">
                    <td class="first-td">{{item.title}}</td>
                    <td>{{'第'+webApi.toZhDigit(item.weekIndex)+'周学习计划'}}（{{webApi.formatDate(item.startDate,'YMD')}}至{{webApi.formatDate(item.endDate,'YMD')}}）</td>
                    <td>{{item.inSceneNum}}</td>
                    <td>{{item.notInSceneNum}}</td>
                    <td>{{item.sum}}</td>
                  </tr>
                </template>
              </table>
            </div>
            <p class="table-name-p">


            </p>
          </div>
        </div>
        <div class="content-bottom" v-if="showEchart">
          <ul class="c-b-ul">
            <li class="c-b-li" v-for="(item,index) in yearList" :class="[index==selectMonth.index?'active':'',index>current?'noTime':'']">
              <el-tooltip class="item" effect="dark" content="此月份尚未开始，请选择其他月份~" placement="bottom-start" :disabled="(item.isCurr != 3)">
                <div class="li-main" @click="changeMonth(item,index)">
                  <span class="month-span">{{item.month}}月</span><br/><span class="year-span">{{item.year}}</span>
                </div>
              </el-tooltip>
              <div class="current-month" v-if="index == current">
                <span class="current-month-span">当前月</span>
              </div>
              <div class="line" v-if="!(index==(yearList.length-1))"></div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import Request from '../../request'
  export default {
    name: "liveStatistics",
    mounted(){
      this.getMouthList()
      this.getOpenCourseList()
      //this.getEchartData()
    },
    props:['classCourseInfo'],
    computed: {
      techLoginInfo() {
        return JSON.parse(this.cookie.get('techLoginInfo'))
      },
    },
    data(){
      return{
        str:'',
        current:'',
        selectMonth:'',
        showEchart:true,   //默认显示图表
        envType:parseInt(this.cookie.get('envType')),
        yearList:'',
        isExporting:false,
        tableListData:'',
        echartData:''
      }
    },
    methods:{
      changeMonth(params,index){   //切换月份
        if(index>this.current){
          return false
        }
        this.selectMonth = params
        this.getEchartData()
      },
      exportTable(){
        if(this.isExporting){
          return
        }
        this.isExporting = true
        setTimeout(() => {
          this.isExporting = false
        },3000)
        this.webApi.postExcelFile({
          token:this.techLoginInfo.token,
          classId: this.$route.params.classId,
          courseId: this.classCourseInfo.courseId,
        },(this.envType=='1'?'https://apidemo.zbgedu.com':'https://zbapi.zbgedu.com')+'/api/study/userAction/statistics/openCourse/export')
      },
      getMouthList(){
        Request.ajax('queryStudyPlanMonth',{
          token:this.techLoginInfo.token,
          classId:this.$route.params.classId,
        }).then((res)=>{
          if(res && res.state == 'success'){
            let flag = false
            res.data.forEach((item,index) => {
              item.index = index
              if(item.isCurr == 2){
                this.selectMonth = item
                this.current = index
                flag = true
              }
            })
            if(!flag){
              this.selectMonth = res.data[0]
            }
            this.yearList = res.data
            this.getEchartData()
          }else{
            this.webApi.alert('服务器异常，请重试～')
          }

        })
      },
      getOpenCourseList(){
        Request.ajax('getOpenCourseList',{
          token:this.techLoginInfo.token,
          classId:this.$route.params.classId,
          courseId:this.classCourseInfo.courseId,
        }).then((res)=>{
          if(res && res.state == 'success'){
            this.tableListData = res.data
          }else{
            this.webApi.alert('服务器异常，请重试～')
          }

        })
      },
      getEchartData(){
        let str = this.selectMonth.year+''+this.webApi.extra(this.selectMonth.month)
        Request.ajax('selectLiveListChart',{
          token:this.techLoginInfo.token,
          classId:this.$route.params.classId,
          courseId:this.classCourseInfo.courseId,
          date:str
        }).then(res => {
          if(res && res.state == 'success'){
            this.echartData = res.data
            this.drawPie()
          }
        })
      },
      changeShowEchart(){
        this.showEchart = !this.showEchart
        if(this.showEchart){
          setTimeout(()=>{
            this.drawPie()
          },100)
        }
      },
      drawPie(){
        const this_ = this;
        this.chartPie = echarts.init(document.getElementById('pieId'));
        this.chartPie.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          grid: {
            bottom: '20%'
          },
          legend: {
            data: ['直播参与人数', '录播参与人数']
          },
          xAxis: {
            type: 'category',
            data: this.echartData.nameList,
            tooltip:{
              show:false
            },
            axisLabel:{
              formatter:(params) => {
                console.log(params)
                let arr = params.split('@@')
                return [
                  '{a|'+arr[0]+'}',
                  '{b|'+arr[1]+'}'
                ].join('\n')
              },
              rich: {
                a: {
                  color: '#333',
                  lineHeight: 10
                },
                b: {
                  color: '#666',
                  height: 20
                },
              }
            }
          },
          yAxis: {
            type: 'value',
            name:'学员人数(人)',
            nameTextStyle:{
              color:"#666",
            }
          },
          // Declare several bar series, each will be mapped
          // to a column of dataset.source by default.
          series: [
            {
              name: '直播参与人数',
              type: 'bar',
              color:'#DA9E77',
              data: this.echartData.liveList
            },
            {
              name: '录播参与人数',
              type: 'bar',
              color:'#D8CB89',
              data: this.echartData.reviewList
            }
          ]
        })
      }
    }
  }
</script>

<style lang="stylus">
  .liveStatistics-wrap
    width 100%
    height 100%
    .content
      width 100%
      height 100%
      display flex
      flex-direction column
      .content-title
        height 60px
        text-align right
        .title-p
          display inline-block
          margin-top 18px
          font-size 18px
          color #333333
          float: left
          font-weight bold
        .check-table-a
          font-size 14px
          color #ff366d
          margin-top 18px
          line-height 25px
          margin-right 20px
        .button-a
          display inline-block
          float: right
          width 100px
          height 25px
          background #FFD4E0
          text-align center
          margin-top 18px
          line-height 25px
          color #ff366d
          cursor pointer
          font-size 14px
          border-radius 13px
          border none
        .button-a:focus
          outline none
      .content-content
        flex 1
        background #fff
        border-radius 4px
        overflow: auto;
        .content-top
          overflow hidden
          .top-ul
            float left
            margin-top 30px
            margin-left 50px
            .li-usual
              float left
              padding 0 30px
              height 40px
              line-height 40px
              font-size 14px
              color #666
              border 1px solid #e9e9e9
              border-right none
            .border-right-has
              border-right 1px solid #e9e9e9
            .special
              color #FF366D
        .content-middle
          .example-map-wrap
            width 100%
            height 100%
            .text-p
              font-size 12px
              color #333
              height 66px
              line-height 66px
              float: left
              margin-left 15px
              margin-bottom 15px
              .live-span
                margin-left 10px
                color #DA9E77
              .video-span
                margin-left 10px
                color #C6CC84
            .echart-wrap
              height 400px
              width 100%
              padding-top 20px
              border-radius 10px
            .echart-name-p
              font-size 18px
              padding 0 50px
              color #333
              text-align center
              margin-top 25px
              .check-table-a
                display inline-block
                font-size 14px
                color #ff366d
                float right
          .example-table-wrap
            .text-p
              font-size 12px
              color #333
              height 66px
              line-height 66px
              float: left
              margin-left 15px
              margin-bottom 15px
              .live-span
                margin-left 10px
                color #BFA5A5
              .video-span
                margin-left 10px
                color #C6CC84
            .table-wrap
              padding 0 60px
              .table-wrap-s
                width 100%
                border-collapse collapse
                border 1px solid #e9e9e9
                td
                  border 1px solid #e9e9e9
                  height 50px
                  text-align: center;
                  position: relative
                  color #666
                  font-size 14px
                  .title1
                    position: absolute;
                    top: 5px;
                    right:65px;
                    font-size 12px
                    color #666
                  .title2
                    position: absolute;
                    top: 26px;
                    left:65px;
                    font-size 12px
                    color #666
                td[class=first]
                  width: 300px;
                td[class=first]:before
                  content: "";
                  position: absolute;
                  width: 1px;
                  height: 308px;
                  top: 0;
                  left: 0;
                  background-color: #e9e9e9;
                  display: block;
                  transform: rotate(-80.5deg);
                  transform-origin: top;
                .tr-th
                  td
                    color #333
                .first-td
                  color #333
                tr:nth-child(odd)
                  background #f7f7f7
            .table-name-p
              font-size 18px
              padding 0 60px 30px
              color #333
              text-align center
              margin-top 25px
              .check-table-a
                display inline-block
                font-size 14px
                color #ff366d
                float right
        .content-bottom
          text-align center
          width 96%
          margin: 50px auto 0;
          height: 115px;
          overflow: hidden;
          overflow-x: auto;
          .c-b-ul
            display inline-block
            white-space: nowrap;
            .c-b-li
              position relative
              display inline-block
              .li-main
                width 57px
                height 57px
                background #96AAFE
                text-align center
                color #29335F
                float left
                border-radius 50%
                line-height 16px
                cursor pointer
                .month-span
                  display inline-block
                  margin-top 12px
                  font-size 16px
                .year-span
                  font-size 12px
              .current-month
                width 57px
                height 22px
                background #fff
                padding-top 2px
                position absolute
                top 48px
                .current-month-span
                  display inline-block
                  width 57px
                  height 20px
                  background #D0D9FF
                  border-radius 10px
                  text-align center
                  line-height 20px
                  font-size 12px
                  color #29335F
              .line
                width 70px
                height 1px
                background #e9e9e9
                float left
                margin-top 24%
              &.active
                top 9px
                .li-main
                  width 70px
                  height 70px
                  background #29335F
                  color #fff
                  .month-span
                    margin-top 17px
                .current-month
                  width 70px
                  height 27px
                  background #fff
                  padding-top 2px
                  top 56px
                  .current-month-span
                    width 70px
                    height 25px
                    font-size 14px
                    line-height 25px
                    border-radius 13px
              &.noTime
                .li-main
                  background #eee
                  color #999
                  cursor default
</style>
