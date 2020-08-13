<template>
  <iScroll :id="'studentReport'" :is-refresh="scrollRefresh">
    <div class="studentReport-wrap">
      <div class="s-r-title">
        <div class="title-left">总体完成情况</div>
        <div class="title-right"></div>
      </div>
      <div class="student-table-wrap">
        <el-table
          :data="tableData"
          stripe
          border
          height="340"
          style="width: 100%">
          <el-table-column
            prop="date"
            label="日期"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="address"
            label="地址">
          </el-table-column>
        </el-table>
      </div>
      <div class="single-student-wrap">
        <div class="s-t-title">
          <img src="" alt="" width="32" height="32"><span class="name-span">路费</span>
        </div>
        <div class="s-t-content">
          <div class="content-left">
            <div class="taskEcharts" id="taskEcharts"></div>
          </div>
          <div class="content-right">
            <div class="timeEcharts" id="timeEcharts"></div>
          </div>
        </div>
      </div>
    </div>
  </iScroll>
</template>

<script>
  import echarts from 'echarts'
  import iScroll from '@/components/i-scroll'
  export default {
    name: "studentReport",
    components:{
      iScroll
    },
    data(){
      return{
        showM:false,
        scrollRefresh:false,
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      }
    },
    mounted(){
      this.drawPie()
      this.drawPie1()
    },
    methods:{
      drawPie(){
        const this_ = this;
        this.chartPie = echarts.init(document.getElementById('taskEcharts'));
        this.chartPie.setOption({
          title: {
            text: '任务完成情况',
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
              data : ['di','yi','zhou']
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
              data: [10,20,30],
              color:'#DB8E92'
            },
            {
              name: '进行中',
              type: 'bar',
              data: [20,30,40],
              color:'#D7DD9A'
            },
            {
              name: '已完成',
              type: 'bar',
              data: [20,30,40],
              color:'#FCE58D'
            }
          ]
        })
      },
      drawPie1(){
        const chartPie = echarts.init(document.getElementById('timeEcharts'));
        chartPie.setOption({
          tooltip: {},
          legend: {
            data: [ '实际开销（Actual Spending）']
          },
          radar: {
            // shape: 'circle',
            name: {
              textStyle: {
                color: '#666',
                fontSize:'12px',
                borderRadius: 3,
                padding: [3, 5]
              }
            },
            indicator: [
              { name: '已解决', max: 100},
              { name: '已回复', max: 100},
              { name: '未回复', max: 100},
              { name: '学员追问', max: 100}
            ],
            radius: 80
          },
          series: [{
            type: 'radar',
            // areaStyle: {normal: {}},
            data : [
              {
                value : [ 10, 50, 30, 90],
                name : '实际开销（Actual Spending）',
                areaStyle: {
                  normal: {
                    opacity: 0.2,
                    color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                      {
                        color: '#ff366d',
                        offset: 0
                      },
                      {
                        color: '#ff366d',
                        offset: 1
                      }
                    ])
                  }
                }
              }
            ]
          }]
        })
      }
    }
  }
</script>

<style lang="stylus">
  .studentReport-wrap{
    .s-r-title{
      height 55px
      line-height 55px
      .title-left{
        float: left
        font-size:18px;
        font-weight:bold;
        color:rgba(51,51,51,1);
      }
    }
    .student-table-wrap{
      height 400px
      background #fff
      padding 30px 50px
    }
    .single-student-wrap{
      height 580px
      background #fff
      margin-top 10px
      border-radius 4px
      .s-t-content{
        display flex
        .content-left{
          flex 1
          height 470px
          margin-right 10px
          border-radius 4px
          .taskEcharts{
            height 470px
            background #F8F8F8
          }
        }
        .content-right{
          width 400px
          border-radius 4px
          .timeEcharts{
            height 470px
            background #F8F8F8
          }
        }
      }
    }
  }
</style>
