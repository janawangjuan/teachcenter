<template>
  <div id="app" class="app">
    <div class="aqReportGather-wrap">
      <el-container>
        <el-header>
          <iHeader></iHeader>
        </el-header>
        <el-main>
          <div class="aqReportGather-content">
            <div class="title">
              <div class="title-content">
                <i class="huizong-icon"></i>汇总报告
              </div>
            </div>
            <div class="content-wrap">
              <div class="content">
                <div class="select-time-wrap">
                  <div class="select-time-wrap-left">
                    <el-select v-model="selectDay" placeholder="请选择">
                      <el-option
                        @click.native="selectDayFunc(item.value)"
                        v-for="item in dayList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        <span style="float: left">{{ item.label }}</span>
                      </el-option>
                    </el-select>
                  </div>
                  <div class="select-time-wrap-right">更新时间：{{webApi.formatDate(new Date().getTime()/1000,'ALL').slice(0,15)+'00'}}</div>
                </div>
                <p class="great-p">
                  尊敬的老师，您好！<br/>以下数据为您最新的问题汇总报告情况
                </p>
                <div class="total-num-wrap">
                  <span class="mr-20">总答疑数：{{getDataNum.all_count}}</span><span class="mr-20">已解决：{{getDataNum.resolved}}</span><span class="mr-20">学员追问未回复：{{getDataNum.unanswered+getDataNum.asked}}</span><span class="mr-20">已回复未解决：{{getDataNum.replied}}</span><span class="mr-20">获星数：{{getDataNum.grade_count}}</span>
                </div>
                <div class="echart-wrap">
                  <div class="pieId" id="pieId"></div>
                  <p class="echart-nam">问题答疑情况图表示例</p>
                </div>
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </div>
    <el-dialog
      title="请选择日期范围"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-date-picker
        v-model="askTime"
        type="daterange"
        unlink-panels
        range-separator="至"
        size="mini"
        @change="changeAskTime()"
        value-format="yyyy-MM-dd"
        start-placeholder="开始日期"
        :picker-options="pickerOptions0"
        end-placeholder="结束日期">
      </el-date-picker>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" size="mini" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import iHeader from "@/components/i-header"
  import {mapState} from 'vuex'
  import echarts from 'echarts'
  import Request from '../../request'
  export default {
    name: "aqReportGather",
    components:{
      iHeader
    },
    computed:{
      ...mapState({
        //techLoginInfo:state=>state.global.techLoginInfo
      }),
      techLoginInfo(){return JSON.parse(this.cookie.get('techLoginInfo'))}
    },
    data(){
      return{
        dataShow:[0,0,0,0],  //实际的数值
        dataHide:[0,0,0,0],  //悬空的效果
        days:'0',
        start_time:'',
        end_time:'',
        selectDay:'0',
        askTime:null,
        dialogVisible:false,
        getDataNum:'',
        pickerOptions0: {   //设置提问时间不能大于当天
          disabledDate(time) {
            return time.getTime() > Date.now();//如果没有后面的-8.64e7就是不可以选择今天的
          }
        },
        dayList:[{
          label:'今天',
          value:'0'
        },{label:'最近三天',value:'3'},{label:'最近七天',value:'7'},{label:'最近一月',value:'30'},{label:'整体报告',value:'all'},{label:'自定义',value:'userDefined'}]
      }
    },
    mounted(){
      //this.drawPie()
      this.getCount()
    },
    watch:{
      days(){
        //this.getCount()
      }
    },
    methods:{
      changeAskTime(){   //改变提问时间
        if(this.askTime == null){
          this.start_time = ''
          this.end_time = ''
        }else{
          this.start_time = this.askTime[0]
          this.end_time = this.askTime[1]
        }
        this.getCount()
      },
      getCount(){
        Request.ajax('teacherBbsCount',{
          token:this.techLoginInfo.token,
          days:this.days,
          startDate:this.start_time,
          endDate:this.end_time
        }).then(res=>{
          if(res && res.state == 'success'){
            let data = res.data
            this.getDataNum = data
            this.dataShow = [data.all_count,data.resolved,data.unanswered+data.asked,data.replied]
            //this.dataHide = [0,data.all_count-data.resolved,data.all_count-data.resolved-data.unanswered-data.asked,data.all_count-data.resolved-data.unanswered-data.asked-data.replied]
            this.drawPie()
          }
        })
      },
      selectDayFunc(params){
        if(params!=='all'&&params!=='userDefined'){
          this.askTime = null
          this.start_time = ''
          this.end_time = ''
          this.days = params
          this.getCount()
        }else if(params=='all'){
          this.days = ''
          this.askTime = null
          this.start_time = ''
          this.end_time = ''
          this.getCount()
        }else{
          /*this.$prompt('请输入天数', '提示', {
            confirmButtonText: '确定',
            showCancelButton:false
          }).then(({ value }) => {
            this.days = value
          }).catch(() => {

          });*/
          this.days = ''
          this.dialogVisible = true
        }

      },
      drawPie(){
        const this_ = this;
        this.chartPie = echarts.init(document.getElementById('pieId'));
        this.chartPie.setOption({
          xAxis: {
            type: 'category',
            splitLine: {show:false},
            data: ['问题总数','已解决', '学员追问未回复', '已回复未解决']
          },
          yAxis: {
            type: 'value',
            name:'问题数量'
          },
          itemStyle:{
            color:'#4F76C6'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          series: [{
            data: this.dataShow,
            type: 'bar',
            stack:  '总量',
            barWidth:84,
            label:{
              show:true,
              position: 'inside'
            }
          }]
        })
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
    .aqReportGather-wrap
      width 100%
      height 100%
      .el-container
        height 100%
        .el-main
          background #f7f7f7
          padding 0
          .aqReportGather-content
            width 1200px
            margin 0 auto
            height 100%
            display flex
            flex-direction column
            .title
              height 50px
              .title-content
                height 50px
                line-height 50px
                font-size 18
                color #333
                padding-left 4px
                .huizong-icon
                  display inline-block
                  width 24px
                  height 24px
                  position relative
                  margin-right 6px
                  top 6px
                  background url("../../assets/img/icon_image.png") no-repeat -34px -153px
            .content-wrap
              height 680px
              padding-bottom 20px
              .content
                background #fff
                line-height 24px
                height 100%
                border-radius 10px
                .total-num-wrap
                  line-height 28px
                  font-size 12px
                  color #ff366d
                  padding-left 30px
                  margin-top 18px
                  .mr-20
                    margin-right: 20px
                .great-p
                  padding-left 30px
                  color #333
                  font-size 14px
                  margin-top 10px
                .echart-wrap
                  width 1200px
                  height 400px
                  margin-top 20px
                  .pieId
                    margin 0 auto
                    background #F2F2F2
                    border-radius 10px
                    width 1140px
                    height 400px
                  .echart-nam
                    font-size 18px
                    line-height 50px
                    color #333333
                    text-align center
                .select-time-wrap
                  padding-left 30px
                  padding-top 25px
                  height 60px
                  width 100%
                  .select-time-wrap-left
                    float left
                    .el-select
                      .el-input
                        .el-input__inner
                          border none
                          height 34px
                          width 118px;
                          background #F5F5F5
                          font-size 14px
                          color #333
                  .select-time-wrap-right
                    float right
                    margin-top 20px
                    font-size 12px
                    color #666
                    margin-right 30px
  .lleeee
    font-size 1px
</style>
