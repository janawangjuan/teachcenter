<template>
  <div class="dataStatisticsAq-wrap">
    <div class="dataStatisticsAq-wrap-s">
      <classCenterHeader style="overflow: unset" :classId="$route.params.classId"></classCenterHeader>
      <div class="content">
        <aqStatistics></aqStatistics>
        <!--<div class="content-title">
          <span class="title-p">答疑数据统计</span>
          <a  :href="str" download="教学中心" class="button-a" >导出表格</a>
        </div>
        <div class="content-content">
          <div class="content-top">
            <ul class="top-ul">
              <li class="li-usual special">本月度问题统计</li>
              <li class="li-usual">所有问题 1111个</li>
              <li class="li-usual">已追问 753个</li>
              <li class="li-usual">已解决 5个</li>
              <li class="li-usual">未回复 5个</li>
              <li class="li-usual border-right-has">已回复 600个</li>
            </ul>
          </div>
          <div class="content-middle">
            <div class="example-map-wrap" v-if="showEchart">
              <div class="echart-wrap" id="pieId"></div>
              <p class="echart-name-p">
                2019年4月份答疑情况示例图
                <a href="javascript:;" class="check-table-a" @click="changeShowEchart"><i class="icon-table"></i>查看表格</a>
              </p>
            </div>
            <div class="example-table-wrap" v-if="!showEchart">
              <div class="table-wrap">
                <table class="table-wrap-s">
                  <tr class="tr-th">
                    <td class="first" colspan="1"><span class="title1">问题状态</span><br><span class="title2">周</span></td>
                    <td>未回复问题条数</td>
                    <td>学员追问问题条数</td>
                    <td>已回复问题条数</td>
                    <td>已解决问题条数</td>
                    <td>小计</td>
                  </tr>
                  <tr>
                    <td class="first-td">第一周</td>
                    <td>10</td>
                    <td>20</td>
                    <td>20</td>
                    <td>20</td>
                    <td>20</td>
                  </tr>
                  <tr>
                    <td class="first-td">第二周</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </table>
              </div>
              <p class="table-name-p">
                2019年4月份答疑情况统计图表
                <a href="javascript:;" class="check-table-a" @click="changeShowEchart"><i class="icon-table"></i>查看图表</a>
              </p>
            </div>
          </div>
          <div class="content-bottom">
            <ul class="c-b-ul">
              <li class="c-b-li" v-for="(item,index) in yearList" :class="[index==selectMonth?'active':'',index>3?'noTime':'']">
                <el-tooltip class="item" effect="dark" content="此月份尚未开始，请点击其他时间" placement="bottom-start" :disabled="(index<current+1)">
                  <div class="li-main" @click="changeMonth(item,index)">
                    <span class="month-span">{{item.month}}月</span><br/><span class="year-span">2019</span>
                  </div>
                </el-tooltip>
                <div class="current-month" v-if="index == 3">
                  <span class="current-month-span">当前月</span>
                </div>
                <div class="line" v-if="!(index==(yearList.length-1))"></div>
              </li>
            </ul>
          </div>
        </div>-->
      </div>
    </div>

  </div>
</template>

<script>
  import classCenterHeader from '@/components/classCenterHeader'
  import aqStatistics from '../youboCenter/aqStatistics'
  import echarts from 'echarts'
  import Request from '../../request'
  export default {
    name: "dataStatisticsAq",
    components:{
      classCenterHeader,
      aqStatistics
    },
    mounted(){
      this.drawPie()
    },
    data(){
      return{
        str:'',
        current:3,
        selectMonth:3,
        showEchart:true,   //默认显示图表
        yearList:[{
          month:1,year:2019
        },{
          month:2,year:2019
        },{
          month:3,year:2019
        },{
          month:4,year:2019
        },{
          month:5,year:2019
        }]
      }
    },
    methods:{
      changeMonth(params,index){   //切换月份
        if(index>this.current){
          return false
        }
        this.selectMonth = index
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
            //data:['2015','2016','2017']
          },
          dataset: {
            dimensions: ['product', '已解决', '已追问', '未回复','已回复'],
            source: [
              ['product', '已解决', '已追问', '未回复','已回复'],
              ['第一周', 43.3, 85.8, 93.7,10],
              ['第二周', 83.1, 73.4, 55.1,20],
              ['第三周', 72.4, 53.9, 39.1,40],
              ['第四周', 72.4, 53.9, 39.1,40],
            ]
          },
          xAxis: {type: 'category',axisPointer: {
              type: 'shadow'
            }},
          yAxis: {},
          // Declare several bar series, each will be mapped
          // to a column of dataset.source by default.
          series: [
            {type: 'bar',color:'#729CD6'},
            {type: 'bar',color:'#5BBF48'},
            {type: 'bar',color:'#F29754'},
            {type: 'bar',color:'#A2E4B4'},
          ],
        })
      }
    }
  }
</script>

<style lang="stylus">
.dataStatisticsAq-wrap
  width 100%
  height 100%
  background #f9fafb
  .dataStatisticsAq-wrap-s
    width 100%
    height 100%
    padding 20px
    display flex
    flex-direction column
    .content
      width 100%
      flex 1
      display flex
      flex-direction column
      overflow hidden
      .content-title
        height 55px
        .title-p
          display inline-block
          margin-top 25px
          font-size 18px
          color #333333
          font-weight bold
        .button-a
          display inline-block
          float: right
          width 100px
          height 25px
          background #FFD4E0
          text-align center
          margin-top 20px
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
          padding 0 50px
          margin-top 25px
          .example-map-wrap
            width 100%
            height 100%
            .echart-wrap
              height 350px
              width 100%
              background #f2f2f2
              padding-top 20px
              border-radius 10px
            .echart-name-p
              font-size 18px
              color #333
              text-align center
              margin-top 25px
              .check-table-a
                display inline-block
                font-size 14px
                color #ff366d
                float right
          .example-table-wrap
            .table-wrap
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
                    right:10px;
                    font-size 12px
                    color #666
                  .title2
                    position: absolute;
                    top: 26px;
                    left:25px;
                    font-size 12px
                    color #666
                td[class=first]
                  width: 110px;
                td[class=first]:before
                  content: "";
                  position: absolute;
                  width: 1px;
                  height: 110px;
                  top: 0;
                  left: 0;
                  background-color: #e9e9e9;
                  display: block;
                  transform: rotate(-63deg);
                  transform-origin: top;
                .tr-th
                  td
                    color #333
                .first-td
                  color #333
            .table-name-p
              font-size 18px
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
  .fffff
    width 0
</style>
